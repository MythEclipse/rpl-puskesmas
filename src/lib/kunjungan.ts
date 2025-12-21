"use server";

import { db } from "./db";
import { requireRole } from "./server";

// Get next antrean number for today for a specific poli
async function getNextAntrean(poliId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const lastKunjungan = await db.kunjungan.findFirst({
    where: {
      poliId,
      tanggal: {
        gte: today,
        lt: tomorrow,
      },
    },
    orderBy: { nomorAntrean: "desc" },
  });

  return (lastKunjungan?.nomorAntrean ?? 0) + 1;
}

export async function createKunjungan(data: {
  pasienId: string;
  poliId: string;
  tipePasien: "umum" | "bpjs";
}) {
  await requireRole("pendaftaran", "admin");

  const nomorAntrean = await getNextAntrean(data.poliId);

  const kunjungan = await db.kunjungan.create({
    data: {
      pasienId: data.pasienId,
      poliId: data.poliId,
      tipePasien: data.tipePasien,
      nomorAntrean,
      status: "menunggu",
    },
    include: {
      pasien: true,
      poli: true,
    },
  });

  // Create Pembayaran record for umum patients
  if (data.tipePasien === "umum") {
    await db.pembayaran.create({
      data: {
        kunjunganId: kunjungan.id,
        status: "belumBayar",
      },
    });
  }

  // Create KlaimBPJS record for BPJS patients
  if (data.tipePasien === "bpjs") {
    const nomorKlaim = `BPJS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await db.klaimBPJS.create({
      data: {
        kunjunganId: kunjungan.id,
        nomorKlaim,
        status: "pending",
      },
    });
  }

  return kunjungan;
}

export async function getAntreanHariIni(poliId?: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return db.kunjungan.findMany({
    where: {
      tanggal: {
        gte: today,
        lt: tomorrow,
      },
      ...(poliId ? { poliId } : {}),
    },
    include: {
      pasien: true,
      poli: true,
    },
    orderBy: [{ status: "asc" }, { nomorAntrean: "asc" }],
  });
}

export async function getKunjunganById(id: string) {
  return db.kunjungan.findUnique({
    where: { id },
    include: {
      pasien: true,
      poli: true,
      rekamMedis: {
        include: {
          dokter: true,
          resep: {
            include: {
              detailResep: {
                include: { obat: true },
              },
            },
          },
        },
      },
      pembayaran: true,
      klaimBPJS: true,
    },
  });
}

export async function updateStatusKunjungan(
  id: string,
  status: "menunggu" | "dipanggil" | "diperiksa" | "selesai"
) {
  return db.kunjungan.update({
    where: { id },
    data: { status },
  });
}

export async function getKunjunganMenungguPoli(poliId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return db.kunjungan.findMany({
    where: {
      poliId,
      status: { in: ["menunggu", "dipanggil"] },
      tanggal: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      pasien: true,
      poli: true,
    },
    orderBy: { nomorAntrean: "asc" },
  });
}

// Poli functions
export async function getAllPoli() {
  return db.poli.findMany({
    where: { isActive: true },
    orderBy: { nama: "asc" },
  });
}

export async function createPoli(data: {
  kode: string;
  nama: string;
  deskripsi?: string;
}) {
  await requireRole("admin");
  return db.poli.create({ data });
}

export async function updatePoli(
  id: string,
  data: { nama?: string; deskripsi?: string; isActive?: boolean }
) {
  await requireRole("admin");
  return db.poli.update({ where: { id }, data });
}
