"use server";

import { db } from "./db";
import { requireRole } from "./server";

// Generate nomor RM: RM-YYYYMMDD-XXXX
function generateNoRM(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `RM-${year}${month}${day}-${random}`;
}

export async function createPasien(data: {
  nik: string;
  nama: string;
  tanggalLahir: Date;
  jenisKelamin: string;
  alamat: string;
  noTelp: string;
  noBPJS?: string;
}) {
  await requireRole("pendaftaran", "admin");

  // Check if NIK already exists
  const existing = await db.pasien.findUnique({ where: { nik: data.nik } });
  if (existing) throw new Error("NIK sudah terdaftar");

  // Generate unique noRM
  let noRM = generateNoRM();
  let exists = await db.pasien.findUnique({ where: { noRM } });
  while (exists) {
    noRM = generateNoRM();
    exists = await db.pasien.findUnique({ where: { noRM } });
  }

  return db.pasien.create({
    data: {
      ...data,
      noRM,
    },
  });
}

export async function getPasienById(id: string) {
  return db.pasien.findUnique({
    where: { id },
    include: {
      kunjungan: {
        include: {
          poli: true,
          rekamMedis: true,
        },
        orderBy: { tanggal: "desc" },
        take: 10,
      },
    },
  });
}

export async function getPasienByNIK(nik: string) {
  return db.pasien.findUnique({
    where: { nik },
    include: {
      kunjungan: {
        include: { poli: true },
        orderBy: { tanggal: "desc" },
        take: 5,
      },
    },
  });
}

export async function getPasienByNoRM(noRM: string) {
  return db.pasien.findUnique({
    where: { noRM },
    include: {
      kunjungan: {
        include: { poli: true },
        orderBy: { tanggal: "desc" },
        take: 5,
      },
    },
  });
}

export async function searchPasien(query: string) {
  return db.pasien.findMany({
    where: {
      OR: [
        { nama: { contains: query } },
        { nik: { contains: query } },
        { noRM: { contains: query } },
      ],
    },
    take: 20,
    orderBy: { nama: "asc" },
  });
}

export async function updatePasien(
  id: string,
  data: {
    nama?: string;
    alamat?: string;
    noTelp?: string;
    noBPJS?: string | null;
  }
) {
  await requireRole("pendaftaran", "admin");
  return db.pasien.update({
    where: { id },
    data,
  });
}

export async function getAllPasien() {
  return db.pasien.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
