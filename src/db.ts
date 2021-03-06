import { User, Post, Comment } from './types';

// Demo data
const users: User[] = [
  { id: '1', name: 'Renato', email: 'renato@test.com', age: 40 },
  { id: '2', name: 'Plato', email: 'plato@test.com', age: 50 },
  { id: '3', name: 'Aristotle', email: 'aristotle@test.com', age: 60 },
];
const posts: Post[] = [
  { id: 'asdaf12342', title: 'first post', body: 'full first post', published: true, userId: '1' },
  { id: '34849qp', title: 'second post', body: 'full second post', published: true, userId: '2' },
  { id: '948219peux', title: 'third post', body: 'full third post', published: true, userId: '1' },
];
const comments: Comment[] = [
  { id: 'asdfsd', text: 'somy dummy text for comment one', userId: '1', postId: 'asdaf12342' },
  { id: '22323grrr', text: 'somy dummy text for comment two', userId: '2', postId: '34849qp' },
  { id: '878334hjuik', text: 'somy dummy text for comment three', userId: '3', postId: '948219peux' },
  { id: '23456awww', text: 'somy dummy text for comment four', userId: '1', postId: 'asdaf12342' },
];

export default { users, posts, comments };
