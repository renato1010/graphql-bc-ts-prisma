import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// const userData: Prisma.UserCreateInput[] = [
//   {
//     name: 'Alice',
//     email: 'alice@test.com',
//   },
//   {
//     name: 'Tom',
//     email: 'tom@test.com',
//   },
// ];

async function main(): Promise<void> {
  console.log('Start seeding ....');
  const createPost = await prisma.post.create({
    data: {
      title: 'second post',
      body: 'body for the second post',
      published: true,
      User: { connect: { id: 'edfc3182-bccc-4116-a3d9-e9a760547aa0' } },
    },
  });
  console.log('Seeding finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
