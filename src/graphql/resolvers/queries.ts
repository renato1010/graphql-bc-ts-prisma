import { User, Post, Comment } from '../../types';
import { PrismaFull } from 'src/types';

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
      const post = await prisma.post.findUnique({ where: { id: query } });
      return post ? [post] : [];
    },
    users: async (
      _parent: undefined,
      { query }: { query: string | undefined },
      { prisma }: { prisma: PrismaFull },
    ): Promise<User[] | []> => {
      if (!query) {
        return await prisma.user.findMany();
      }
      const user = await prisma.user.findUnique({
        where: {
          id: query,
        },
      });
      return user ? [user] : [];
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
