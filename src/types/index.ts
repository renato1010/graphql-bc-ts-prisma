export interface User {
  id: string;
  name: string;
  email: string;
  age?: number | null;
}
export interface Post {
  id: string;
  title: string;
  body: string;
  published: boolean;
  author: string;
}
export interface QueryType {
  Query: {
    me: () => User;
    post: () => Post;
  };
}
