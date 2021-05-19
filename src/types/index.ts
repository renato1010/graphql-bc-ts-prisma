import { Prisma, PrismaClient } from '@prisma/client';

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number | null;
}
export interface Post {
  id: string;
  title: string;
  body: string;
  published: boolean;
  userId: string;
}
export interface Comment {
  id: string;
  text: string;
  userId: string;
  postId: string;
}
export type MutationOperation = 'CREATED' | 'UPDATED' | 'DELETED';
export interface QueryType {
  Query: {
    me: () => User;
    post: () => Post;
  };
}

export type PrismaFull = PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;
