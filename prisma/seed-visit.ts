import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding dummy visit...");

  const pasien = await prisma.pasien.findFirst({
    where: { nama: "Ahmad Suryadi" },
  });

  if (!pasien) throw new Error("Pasien Ahmad Suryadi not found");

  const poli = await prisma.poli.findFirst({
    where: { nama: "Poli Umum" },
  });

  if (!poli) throw new Error("Poli Umum not found");

  // Create Kunjungan associated with today
  const kunjungan = await prisma.kunjungan.create({
    data: {
      nomorAntrean: 101,
      status: "menunggu",
      tipePasien: "bpjs",
      pasienId: pasien.id,
      poliId: poli.id,
      tanggal: new Date(),
    },
  });

  console.log("✓ Kunjungan created:", kunjungan.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
