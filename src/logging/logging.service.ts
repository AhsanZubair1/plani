import { Injectable } from '@nestjs/common';

import { LogAbstractRepository } from './infrastructure/persistence/log.abstract.repository';
import { Log } from './domain/log';

@Injectable()
export class LoggingService {
  constructor(private readonly logRepository: LogAbstractRepository) {}

  async createLog(log: Omit<Log, 'id' | 'created_at'>): Promise<Log> {
    return this.logRepository.create(log);
  }

  async getLogs(limit?: number, offset?: number): Promise<Log[]> {
    return this.logRepository.findMany(limit, offset);
  }

  async getLogById(id: number): Promise<Log | null> {
    return this.logRepository.findById(id);
  }

  async getLogsByUserId(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<Log[]> {
    return this.logRepository.findByUserId(userId, limit, offset);
  }

  async getLogsByStatusCode(
    statusCode: number,
    limit?: number,
    offset?: number,
  ): Promise<Log[]> {
    return this.logRepository.findByStatusCode(statusCode, limit, offset);
  }
}
