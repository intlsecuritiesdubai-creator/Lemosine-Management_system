import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

interface JwtPayload {
  sub: string;
  role: string;
}

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.refreshSecret, { expiresIn: env.refreshExpiresIn });

export const verifyAccessToken = (token: string) => jwt.verify(token, env.jwtSecret) as JwtPayload;
