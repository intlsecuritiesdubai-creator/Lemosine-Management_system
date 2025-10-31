import { AppDataSource } from '../../database/data-source';
import { Notification } from './notification.entity';
import { NotificationType, UserRole } from './enums';

export class NotificationService {
  private readonly repo = AppDataSource.getRepository(Notification);

  create(params: { type: NotificationType; message: string; metadata?: Record<string, unknown>; targetRole?: UserRole; targetUserId?: string }) {
    const entity = this.repo.create({
      type: params.type,
      message: params.message,
      metadata: params.metadata,
      targetRole: params.targetRole,
      targetUserId: params.targetUserId
    });
    return this.repo.save(entity);
  }

  listUnread(targetRole?: UserRole) {
    const where: any = { isRead: false };
    if (targetRole) {
      where.targetRole = targetRole;
    }
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async markRead(id: string) {
    const notification = await this.repo.findOneByOrFail({ id });
    notification.isRead = true;
    notification.acknowledgedAt = new Date();
    return this.repo.save(notification);
  }
}
