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
    // comments: (
    //   { id }: Post,
    //   _args: undefined,
    //   { data: { comments } }: { data: { comments: Comment[] } },
    // ): Comment[] => comments.filter((comm) => comm.post === id),
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
    // comments: (
    //   { id }: User,
    //   _args: undefined,
    //   { data: { comments } }: { data: { comments: Comment[] } },
    // ): Comment[] => comments.filter((comm) => comm.author === id),
  },
  // Comment: {
  //   author: (
  //     { author }: Comment,
  //     _args: undefined,
  //     { data: { users } }: { data: { users: User[] } },
  //   ): User => {
  //     return users.find((user) => user.id === author) as User;
  //   },
  //   post: (
  //     { post }: Comment,
  //     _args: undefined,
  //     { data: { posts } }: { data: { posts: Post[] } },
  //   ): Post => {
  //     return posts.find((p) => p.id === post) as Post;
  //   },
  // },
};

export { Custom };
