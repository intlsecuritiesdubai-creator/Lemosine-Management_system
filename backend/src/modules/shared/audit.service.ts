import { AppDataSource } from '../../database/data-source';
import { AuditLog } from './audit-log.entity';

export class AuditService {
  private readonly repo = AppDataSource.getRepository(AuditLog);

  async log(action: string, entityName: string, entityId: string, actorId?: string, changes?: Record<string, unknown>) {
    const entry = this.repo.create({ action, entityName, entityId, actorId, changes });
    await this.repo.save(entry);
    return entry;
  }
}
