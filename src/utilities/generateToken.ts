import { sign } from 'jsonwebtoken';
import { TOKEN_SECRET } from '.';

export const generateToken = (tokenPayload: Record<string, unknown>): string | null => {
  if (TOKEN_SECRET) {
    return sign(tokenPayload, TOKEN_SECRET, { expiresIn: '4d' });
  }
  return null;
};
