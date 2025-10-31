import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 8000,
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET ?? 'super-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret-key',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  db: {
    host: process.env.DB_HOST ?? 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER ?? 'limousine',
    password: process.env.DB_PASSWORD ?? 'limousine',
    database: process.env.DB_NAME ?? 'limousine_db'
  }
};
