import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  }

  static async bootstrap(_req: Request, res: Response) {
    const admin = await authService.registerSuperAdmin();
    res.json({ success: true, data: { email: admin.email } });
  }
}
