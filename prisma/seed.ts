import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.task.createMany({
    data: [
      {
        title: 'Lavar la ropa',
        description: 'Hay que poner al menos 3 lavadoras',
      },
      {
        title: 'Hacer la compra',
        description: 'Leche, galletas, cereales, pan',
        status: 'IN_PROGRESS', // TODO(enum): get from enum
      },
      {
        title: 'Vigilar a mi prima La Pelos',
      },
    ],
  });
  console.log(result);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
