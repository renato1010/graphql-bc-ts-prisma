import { User, Post, Comment } from '../../types';
import { PrismaFull } from 'src/types';

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
      { prisma }: { prisma: PrismaFull },
    ): Promise<Post[]> => {
      const posts = await prisma.post.findMany({ where: { userId: id } });
      return posts;
    },
    comments: async (
      { id }: User,
      _args: undefined,
      { prisma }: { prisma: PrismaFull },
    ): Promise<Comment[]> => {
      return await prisma.comment.findMany({ where: { userId: id } });
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
