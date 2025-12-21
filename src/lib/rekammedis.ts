"use server";

import { db } from "./db";
import { requireRole, getCurrentUser } from "./server";

export async function createRekamMedis(data: {
  kunjunganId: string;
  keluhan: string;
  pemeriksaan: string;
  diagnosis: string;
  tandaVital: {
    tekananDarah: string;
    suhu: string;
    nadi: string;
    pernapasan: string;
    beratBadan?: string;
    tinggiBadan?: string;
  };
  catatan?: string;
}) {
  const dokter = await requireRole("dokter");

  // Update kunjungan status
  await db.kunjungan.update({
    where: { id: data.kunjunganId },
    data: { status: "diperiksa" },
  });

  return db.rekamMedis.create({
    data: {
      kunjunganId: data.kunjunganId,
      dokterId: dokter.id,
      keluhan: data.keluhan,
      pemeriksaan: data.pemeriksaan,
      diagnosis: data.diagnosis,
      tandaVital: JSON.stringify(data.tandaVital),
      catatan: data.catatan,
    },
    include: {
      kunjungan: {
        include: { pasien: true, poli: true },
      },
      dokter: true,
    },
  });
}

export async function getRekamMedisById(id: string) {
  return db.rekamMedis.findUnique({
    where: { id },
    include: {
      kunjungan: {
        include: { pasien: true, poli: true },
      },
      dokter: true,
      resep: {
        include: {
          detailResep: {
            include: { obat: true },
          },
        },
      },
    },
  });
}

export async function getRiwayatRekamMedis(pasienId: string) {
  return db.rekamMedis.findMany({
    where: {
      kunjungan: { pasienId },
    },
    include: {
      kunjungan: {
        include: { poli: true },
      },
      dokter: true,
      resep: {
        include: {
          detailResep: {
            include: { obat: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateRekamMedis(
  id: string,
  data: {
    keluhan?: string;
    pemeriksaan?: string;
    diagnosis?: string;
    tandaVital?: string;
    catatan?: string;
  }
) {
  await requireRole("dokter");
  return db.rekamMedis.update({
    where: { id },
    data,
  });
}
