import { PrismaClient } from '.prisma/client';
import { GraphQLServer, PubSub } from 'graphql-yoga';
// import data from './db';
import { resolvers } from './graphql/resolvers';

// const pubsub = new PubSub();
const prisma = new PrismaClient();

const server = new GraphQLServer({
  typeDefs: './src/graphql/schema.graphql',
  resolvers,
  context: { prisma },
});
server.start(() => console.log('Server is running on localhost:4000'));
