import { User, Post, Comment } from '../../types';
import { PubSub } from 'graphql-subscriptions';
import { PrismaFull } from 'src/types';

const Mutation = {
  Mutation: {
    createUser: async (
      _: undefined,
      { input }: { input: { name: string; email: string; age?: number } },
      { prisma }: { prisma: PrismaFull },
    ): Promise<User> => {
      const isEmailTaken = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      // check if email is already taoken; actually prisma when create user enforce email
      // uniqueness so probably is better option wrap user create in a try catch an send an
      // error message in case this fail because of email
      if (isEmailTaken) {
        throw new Error(`The email ${input.email} is already taken. Have you forget your password`);
      }
      const newUser = await prisma.user.create({
        data: {
          ...input,
        },
      });
      return newUser;
    },
    deleteUser: async (
      _: undefined,
      { userId }: { userId: string },
      { prisma }: { prisma: PrismaFull },
    ): Promise<User> => {
      try {
        const deleteUser = prisma.user.delete({
          where: {
            id: userId,
          },
        });
        const deleteRelatedPosts = prisma.post.deleteMany({
          where: {
            userId,
          },
        });
        const deleteRelComms = prisma.comment.deleteMany({
          where: {
            userId,
          },
        });
        const transaction = await prisma.$transaction([
          deleteRelComms,
          deleteRelatedPosts,
          deleteUser,
        ]);
        return transaction[2];
      } catch (error) {
        throw new Error(`Couldn't delete user with Id:${userId}`);
      }
    },
    updateUser: async (
      _parent: undefined,
      { id, input }: { id: string; input: Partial<Omit<User, 'id'>> },
      { prisma }: { prisma: PrismaFull },
    ): Promise<User> => {
      try {
        const updateUser = await prisma.user.update({
          where: { id },
          data: { ...input },
        });
        return updateUser;
      } catch (error) {
        throw new Error(`Couldn't find user with Id=${id}`);
      }
    },
    createPost: async (
      _parent: undefined,
      {
        input: { title, body, publish: published, authorId },
      }: { input: { title: string; body: string; publish: boolean; authorId: string } },
      { prisma }: { prisma: PrismaFull },
    ): Promise<Post> => {
      const authorExist = await prisma.user.findUnique({ where: { id: authorId } });
      if (!authorExist) {
        throw new Error(`Couldn't found an author with ID=${authorId}`);
      }
      const newPost = await prisma.post.create({
        data: { body, title, published, userId: authorId },
      });
      // if (published) {
      //   pubsub.publish('post', { post: { mutation: 'Created', data: newPost } });
      // }
      return newPost;
    },
    deletePost: async (
      _parent: undefined,
      { postId }: { postId: string },
      { prisma }: { prisma: PrismaFull },
    ): Promise<Post> => {
      try {
        // delete comments related with post
        const delPostRelComms = prisma.comment.deleteMany({
          where: { postId },
        });
        const delPost = prisma.post.delete({
          where: { id: postId },
        });
        const transaction = await prisma.$transaction([delPostRelComms, delPost]);
        // if (targetPost.published) {
        //   pubsub.publish('post', { post: { mutation: 'DELETED', data: targetPost } });
        // }
        return transaction[1];
      } catch (error) {
        throw new Error(`Couldn't complete deletion of post with Id=${postId}`);
      }
    },
    updatePost: async (
      _parent: undefined,
      { postId, input }: { postId: string; input: Partial<Omit<Post, 'id'>> },
      { prisma }: { prisma: PrismaFull },
    ): Promise<Post> => {
      try {
        const updatedPost = await prisma.post.update({ where: { id: postId }, data: { ...input } });
        // pubsub.publish('post', { post: { mutation: 'UPDATED', data: updatedPost } });
        return updatedPost;
      } catch (error) {
        throw new Error(`Couldn't find post with Id=${postId}`);
      }
    },
    createComment: async (
      _parent: undefined,
      {
        input: { content: text, userId, postId },
      }: { input: { content: string; userId: string; postId: string } },
      { prisma, pubsub }: { prisma: PrismaFull; pubsub: PubSub },
    ): Promise<Comment> => {
      try {
        const newComment = await prisma.comment.create({
          data: { text: text, userId, postId },
        });
        pubsub.publish('comment', { comment: { mutation: 'CREATED', data: newComment } });
        return newComment;
      } catch (error) {
        throw new Error(`${error?.message ?? `Couldn't create comment for postId=${postId}`}`);
      }
    },
    updateComment: async (
      _parent: undefined,
      { input }: { input: Pick<Comment, 'text'> & { commentId: string } },
      { prisma, pubsub }: { prisma: PrismaFull; pubsub: PubSub },
    ): Promise<Comment> => {
      const { commentId, text } = input;
      try {
        const updatedComment = await prisma.comment.update({
          where: { id: commentId },
          data: { text },
        });
        pubsub.publish('comment', { comment: { mutation: 'UPDATED', data: updatedComment } });
        return updatedComment;
      } catch (error) {
        throw new Error(`Couldn't find comment with Id=${commentId}`);
      }
    },
    deleteComment: async (
      _parent: undefined,
      { commentId }: { commentId: string },
      { prisma, pubsub }: { prisma: PrismaFull; pubsub: PubSub },
    ): Promise<Comment> => {
      try {
        const targetComment = await prisma.comment.delete({ where: { id: commentId } });
        pubsub.publish('comment', { comment: { mutation: 'DELETED', data: targetComment } });
        return targetComment;
      } catch (error) {
        throw new Error(`Couldn't delete comment with Id=${commentId}`);
      }
    },
  },
};

export { Mutation };
