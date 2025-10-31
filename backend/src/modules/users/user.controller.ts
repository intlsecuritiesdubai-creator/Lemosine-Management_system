import { Request, Response } from 'express';
import { UserService } from './user.service';

const userService = new UserService();

export class UserController {
  static async list(req: Request, res: Response) {
    const users = await userService.listUsers();
    res.json({ success: true, data: users });
  }

  static async get(req: Request, res: Response) {
    const user = await userService.getUser(req.params.id);
    res.json({ success: true, data: user });
  }

  static async create(req: Request, res: Response) {
    const actorId = req.user?.id ?? 'system';
    const user = await userService.createUser(req.body, actorId);
    res.status(201).json({ success: true, data: user });
  }

  static async update(req: Request, res: Response) {
    const actorId = req.user?.id ?? 'system';
    const user = await userService.updateUser(req.params.id, req.body, actorId);
    res.json({ success: true, data: user });
  }

  static async remove(req: Request, res: Response) {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  }
}
