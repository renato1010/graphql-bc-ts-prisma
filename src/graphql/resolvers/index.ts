import { IResolvers } from 'graphql-tools/dist/Interfaces';
import { Query } from './queries';
import { Mutation } from './mutations';
import { Subscription } from './subscriptions';
import { Custom } from './customTypes';

const resolvers: IResolvers = { ...Query, ...Mutation, ...Custom };

export { resolvers };
