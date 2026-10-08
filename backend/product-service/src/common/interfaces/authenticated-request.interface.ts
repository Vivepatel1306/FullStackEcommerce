import type { Request } from 'express';
import { AuthenticatedUser } from './user.interface';

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}