import { User, Post, Comment } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  Mutation: {
    createUser: (
      _: undefined,
      { input }: { input: { name: string; email: string; age?: number } },
      { data: { users } }: { data: { users: User[] } },
    ): User => {
      const isEmailTaken = users.some((u) => u.email === input.email);
      if (isEmailTaken) {
        throw new Error(`The email ${input.email} is already taken. Have you forget your password`);
      }
      const newUser: User = { ...input, id: uuidv4() };
      users = [...users, newUser];
      return newUser;
    },
    deleteUser: (
      _: undefined,
      { userId }: { userId: string },
      {
        data: { users, posts, comments },
      }: { data: { users: User[]; posts: Post[]; comments: Comment[] } },
    ): User => {
      const userToDelete = users.find((u) => u.id === userId);
      if (!userToDelete) {
        throw new Error(`Couldn't find user with ID=${userId}`);
      }
      const remainPosts = posts.filter((p) => {
        const match = p.author === userId;
        // remove all comments on post authored by user
        if (match) {
          const postCommentToremove = comments.filter((c) => c.post !== p.id);
          comments = postCommentToremove;
        }
        return !match;
      });
      const remainComments = comments.filter((c) => c.author !== userId);
      const remainUsers = users.filter((u) => u.id !== userId);
      users = remainUsers;
      posts = remainPosts;
      comments = remainComments;
      return userToDelete;
    },
    updateUser: (
      _parent: undefined,
      { id, input }: { id: string; input: Partial<Omit<User, 'id'>> },
      { data: { users } }: { data: { users: User[] } },
    ): User => {
      const { email } = input;
      const selectedUserIndex = users.findIndex((u) => u.id == id);
      if (selectedUserIndex === -1) {
        throw new Error(`Couldn't find user with Id=${id}`);
      }
      if (email) {
        // check is updated email isn't taken already
        const isEmailTaken = users.find((u) => u.email === email);
        if (isEmailTaken) {
          throw new Error(`Email: ${email} is already taken, choose another one`);
        }
      }
      const updatedUser: User = { ...users[selectedUserIndex], ...input };
      const _deletedUser = users.splice(selectedUserIndex, 1, updatedUser);
      return updatedUser;
    },
    createPost: (
      _parent: undefined,
      {
        input: { title, body, publish: published, authorId },
      }: { input: { title: string; body: string; publish: boolean; authorId: string } },
      { data: { users, posts } }: { data: { users: User[]; posts: Post[] } },
    ): Post => {
      const authorExist = users.find((u) => u.id === authorId);
      if (!authorExist) {
        throw new Error(`Couldn't found an author with ID=${authorId}`);
      }
      const newPost = { title, body, published, id: uuidv4(), author: authorId };
      posts = [...posts, newPost];
      return newPost;
    },
    deletePost: (
      _parent: undefined,
      { postId }: { postId: string },
      { data: { comments, posts } }: { data: { comments: Comment[]; posts: Post[] } },
    ): Post => {
      const postToRemove = posts.find((p) => p.id === postId);
      if (!postToRemove) {
        throw new Error(`Couldn't find the post with ID=${postId}`);
      }
      // remove all comments belonging to postToRemove
      comments = comments.filter((c) => c.post !== postToRemove.id);
      posts = posts.filter((p) => p.id !== postId);
      return postToRemove;
    },
    updatePost: (
      _parent: undefined,
      {
        postId,
        input,
      }: { postId: string; input: Partial<Omit<Post, 'id' | 'author' | 'published'>> },
      { data: { posts } }: { data: { posts: Post[] } },
    ): Post => {
      const selectedPostIndex = posts.findIndex((p) => p.id === postId);
      if (selectedPostIndex < 0) {
        throw new Error(`Couldn't find post with Id=${postId}`);
      }
      const updatedPost: Post = { ...posts[selectedPostIndex], ...input };
      const originalPost = posts.splice(selectedPostIndex, 1, updatedPost);
      return updatedPost;
    },
    createComment: (
      _parent: undefined,
      {
        input: { content: text, author, post },
      }: { input: { content: string; author: string; post: string } },
      {
        data: { comments, posts, users },
      }: { data: { comments: Comment[]; posts: Post[]; users: User[] } },
    ): Comment => {
      const newComment: Comment = { id: uuidv4(), text, author, post };
      const isAuthor = users.find((u) => u.id === author);
      const isPost = posts.find((p) => p.id === post && p.published);
      if (!isAuthor || !isPost) {
        throw new Error('There are neither author nor post');
      }
      comments = [...comments, newComment];
      return newComment;
    },
    updateComment: (
      _parent: undefined,
      { commentId, input }: { commentId: string; input: Pick<Comment, 'text'> },
      { data: { comments } }: { data: { comments: Comment[] } },
    ): Comment => {
      const selectedCommentIndex = comments.findIndex((p) => p.id === commentId);
      if (selectedCommentIndex < 0) {
        throw new Error(`Couldn't find comment with Id=${commentId}`);
      }
      const updatedComment: Comment = { ...comments[selectedCommentIndex], ...input };
      const originalPost = comments.splice(selectedCommentIndex, 1, updatedComment);
      return updatedComment;
    },
    deleteComment: (
      _parent: undefined,
      { commentId }: { commentId: string },
      { data: { comments } }: { data: { comments: Comment[] } },
    ): Comment => {
      const commentToRemove = comments.find((c) => c.id === commentId);
      if (!commentToRemove) {
        throw new Error(`Couldn't find comment with Id=${commentId}`);
      }
      comments = comments.filter((c) => c.id !== commentId);
      return commentToRemove;
    },
  },
};

export { Mutation };
