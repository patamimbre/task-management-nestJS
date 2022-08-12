import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.createMany({
    data: [
      {
        title: 'Lavar la ropa',
        description: 'Hay que poner al menos 3 lavadoras',
      },
      {
        title: 'Hacer la compra',
        description: 'Leche, galletas, cereales, pan',
        status: 'IN_PROGRESS',
      },
      {
        title: 'Vigilar a mi prima La Pelos',
      },
    ],
  });

  await prisma.user.create({
    data: {
      username: 'test',
      email: 'test@test.com',
      password:
        '$argon2i$v=19$m=12,t=3,p=1$eGswbmxsZHpheTAwMDAwMA$tLE9xqne2NOidaLo1acY0A', // password
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
