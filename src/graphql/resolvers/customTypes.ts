import { User, Post, Comment } from '@prisma/client';
import { PrismaFull, ServerContext } from 'types';

const Custom = {
  Post: {
    author: async (
      { userId }: Post,
      _args: undefined,
      { prisma }: { prisma: PrismaFull },
    ): Promise<User | null> => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return user ? user : null;
    },
    comments: async (
      { id }: Post,
      _args: undefined,
      { prisma }: { prisma: PrismaFull },
    ): Promise<Comment[]> => {
      return await prisma.comment.findMany({ where: { postId: id } });
    },
  },
  User: {
    posts: async (
      { id }: User,
      _args: undefined,
      { prisma, userId }: ServerContext,
    ): Promise<Post[]> => {
      if (userId) {
        const posts = await prisma.post.findMany({ where: { userId: id, published: true } });
        return posts;
      }
      return [];
    },
    comments: async (
      { id }: User,
      _args: undefined,
      { prisma }: { prisma: PrismaFull },
    ): Promise<Comment[]> => {
      return await prisma.comment.findMany({ where: { userId: id } });
    },
    email: (
      { id, email }: User,
      _args: undefined,
      { prisma, userId }: ServerContext,
    ): string | null => {
      if (userId && userId === id) {
        return email;
      } else {
        return null;
      }
    },
  },
  Comment: {
    author: async (
      { userId }: Comment,
      _args: undefined,
      { prisma }: { prisma: PrismaFull },
    ): Promise<User> => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error(`Couldn't find user with Id=${userId}`);
      }
      return user;
    },
    post: async (
      { postId }: Comment,
      _args: undefined,
      { prisma }: { prisma: PrismaFull },
    ): Promise<Post> => {
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) {
        throw new Error(`Couldn't find post with Id=${postId}`);
      }
      return post;
    },
  },
};

export { Custom };
