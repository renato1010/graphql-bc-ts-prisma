import { User, Post, Comment } from '../../types';
import { v4 as uuidv4 } from 'uuid';
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
      const targetUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!targetUser) {
        throw new Error(`Couldn't find user with Id:${userId}`);
      }
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
    },
    updateUser: async (
      _parent: undefined,
      { id, input }: { id: string; input: Partial<Omit<User, 'id'>> },
      { prisma }: { prisma: PrismaFull },
    ): Promise<User> => {
      const { email } = input;
      const targetUser = await prisma.user.findUnique({
        where: { id },
      });
      if (!targetUser) {
        throw new Error(`Couldn't find user with Id=${id}`);
      }
      const updateUser = await prisma.user.update({
        where: { id },
        data: { ...input },
      });
      return updateUser;
    },
    // createPost: (
    //   _parent: undefined,
    //   {
    //     input: { title, body, publish: published, authorId },
    //   }: { input: { title: string; body: string; publish: boolean; authorId: string } },
    //   {
    //     data: { users, posts },
    //     pubsub,
    //   }: { data: { users: User[]; posts: Post[] }; pubsub: PubSub },
    // ): Post => {
    //   const authorExist = users.find((u) => u.id === authorId);
    //   if (!authorExist) {
    //     throw new Error(`Couldn't found an author with ID=${authorId}`);
    //   }
    //   const newPost = { title, body, published, id: uuidv4(), author: authorId };
    //   posts = [...posts, newPost];
    //   if (published) {
    //     pubsub.publish('post', { post: { mutation: 'Created', data: newPost } });
    //   }
    //   return newPost;
    // },
    // deletePost: (
    //   _parent: undefined,
    //   { postId }: { postId: string },
    //   {
    //     data: { comments, posts },
    //     pubsub,
    //   }: { data: { comments: Comment[]; posts: Post[] }; pubsub: PubSub },
    // ): Post => {
    //   const postToRemove = posts.find((p) => p.id === postId);
    //   if (!postToRemove) {
    //     throw new Error(`Couldn't find the post with ID=${postId}`);
    //   }
    //   // remove all comments belonging to postToRemove
    //   comments = comments.filter((c) => c.post !== postToRemove.id);
    //   posts = posts.filter((p) => p.id !== postId);
    //   if (postToRemove.published) {
    //     pubsub.publish('post', { post: { mutation: 'DELETED', data: postToRemove } });
    //   }
    //   return postToRemove;
    // },
    // updatePost: (
    //   _parent: undefined,
    //   {
    //     postId,
    //     input,
    //   }: { postId: string; input: Partial<Omit<Post, 'id' | 'author' | 'published'>> },
    //   { data: { posts }, pubsub }: { data: { posts: Post[] }; pubsub: PubSub },
    // ): Post => {
    //   const selectedPostIndex = posts.findIndex((p) => p.id === postId);
    //   if (selectedPostIndex < 0) {
    //     throw new Error(`Couldn't find post with Id=${postId}`);
    //   }
    //   const updatedPost: Post = { ...posts[selectedPostIndex], ...input };
    //   const [originalPost] = posts.splice(selectedPostIndex, 1, updatedPost);
    //   pubsub.publish('post', { post: { mutation: 'UPDATED', data: updatedPost } });
    //   return updatedPost;
    // },
    // createComment: (
    //   _parent: undefined,
    //   {
    //     input: { content: text, author, post },
    //   }: { input: { content: string; author: string; post: string } },
    //   {
    //     data: { comments, posts, users },
    //     pubsub,
    //   }: { data: { comments: Comment[]; posts: Post[]; users: User[] }; pubsub: PubSub },
    // ): Comment => {
    //   const newComment: Comment = { id: uuidv4(), text, author, post };
    //   const isAuthor = users.find((u) => u.id === author);
    //   const isPost = posts.find((p) => p.id === post && p.published);
    //   if (!isAuthor || !isPost) {
    //     throw new Error('There are neither author nor post');
    //   }
    //   comments = [...comments, newComment];
    //   pubsub.publish('comment', { comment: { mutation: 'CREATED', data: newComment } });
    //   return newComment;
    // },
    // updateComment: (
    //   _parent: undefined,
    //   { commentId, input }: { commentId: string; input: Pick<Comment, 'text'> },
    //   { data: { comments }, pubsub }: { data: { comments: Comment[] }; pubsub: PubSub },
    // ): Comment => {
    //   const selectedCommentIndex = comments.findIndex((p) => p.id === commentId);
    //   if (selectedCommentIndex < 0) {
    //     throw new Error(`Couldn't find comment with Id=${commentId}`);
    //   }
    //   const updatedComment: Comment = { ...comments[selectedCommentIndex], ...input };
    //   const originalPost = comments.splice(selectedCommentIndex, 1, updatedComment);
    //   pubsub.publish('comment', { comment: { mutation: 'UPDATED', data: updatedComment } });
    //   return updatedComment;
    // },
    // deleteComment: (
    //   _parent: undefined,
    //   { commentId }: { commentId: string },
    //   { data: { comments }, pubsub }: { data: { comments: Comment[] }; pubsub: PubSub },
    // ): Comment => {
    //   const commentToRemove = comments.find((c) => c.id === commentId);
    //   if (!commentToRemove) {
    //     throw new Error(`Couldn't find comment with Id=${commentId}`);
    //   }
    //   comments = comments.filter((c) => c.id !== commentId);
    //   pubsub.publish('comment', { comment: { mutation: 'DELETED', data: commentToRemove } });
    //   return commentToRemove;
    // },
  },
};

export { Mutation };
