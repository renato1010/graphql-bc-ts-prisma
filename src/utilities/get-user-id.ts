/* eslint-disable @typescript-eslint/no-explicit-any */
import { verify } from 'jsonwebtoken';
import { Request } from 'express';

export const TOKEN_SECRET = process.env.TOKEN_SECRET;

function getTokenPayload(token: string): { [key: string]: any } {
  if (!TOKEN_SECRET) {
    return { userId: null };
  }
  return verify(token, TOKEN_SECRET) as { [key: string]: any };
}

function getUserId(req: Request, authToken?: string): string | null {
  const authHeader = req?.headers?.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const { userId } = getTokenPayload(token);
    if (typeof userId === 'string') {
      return userId;
    } else {
      throw new Error('Bad Token');
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    if (typeof userId === 'string') {
      return userId;
    } else {
      throw new Error('Bad Token');
    }
  } else {
    return null;
  }
}

export { getUserId };
