import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const { id: userId } = await prisma.user.create({
    data: {
      username: 'test',
      email: 'test@test.com',
      password:
        '$argon2i$v=19$m=12,t=3,p=1$eGswbmxsZHpheTAwMDAwMA$tLE9xqne2NOidaLo1acY0A', // password
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Lavar la ropa',
        description: 'Hay que poner al menos 3 lavadoras',
        userId,
      },
      {
        title: 'Hacer la compra',
        description: 'Leche, galletas, cereales, pan',
        status: 'IN_PROGRESS',
        userId,
      },
      {
        title: 'Vigilar a mi prima La Pelos',
        description: 'La prima está muy inquieta',
        status: 'DONE',
        userId,
      },
    ],
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
