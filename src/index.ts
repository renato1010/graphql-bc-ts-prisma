import { GraphQLServer } from 'graphql-yoga';
import { IResolvers } from 'graphql-tools/dist/Interfaces';
import { User, Post, Comment } from './types';

// Demo data
const users: User[] = [
  { id: '1', name: 'Renato', email: 'renato@test.com', age: 40 },
  { id: '2', name: 'Plato', email: 'plato@test.com', age: 50 },
  { id: '3', name: 'Aristotle', email: 'aristotle@test.com', age: 60 },
];
const posts: Post[] = [
  { id: 'asdaf12342', title: 'first post', body: 'full first post', published: true, author: '1' },
  { id: '34849qp', title: 'second post', body: 'full second post', published: true, author: '2' },
  { id: '948219peux', title: 'third post', body: 'full third post', published: true, author: '1' },
];
const comments: Comment[] = [
  { id: 'asdfsd', text: 'somy dummy text for comment one', author: '1', post: 'asdaf12342' },
  { id: '22323grrr', text: 'somy dummy text for comment two', author: '2', post: '34849qp' },
  { id: '878334hjuik', text: 'somy dummy text for comment three', author: '3', post: '948219peux' },
  { id: '23456awww', text: 'somy dummy text for comment four', author: '1', post: 'asdaf12342' },
];

const typeDefs = `
  type Query {
    posts(query:String):[Post!]!
    users(query:String): [User!]!
    comments(query:String): [Comment!]!
    me:User!
    post:Post!
  }
  type User {
     id: ID!
     name: String!
     email:String!
     age:Int
     posts:[Post]!
     comments:[Comment!]!
  }
  type Post {
    id:ID!
    title:String!
    body:String!
    published:Boolean!
    author: User!
    comments: [Comment!]!
  }
  type Comment {
    id:ID!
    text:String!
    author:User!
    post:Post!
  }
`;

// resolvers
const resolvers: IResolvers = {
  Query: {
    posts: (_: undefined, { query }: { query: string | undefined }): Post[] => {
      if (!query) {
        return posts;
      }
      return posts.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()));
    },
    users: (_parent: undefined, { query }: { query: string | undefined }): User[] => {
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
    comments: (_: undefined, { query }: { query: string | undefined }): Comment[] => {
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
  Post: {
    author: ({ author }: Post): User => users.find((user) => user.id === author) as User,
    comments: ({ id }: Post): Comment[] => comments.filter((comm) => comm.post === id),
  },
  User: {
    posts: ({ id }: User): Post[] => posts.filter((post) => post.author === id),
    comments: ({ id }: User): Comment[] => comments.filter((comm) => comm.author === id),
  },
  Comment: {
    author: ({ author }: Comment): User => {
      return users.find((user) => user.id === author) as User;
    },
    post: ({ post }: Comment): Post => {
      return posts.find((p) => p.id === post) as Post;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
