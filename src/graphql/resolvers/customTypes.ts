import { User, Post, Comment } from '../../types';

const Custom = {
  Post: {
    author: (
      { author }: Post,
      _args: undefined,
      { data: { users } }: { data: { users: User[] } },
    ): User => users.find((user) => user.id === author) as User,
    comments: (
      { id }: Post,
      _args: undefined,
      { data: { comments } }: { data: { comments: Comment[] } },
    ): Comment[] => comments.filter((comm) => comm.post === id),
  },
  User: {
    posts: (
      { id }: User,
      _args: undefined,
      { data: { posts } }: { data: { posts: Post[] } },
    ): Post[] => posts.filter((post) => post.author === id),
    comments: (
      { id }: User,
      _args: undefined,
      { data: { comments } }: { data: { comments: Comment[] } },
    ): Comment[] => comments.filter((comm) => comm.author === id),
  },
  Comment: {
    author: (
      { author }: Comment,
      _args: undefined,
      { data: { users } }: { data: { users: User[] } },
    ): User => {
      return users.find((user) => user.id === author) as User;
    },
    post: (
      { post }: Comment,
      _args: undefined,
      { data: { posts } }: { data: { posts: Post[] } },
    ): Post => {
      return posts.find((p) => p.id === post) as Post;
    },
  },
};

export { Custom };
