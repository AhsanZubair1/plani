import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { AuditService } from '../audit.service';

@Injectable()
export class AuditCleanupTask {
  private readonly logger = new Logger(AuditCleanupTask.name);

  constructor(private readonly auditService: AuditService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldAuditLogs() {
    this.logger.log('Starting audit log cleanup task...');

    try {
      // Clean up logs older than 90 days by default
      const retentionDays = parseInt(
        process.env.AUDIT_RETENTION_DAYS || '90',
        10,
      );
      const deletedCount =
        await this.auditService.cleanupOldLogs(retentionDays);

      this.logger.log(
        `Audit log cleanup completed. Deleted ${deletedCount} old logs.`,
      );
    } catch (error) {
      this.logger.error('Audit log cleanup failed:', error);
    }
  }

  @Cron(CronExpression.EVERY_WEEK)
  async generateAuditReport() {
    this.logger.log('Generating weekly audit report...');

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const stats = await this.auditService.getAuditStats(startDate, endDate);

      this.logger.log('Weekly audit report:', {
        period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
        totalLogs: stats.totalLogs,
        logsByAction: stats.logsByAction,
        logsByLevel: stats.logsByLevel,
        logsByResource: stats.logsByResource,
        topUsers: Object.entries(stats.logsByUser)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .reduce((acc, [user, count]) => ({ ...acc, [user]: count }), {}),
      });
    } catch (error) {
      this.logger.error('Failed to generate audit report:', error);
    }
  }
}
