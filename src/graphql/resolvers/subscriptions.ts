import { PubSub } from 'graphql-subscriptions';
import { Comment, Post, MutationOperation } from 'src/types';
import { PrismaFull } from 'src/types';

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
    // post: {
    //   subscribe: (
    //     _parent: undefined,
    //     _args: undefined,
    //     { pubsub, data: { posts } }: { pubsub: PubSub; data: { posts: Post[] } },
    //   ): AsyncIterator<unknown, Post & { mutation: MutationOperation }, undefined> => {
    //     return pubsub.asyncIterator('post');
    //   },
    // },
  },
};

export { Subscription };
