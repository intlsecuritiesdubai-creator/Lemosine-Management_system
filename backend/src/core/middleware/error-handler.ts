import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../logger';

interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

export const errorHandler = (error: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const status = error.status ?? 500;
  const isZodError = error instanceof ZodError;
  const message = isZodError ? 'Validation failed' : error.message || 'Internal server error';
  const details = isZodError ? error.flatten() : error.details;

  if (status >= 500) {
    logger.error('Unhandled error', error);
  } else {
    logger.warn('Handled error', { message: error.message, status, details });
  }

  res.status(status).json({
    success: false,
    message,
    details
  });
};
