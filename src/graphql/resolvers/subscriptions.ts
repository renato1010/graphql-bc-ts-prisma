import { Comment, Post } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { MutationOperation, PrismaFull, ServerContext } from 'types';

const Subscription = {
  Subscription: {
    comment: {
      subscribe(
        _parent: undefined,
        _args: undefined,
        { pubsub }: ServerContext,
      ): AsyncIterator<unknown, Comment & { mutation: MutationOperation }, undefined> {
        return pubsub.asyncIterator('comment');
      },
    },
    post: {
      subscribe: (
        _parent: undefined,
        _args: undefined,
        { pubsub }: ServerContext,
      ): AsyncIterator<unknown, Post & { mutation: MutationOperation }, undefined> => {
        return pubsub.asyncIterator('post');
      },
    },
  },
};

export { Subscription };
