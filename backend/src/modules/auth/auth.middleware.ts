import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../../core/utils/token';
import { UserRepository } from '../users/user.repository';
import { UserRole } from '../shared/enums';

const userRepository = new UserRepository();

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(Object.assign(new Error('Authentication required'), { status: 401 }));
  }
  const token = header.replace('Bearer ', '');
  try {
    const payload = verifyAccessToken(token);
    const user = await userRepository.findById(payload.sub);
    if (!user) {
      return next(Object.assign(new Error('User not found'), { status: 401 }));
    }
    req.user = {
      id: user.id,
      role: user.role.name,
      email: user.email,
      fullName: user.fullName
    };
    return next();
  } catch (error) {
    return next(Object.assign(new Error('Invalid token'), { status: 401 }));
  }
};

export const authorize = (roles: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(Object.assign(new Error('Authentication required'), { status: 401 }));
  }
  if (!roles.includes(req.user.role as UserRole)) {
    return next(Object.assign(new Error('Insufficient permissions'), { status: 403 }));
  }
  return next();
};
