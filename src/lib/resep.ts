"use server";

import { db } from "./db";
import { requireRole } from "./server";

// Create resep by doctor
export async function createResep(data: {
  rekamMedisId: string;
  items: Array<{
    obatId: string;
    jumlah: number;
    aturan: string;
  }>;
  catatan?: string;
}) {
  await requireRole("dokter");

  const resep = await db.resep.create({
    data: {
      rekamMedisId: data.rekamMedisId,
      catatan: data.catatan,
      status: "dibuat",
    },
  });

  // Create detail resep
  for (const item of data.items) {
    await db.detailResep.create({
      data: {
        resepId: resep.id,
        obatId: item.obatId,
        jumlah: item.jumlah,
        aturan: item.aturan,
      },
    });
  }

  return db.resep.findUnique({
    where: { id: resep.id },
    include: {
      detailResep: {
        include: { obat: true },
      },
      rekamMedis: {
        include: {
          kunjungan: {
            include: { pasien: true },
          },
        },
      },
    },
  });
}

// Get pending resep for apoteker
export async function getResepMenunggu() {
  return db.resep.findMany({
    where: {
      status: { in: ["dibuat", "diproses"] },
    },
    include: {
      detailResep: {
        include: { obat: true },
      },
      rekamMedis: {
        include: {
          kunjungan: {
            include: { pasien: true, poli: true },
          },
          dokter: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getResepById(id: string) {
  return db.resep.findUnique({
    where: { id },
    include: {
      detailResep: {
        include: { obat: true },
      },
      rekamMedis: {
        include: {
          kunjungan: {
            include: { pasien: true, poli: true, pembayaran: true },
          },
          dokter: true,
        },
      },
      apoteker: true,
    },
  });
}

// Process resep by apoteker
export async function processResep(resepId: string) {
  const apoteker = await requireRole("apoteker");

  const resep = await db.resep.findUnique({
    where: { id: resepId },
    include: {
      detailResep: {
        include: { obat: true },
      },
      rekamMedis: {
        include: {
          kunjungan: {
            include: { pembayaran: true },
          },
        },
      },
    },
  });

  if (!resep) throw new Error("Resep tidak ditemukan");

  // Check stock availability
  const stockIssues: string[] = [];
  let totalObat = 0;

  for (const item of resep.detailResep) {
    if (item.obat.stok < item.jumlah) {
      stockIssues.push(
        `${item.obat.nama}: stok ${item.obat.stok}, butuh ${item.jumlah}`
      );
    }
    totalObat += item.obat.harga * item.jumlah;
  }

  if (stockIssues.length > 0) {
    // Mark as incomplete
    await db.resep.update({
      where: { id: resepId },
      data: {
        status: "tidakLengkap",
        apotekerId: apoteker.id,
        catatan: `Stok tidak cukup: ${stockIssues.join(", ")}`,
      },
    });
    return { success: false, issues: stockIssues };
  }

  // Reduce stock
  for (const item of resep.detailResep) {
    await db.obat.update({
      where: { id: item.obatId },
      data: {
        stok: { decrement: item.jumlah },
      },
    });
  }

  // Update resep status
  await db.resep.update({
    where: { id: resepId },
    data: {
      status: "selesai",
      apotekerId: apoteker.id,
    },
  });

  // Update pembayaran if umum
  if (resep.rekamMedis.kunjungan.pembayaran) {
    const pembayaran = resep.rekamMedis.kunjungan.pembayaran;
    await db.pembayaran.update({
      where: { id: pembayaran.id },
      data: {
        totalObat,
        total: pembayaran.totalLayanan + totalObat,
      },
    });
  }

  // Update kunjungan status to selesai
  await db.kunjungan.update({
    where: { id: resep.rekamMedis.kunjunganId },
    data: { status: "selesai" },
  });

  return { success: true };
}

// Mark resep as incomplete manually
export async function markResepTidakLengkap(resepId: string, alasan: string) {
  const apoteker = await requireRole("apoteker");

  return db.resep.update({
    where: { id: resepId },
    data: {
      status: "tidakLengkap",
      apotekerId: apoteker.id,
      catatan: alasan,
    },
  });
}

// ============ OBAT FUNCTIONS ============

export async function getAllObat() {
  return db.obat.findMany({
    where: { isActive: true },
    orderBy: { nama: "asc" },
  });
}

export async function getObatById(id: string) {
  return db.obat.findUnique({ where: { id } });
}

export async function createObat(data: {
  kode: string;
  nama: string;
  satuan: string;
  stok: number;
  harga: number;
}) {
  await requireRole("admin", "apoteker");
  return db.obat.create({ data });
}

export async function updateObat(
  id: string,
  data: {
    nama?: string;
    satuan?: string;
    stok?: number;
    harga?: number;
    isActive?: boolean;
  }
) {
  await requireRole("admin", "apoteker");
  return db.obat.update({ where: { id }, data });
}

export async function updateStokObat(
  id: string,
  jumlah: number,
  tipe: "tambah" | "kurang"
) {
  await requireRole("admin", "apoteker");

  if (tipe === "tambah") {
    return db.obat.update({
      where: { id },
      data: { stok: { increment: jumlah } },
    });
  } else {
    const obat = await db.obat.findUnique({ where: { id } });
    if (!obat || obat.stok < jumlah) {
      throw new Error("Stok tidak mencukupi");
    }
    return db.obat.update({
      where: { id },
      data: { stok: { decrement: jumlah } },
    });
  }
}

export async function getObatStokRendah(threshold: number = 10) {
  return db.obat.findMany({
    where: {
      isActive: true,
      stok: { lte: threshold },
    },
    orderBy: { stok: "asc" },
  });
}
