import { GraphQLServer } from 'graphql-yoga';

// type definitions
const typeDefs = `
  type Query {
    hello:String!
    name: String!
    location: String!
    bio:String!
  }
`;
// resolvers
const resolvers = {
  Query: {
    hello: (): string => 'This is my first query!',
    name: (): string => 'Renato Perez',
    location: (): string => 'Guatemala City',
    bio: (): string => 'Frontend developer keen into Typescript',
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
