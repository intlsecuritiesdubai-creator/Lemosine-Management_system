import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import { errorHandler } from './core/middleware/error-handler';
import { notFoundHandler } from './core/middleware/not-found-handler';
import { registerRoutes } from './routes';
import { logger } from './core/logger';
import './config/env';
import './core/middleware/async-errors';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.CLIENT_URL?.split(',') ?? '*', credentials: true }));
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true }));
  app.use(morgan('combined', { stream: { write: (message) => logger.http(message.trim()) } }));

  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
