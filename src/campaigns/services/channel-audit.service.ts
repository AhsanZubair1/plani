import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditAction, AuditLevel } from '@src/audit/domain/audit-log';
import { AuditLogEntity } from '@src/audit/infrastructure/persistence/relational/entities/audit-log.entity';
import { ChannelEntity } from '@src/campaigns/infrastructure/persistence/relational/entities/channel.entity';

@Injectable()
export class ChannelAuditService {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  async updateChannelActiveStatus(
    channelId: number,
    newActiveStatus: boolean,
    userId?: string,
    userName?: string,
  ): Promise<ChannelEntity> {
    // Get current channel
    const channel = await this.channelRepository.findOne({
      where: { channel_id: channelId },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }

    const oldActiveStatus = channel.active;

    // Update channel active status
    channel.active = newActiveStatus;
    const updatedChannel = await this.channelRepository.save(channel);

    // Create audit log entry
    await this.auditLogRepository.save({
      userId,
      userName,
      action: AuditAction.UPDATE,
      resource: 'channel',
      resourceId: channelId.toString(),
      oldValues: { active: oldActiveStatus },
      newValues: { active: newActiveStatus },
      changes: {
        active: {
          old: oldActiveStatus,
          new: newActiveStatus,
        },
      },
      level: AuditLevel.INFO,
      message: `Channel ${channel.channel_name} active status changed from ${oldActiveStatus} to ${newActiveStatus}`,
      createdAt: new Date(),
    });

    return updatedChannel;
  }

  async getChannelActiveSince(channelId: number): Promise<Date | null> {
    try {
      const auditLog = await this.auditLogRepository
        .createQueryBuilder('audit')
        .where('audit.resource = :resource', { resource: 'channel' })
        .andWhere('audit.resourceId = :resourceId', {
          resourceId: channelId.toString(),
        })
        .andWhere("audit.newValues->>'active' = 'true'")
        .orderBy('audit.created_at', 'DESC')
        .getOne();

      return auditLog?.createdAt || null;
    } catch (error) {
      console.error('Error getting channel active since:', error);
      return null;
    }
  }
}
