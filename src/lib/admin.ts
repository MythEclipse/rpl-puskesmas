"use server";

import { db } from "./db";
import { requireRole, type UserRole } from "./server";

export async function getAllUsers() {
  await requireRole("admin");
  return db.user.findMany({
    select: {
      id: true,
      username: true,
      namaLengkap: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id: string) {
  await requireRole("admin");
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      namaLengkap: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function createUser(data: {
  username: string;
  password: string;
  namaLengkap: string;
  role: UserRole;
}) {
  await requireRole("admin");

  const existing = await db.user.findUnique({
    where: { username: data.username },
  });
  if (existing) throw new Error("Username sudah digunakan");

  return db.user.create({
    data,
    select: {
      id: true,
      username: true,
      namaLengkap: true,
      role: true,
    },
  });
}

export async function updateUser(
  id: string,
  data: {
    namaLengkap?: string;
    role?: UserRole;
    password?: string;
  }
) {
  await requireRole("admin");
  return db.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      namaLengkap: true,
      role: true,
    },
  });
}

export async function deleteUser(id: string) {
  await requireRole("admin");
  return db.user.delete({ where: { id } });
}

// ============ PEMBAYARAN FUNCTIONS ============

export async function getPembayaranByKunjungan(kunjunganId: string) {
  return db.pembayaran.findUnique({
    where: { kunjunganId },
    include: {
      kunjungan: {
        include: {
          pasien: true,
          poli: true,
        },
      },
    },
  });
}

export async function updatePembayaran(
  id: string,
  data: {
    totalLayanan?: number;
    status?: "belumBayar" | "lunas";
    metodeBayar?: string;
  }
) {
  await requireRole("pendaftaran", "admin");

  const pembayaran = await db.pembayaran.findUnique({ where: { id } });
  if (!pembayaran) throw new Error("Pembayaran tidak ditemukan");

  const totalLayanan = data.totalLayanan ?? pembayaran.totalLayanan;
  const total = totalLayanan + pembayaran.totalObat;

  return db.pembayaran.update({
    where: { id },
    data: {
      ...data,
      totalLayanan,
      total,
    },
  });
}

export async function getPembayaranBelumLunas() {
  await requireRole("pendaftaran", "admin");
  return db.pembayaran.findMany({
    where: { status: "belumBayar" },
    include: {
      kunjungan: {
        include: { pasien: true, poli: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

// ============ TARIF LAYANAN FUNCTIONS ============

export async function getAllTarif() {
  return db.tarifLayanan.findMany({
    where: { isActive: true },
    orderBy: { kategori: "asc" },
  });
}

export async function createTarif(data: {
  nama: string;
  tarif: number;
  kategori: string;
}) {
  await requireRole("admin");
  return db.tarifLayanan.create({ data });
}

export async function updateTarif(
  id: string,
  data: {
    nama?: string;
    tarif?: number;
    kategori?: string;
    isActive?: boolean;
  }
) {
  await requireRole("admin");
  return db.tarifLayanan.update({ where: { id }, data });
}
