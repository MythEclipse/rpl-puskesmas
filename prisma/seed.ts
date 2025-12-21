import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "admin123",
      namaLengkap: "Administrator",
      role: "admin",
    },
  });
  console.log("✓ Admin user created:", admin.username);

  // Create other users
  const users = [
    {
      username: "petugas1",
      password: "123456",
      namaLengkap: "Budi Santoso",
      role: "pendaftaran",
    },
    {
      username: "dokter1",
      password: "123456",
      namaLengkap: "Dr. Ani Wijaya",
      role: "dokter",
    },
    {
      username: "dokter2",
      password: "123456",
      namaLengkap: "Dr. Rudi Hartono",
      role: "dokter",
    },
    {
      username: "apoteker1",
      password: "123456",
      namaLengkap: "Siti Rahayu",
      role: "apoteker",
    },
    {
      username: "kapus",
      password: "123456",
      namaLengkap: "Dr. H. Ahmad Fauzi, M.Kes",
      role: "kepalaPuskesmas",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: user,
    });
  }
  console.log("✓ Users created");

  // Create Poli
  const poliData = [
    {
      kode: "POLI-UMUM",
      nama: "Poli Umum",
      deskripsi: "Layanan kesehatan umum",
    },
    {
      kode: "POLI-GIGI",
      nama: "Poli Gigi",
      deskripsi: "Layanan kesehatan gigi dan mulut",
    },
    { kode: "POLI-KIA", nama: "Poli KIA", deskripsi: "Kesehatan Ibu dan Anak" },
    {
      kode: "POLI-LANSIA",
      nama: "Poli Lansia",
      deskripsi: "Layanan kesehatan lanjut usia",
    },
  ];

  for (const poli of poliData) {
    await prisma.poli.upsert({
      where: { kode: poli.kode },
      update: {},
      create: poli,
    });
  }
  console.log("✓ Poli created");

  // Create Obat
  const obatData = [
    {
      kode: "OBT001",
      nama: "Paracetamol 500mg",
      satuan: "tablet",
      stok: 1000,
      harga: 500,
    },
    {
      kode: "OBT002",
      nama: "Amoxicillin 500mg",
      satuan: "kapsul",
      stok: 500,
      harga: 1500,
    },
    {
      kode: "OBT003",
      nama: "Ibuprofen 400mg",
      satuan: "tablet",
      stok: 800,
      harga: 750,
    },
    {
      kode: "OBT004",
      nama: "Omeprazole 20mg",
      satuan: "kapsul",
      stok: 300,
      harga: 2000,
    },
    {
      kode: "OBT005",
      nama: "Cetirizine 10mg",
      satuan: "tablet",
      stok: 400,
      harga: 1000,
    },
    {
      kode: "OBT006",
      nama: "Metformin 500mg",
      satuan: "tablet",
      stok: 600,
      harga: 500,
    },
    {
      kode: "OBT007",
      nama: "Amlodipine 5mg",
      satuan: "tablet",
      stok: 400,
      harga: 800,
    },
    {
      kode: "OBT008",
      nama: "Salbutamol Inhaler",
      satuan: "pcs",
      stok: 50,
      harga: 35000,
    },
    {
      kode: "OBT009",
      nama: "ORS (Oralit)",
      satuan: "sachet",
      stok: 500,
      harga: 1000,
    },
    {
      kode: "OBT010",
      nama: "Vitamin B Complex",
      satuan: "tablet",
      stok: 1000,
      harga: 300,
    },
  ];

  for (const obat of obatData) {
    await prisma.obat.upsert({
      where: { kode: obat.kode },
      update: {},
      create: obat,
    });
  }
  console.log("✓ Obat created");

  // Create some sample patients
  const pasienData = [
    {
      noRM: "RM-20241221-0001",
      nik: "3201010101900001",
      nama: "Ahmad Suryadi",
      tanggalLahir: new Date("1990-01-01"),
      jenisKelamin: "L",
      alamat: "Jl. Merdeka No. 123",
      noTelp: "08123456789",
      noBPJS: "0001234567890",
    },
    {
      noRM: "RM-20241221-0002",
      nik: "3201020202850002",
      nama: "Siti Aminah",
      tanggalLahir: new Date("1985-02-02"),
      jenisKelamin: "P",
      alamat: "Jl. Sudirman No. 456",
      noTelp: "08234567890",
      noBPJS: null,
    },
    {
      noRM: "RM-20241221-0003",
      nik: "3201030303800003",
      nama: "Budi Prasetyo",
      tanggalLahir: new Date("1980-03-03"),
      jenisKelamin: "L",
      alamat: "Jl. Gatot Subroto No. 789",
      noTelp: "08345678901",
      noBPJS: "0002345678901",
    },
  ];

  for (const pasien of pasienData) {
    await prisma.pasien.upsert({
      where: { noRM: pasien.noRM },
      update: {},
      create: pasien,
    });
  }
  console.log("✓ Sample patients created");

  console.log("\n✅ Database seeded successfully!");
  console.log("\n📋 Login credentials:");
  console.log("  Admin: admin / admin123");
  console.log("  Pendaftaran: petugas1 / 123456");
  console.log("  Dokter: dokter1 / 123456");
  console.log("  Apoteker: apoteker1 / 123456");
  console.log("  Kepala Puskesmas: kapus / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
