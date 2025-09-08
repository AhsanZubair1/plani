import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Log } from '@src/logging/domain/log';
import { LogAbstractRepository } from '@src/logging/infrastructure/persistence/log.abstract.repository';
import { LogEntity } from '@src/logging/infrastructure/persistence/relational/entities/log.entity';

@Injectable()
export class LogRepository extends LogAbstractRepository {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logsRepository: Repository<LogEntity>,
  ) {
    super();
  }

  async create(log: Omit<Log, 'id' | 'created_at'>): Promise<Log> {
    const logEntity = this.logsRepository.create({
      ...log,
      request_body: log.request_body || null,
      response_body: log.response_body || null,
    });
    const savedLog = await this.logsRepository.save(logEntity);
    return savedLog as Log;
  }

  async findMany(limit = 100, offset = 0): Promise<Log[]> {
    return this.logsRepository.find({
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: number): Promise<Log | null> {
    return this.logsRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: string, limit = 100, offset = 0): Promise<Log[]> {
    return this.logsRepository.find({
      where: { user_id: userId },
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });
  }

  async findByStatusCode(
    statusCode: number,
    limit = 100,
    offset = 0,
  ): Promise<Log[]> {
    return this.logsRepository.find({
      where: { status_code: statusCode },
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });
  }
}
