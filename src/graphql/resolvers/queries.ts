import { User, Post, Comment } from '@prisma/client';
import { PrismaFull } from 'types';

const Query = {
  Query: {
    posts: async (
      _: undefined,
      { query }: { query: string | undefined },
      { prisma }: { prisma: PrismaFull },
    ): Promise<Post[] | []> => {
      if (!query) {
        return await prisma.post.findMany();
      }
      const postById = await prisma.post.findUnique({ where: { id: query } });
      const postsByTextSearch = await prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
              },
            },
            {
              body: {
                contains: query,
              },
            },
          ],
        },
      });
      return postById ? [postById, ...postsByTextSearch] : [...postsByTextSearch];
    },
    users: async (
      _parent: undefined,
      { query }: { query: string | undefined },
      { prisma }: { prisma: PrismaFull },
    ): Promise<User[] | []> => {
      if (!query) {
        return await prisma.user.findMany();
      }
      const users = await prisma.user.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
      });
      return users.length ? users : [];
    },
    comments: async (
      _: undefined,
      { query }: { query: string | undefined },
      { prisma }: { prisma: PrismaFull },
    ): Promise<Comment[]> => {
      if (!query) {
        return await prisma.comment.findMany();
      }
      const matchById = await prisma.comment.findUnique({ where: { id: query } });
      const matchByText = await prisma.comment.findMany({
        where: { text: { contains: query, mode: 'insensitive' } },
      });
      return matchById ? [matchById, ...matchByText] : [...matchByText];
    },
  },
};

export { Query };
