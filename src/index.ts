import { GraphQLServer } from 'graphql-yoga';
import { IResolvers } from 'graphql-tools/dist/Interfaces';
import { User, Post } from './types';

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
const typeDefs = `
  type Query {
    posts(query:String):[Post!]!
    users(query:String): [User!]!
    me:User!
    post:Post!
  }
  type User {
     id: ID!
     name: String!
     email:String!
     age:Int
  }
  type Post {
    id:ID!
    title:String!
    body:String!
    published:Boolean!
    author: User!
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
  },
  Post: {
    author: ({ author }: Post): User => users.find((user) => user.id === author) as User,
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
