import http from 'http';
import { createApp } from './app';
import { AppDataSource } from './database/data-source';
import { logger } from './core/logger';

const PORT = Number(process.env.PORT) || 8000;

const bootstrap = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established');

    const app = createApp();
    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to bootstrap application', error as Error);
    process.exit(1);
  }
};

void bootstrap();
