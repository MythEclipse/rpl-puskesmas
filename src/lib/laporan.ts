"use server";

import { db } from "./db";
import { requireRole } from "./server";

export async function getLaporanKunjungan(filter: {
  startDate?: Date;
  endDate?: Date;
  poliId?: string;
}) {
  await requireRole("kepalaPuskesmas", "admin");

  const where: any = {};

  if (filter.startDate || filter.endDate) {
    where.tanggal = {};
    if (filter.startDate) where.tanggal.gte = filter.startDate;
    if (filter.endDate) where.tanggal.lte = filter.endDate;
  }

  if (filter.poliId) where.poliId = filter.poliId;

  const kunjungan = await db.kunjungan.findMany({
    where,
    include: {
      poli: true,
      pasien: true,
    },
    orderBy: { tanggal: "desc" },
  });

  // Group by poli
  const byPoli: Record<
    string,
    { poli: string; total: number; umum: number; bpjs: number }
  > = {};

  for (const k of kunjungan) {
    if (!byPoli[k.poliId]) {
      byPoli[k.poliId] = { poli: k.poli.nama, total: 0, umum: 0, bpjs: 0 };
    }
    byPoli[k.poliId].total++;
    if (k.tipePasien === "umum") byPoli[k.poliId].umum++;
    else byPoli[k.poliId].bpjs++;
  }

  return {
    total: kunjungan.length,
    byPoli: Object.values(byPoli),
    detail: kunjungan,
  };
}

export async function getLaporan10Penyakit(filter: {
  startDate?: Date;
  endDate?: Date;
}) {
  await requireRole("kepalaPuskesmas", "admin");

  const where: any = {};

  if (filter.startDate || filter.endDate) {
    where.createdAt = {};
    if (filter.startDate) where.createdAt.gte = filter.startDate;
    if (filter.endDate) where.createdAt.lte = filter.endDate;
  }

  const rekamMedis = await db.rekamMedis.findMany({
    where,
    select: { diagnosis: true },
  });

  // Count diagnoses
  const diagnosisCount: Record<string, number> = {};

  for (const rm of rekamMedis) {
    const diagnosis = rm.diagnosis.toLowerCase().trim();
    diagnosisCount[diagnosis] = (diagnosisCount[diagnosis] || 0) + 1;
  }

  // Sort and get top 10
  const sorted = Object.entries(diagnosisCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([diagnosis, count], index) => ({
      rank: index + 1,
      diagnosis,
      count,
    }));

  return {
    total: rekamMedis.length,
    top10: sorted,
  };
}

export async function getLaporanPemakaianObat(filter: {
  startDate?: Date;
  endDate?: Date;
}) {
  await requireRole("kepalaPuskesmas", "admin", "apoteker");

  const where: any = {};

  if (filter.startDate || filter.endDate) {
    where.createdAt = {};
    if (filter.startDate) where.createdAt.gte = filter.startDate;
    if (filter.endDate) where.createdAt.lte = filter.endDate;
  }

  const detailResep = await db.detailResep.findMany({
    where,
    include: { obat: true },
  });

  // Group by obat
  const byObat: Record<
    string,
    { obat: string; satuan: string; totalPemakaian: number; totalNilai: number }
  > = {};

  for (const dr of detailResep) {
    if (!byObat[dr.obatId]) {
      byObat[dr.obatId] = {
        obat: dr.obat.nama,
        satuan: dr.obat.satuan,
        totalPemakaian: 0,
        totalNilai: 0,
      };
    }
    byObat[dr.obatId].totalPemakaian += dr.jumlah;
    byObat[dr.obatId].totalNilai += dr.jumlah * dr.obat.harga;
  }

  const sorted = Object.values(byObat).sort(
    (a, b) => b.totalPemakaian - a.totalPemakaian
  );

  return {
    totalTransaksi: detailResep.length,
    pemakaian: sorted,
  };
}

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalPasien, kunjunganHariIni, antreanAktif, obatStokRendah] =
    await Promise.all([
      db.pasien.count(),
      db.kunjungan.count({
        where: {
          tanggal: { gte: today, lt: tomorrow },
        },
      }),
      db.kunjungan.count({
        where: {
          tanggal: { gte: today, lt: tomorrow },
          status: { in: ["menunggu", "dipanggil"] },
        },
      }),
      db.obat.count({
        where: {
          isActive: true,
          stok: { lte: 10 },
        },
      }),
    ]);

  return {
    totalPasien,
    kunjunganHariIni,
    antreanAktif,
    obatStokRendah,
  };
}
