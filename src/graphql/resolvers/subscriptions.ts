import { PubSub } from 'graphql-subscriptions';
import { MutationOperation, PrismaFull } from '@types';
import { Comment, Post } from '@prisma/client';

const Subscription = {
  Subscription: {
    comment: {
      subscribe(
        _parent: undefined,
        _args: undefined,
        { pubsub, prisma }: { pubsub: PubSub; prisma: PrismaFull },
      ): AsyncIterator<unknown, Comment & { mutation: MutationOperation }, undefined> {
        return pubsub.asyncIterator('comment');
      },
    },
    post: {
      subscribe: (
        _parent: undefined,
        _args: undefined,
        { pubsub, prisma }: { pubsub: PubSub; prisma: PrismaFull },
      ): AsyncIterator<unknown, Post & { mutation: MutationOperation }, undefined> => {
        return pubsub.asyncIterator('post');
      },
    },
  },
};

export { Subscription };
