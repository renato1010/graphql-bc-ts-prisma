import { User, Post, Comment } from '../../types';

const Query = {
  Query: {
    posts: (
      _: undefined,
      { query }: { query: string | undefined },
      { data: { posts } }: { data: { posts: Post[] } },
    ): Post[] => {
      if (!query) {
        return posts;
      }
      return posts.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()));
    },
    users: (
      _parent: undefined,
      { query }: { query: string | undefined },
      { data: { users } }: { data: { users: User[] } },
    ): User[] => {
      if (!query) {
        return users;
      }
      return users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
    },
    me: (): User => {
      return { id: 'adsfasdfa', name: 'Renato Perez', email: 'renato@test.com', age: null };
    },
    post: (): Post => ({
      id: 'abdcd',
      title: 'play with GraphQL and Typescript',
      body: 'a full text for post',
      published: true,
      author: '2',
    }),
    comments: (
      _: undefined,
      { query }: { query: string | undefined },
      { data: { comments } }: { data: { comments: Comment[] } },
    ): Comment[] => {
      if (!query) {
        return comments;
      }
      const matchById = comments.filter((comm) => comm.id.toLowerCase() === query.toLowerCase());
      const matchByText = comments.filter((comm) =>
        comm.text.toLowerCase().includes(query.toLowerCase()),
      );
      return [...matchById, ...matchByText];
    },
  },
};

export { Query };
