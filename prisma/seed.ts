import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const db3m41aalg: Prisma.db_3m41a_algCreateInput[] = [
  { nim: "22.240.0001", nama: "AHMAD ILHAM MUZAKKI" },
  { nim: "22.240.0002", nama: "IKMAL MAULID HATTA" },
  { nim: "22.240.0008", nama: "BAYU AJI" },
  { nim: "22.240.0011", nama: "DERI ARDIANSAH" },
  { nim: "22.240.0012", nama: "AHMAD LINGGA ADI NUGRAHA" },
  { nim: "22.240.0023", nama: "TUBAGUS FAHMI YUSTIAN" },
  { nim: "22.240.0031", nama: "ISMI AISSYAH" },
  { nim: "22.240.0042", nama: "WIKRAMA WIBISONO" },
  { nim: "22.240.0043", nama: "GUDHI HERLAMBANG" },
  { nim: "22.240.0071", nama: "NOORSYAMSU BAGUS PRAKOSO" },
  { nim: "22.240.0093", nama: "SHENDY BAGAS YULIANTO" },
  { nim: "22.240.0120", nama: "RYAN MAHARDIKA" },
  { nim: "22.240.0134", nama: "PUTRI ZULFA NABIGHAH" },
  { nim: "22.240.0136", nama: "MUHAMMAD NABIL ANGGRIAWAN" },
  { nim: "22.240.0138", nama: "RIZKY ARIFIANTO" },
  { nim: "22.240.0139", nama: "HANA SULAIMAN" },
  { nim: "22.240.0147", nama: "ADIB ROFIUDIN" },
  { nim: "22.240.0151", nama: "AMILLUL FATA" },
  { nim: "22.240.0159", nama: "MUHAMMAD FATHI RIZQILLAH" },
  { nim: "22.240.0161", nama: "M.BAGAS IRIANTO" },
  { nim: "22.240.0162", nama: "PUTRI FADILA" },
  { nim: "22.240.0163", nama: "RIFQIH ARIO PRASETYO" },
  { nim: "22.240.0164", nama: "VINA AMALIA PUTRI" },
  { nim: "22.240.0165", nama: "DWI PRIYONO" },
  { nim: "22.240.0166", nama: "FATIFAH FARIDA" },
  { nim: "22.240.0167", nama: "LISA AURA SAPHIRA" },
  { nim: "22.240.0168", nama: "M.IYAZ ADITAMA" },
  { nim: "22.240.0170", nama: "KEISHA DIANDRA RATNA PUTRI" },
  { nim: "22.240.0171", nama: "TEGAR FIRMANSYAH" },
  { nim: "22.240.0173", nama: "MOCH. DANY ROZID WAFA" },
  { nim: "22.240.0178", nama: "ABDUL MUTOLIP" },
  { nim: "22.240.0181", nama: "RIZQI SYAFARI RACHMADHIKA" },
  { nim: "22.240.0182", nama: "HANIF BAGUS SAPUTRA HADI" },
  { nim: "22.240.0183", nama: "BAHRUDDIN RIFQI MAULANA" },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of db3m41aalg) {
    const user = await prisma.db_3m41a_alg.create({
      data: u,
    });
    console.log(`Created user with nim: ${user.nim}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
