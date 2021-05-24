import { PrismaClient } from '@prisma/client';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { resolvers } from './graphql/resolvers';
import { ServerContext } from 'types';
import { getUserId } from './utilities';

const pubsub = new PubSub();
const prisma = new PrismaClient();

const server = new GraphQLServer({
  typeDefs: './src/graphql/schema.graphql',
  resolvers,
  context: ({ request: req }: ContextParameters): ServerContext => ({
    prisma,
    pubsub,
    userId: req?.headers?.authorization ? getUserId(req) : null,
  }),
});
server.start(() => console.log('Server is running on localhost:4000'));
