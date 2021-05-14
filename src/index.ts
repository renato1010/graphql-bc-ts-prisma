import { GraphQLServer, PubSub } from 'graphql-yoga';
import data from './db';
import { resolvers } from './graphql/resolvers';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/graphql/schema.graphql',
  resolvers,
  context: { data, pubsub },
});
server.start(() => console.log('Server is running on localhost:4000'));
