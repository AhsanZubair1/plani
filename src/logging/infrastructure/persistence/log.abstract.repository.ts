import { Log } from '@src/logging/domain/log';

export abstract class LogAbstractRepository {
  abstract create(log: Omit<Log, 'id' | 'created_at'>): Promise<Log>;
  abstract findMany(limit?: number, offset?: number): Promise<Log[]>;
  abstract findById(id: number): Promise<Log | null>;
  abstract findByUserId(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<Log[]>;
  abstract findByStatusCode(
    statusCode: number,
    limit?: number,
    offset?: number,
  ): Promise<Log[]>;
}
