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
    // me: (): User => {
    //   return { id: 'adsfasdfa', name: 'Renato Perez', email: 'renato@test.com', age: null };
    // },
    // post: (): Post => ({
    //   id: 'abdcd',
    //   title: 'play with GraphQL and Typescript',
    //   body: 'a full text for post',
    //   published: true,
    //   author: '2',
    // }),
    // comments: (
    //   _: undefined,
    //   { query }: { query: string | undefined },
    //   { data: { comments } }: { data: { comments: Comment[] } },
    // ): Comment[] => {
    //   if (!query) {
    //     return comments;
    //   }
    //   const matchById = comments.filter((comm) => comm.id.toLowerCase() === query.toLowerCase());
    //   const matchByText = comments.filter((comm) =>
    //     comm.text.toLowerCase().includes(query.toLowerCase()),
    //   );
    //   return [...matchById, ...matchByText];
    // },
  },
};

export { Query };
