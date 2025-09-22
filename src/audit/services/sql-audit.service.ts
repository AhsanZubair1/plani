import { Injectable, Logger } from '@nestjs/common';

import { AuditService } from '../audit.service';
import { AuditAction, AuditLevel } from '../domain/audit-log';
import { getAuditConfig } from '../config/audit.config';

@Injectable()
export class SqlAuditService {
  private readonly logger = new Logger(SqlAuditService.name);

  constructor(private readonly auditService: AuditService) {}

  async logRawQuery(
    sql: string,
    context: any,
    executionTime?: number,
    parameters?: any[],
  ): Promise<void> {
    const config = getAuditConfig();
    if (!config.enabled || !config.logRawQueries) {
      return;
    }

    try {
      const tableName = this.extractTableNameFromSQL(sql);
      const action = this.getActionFromSQL(sql);

      await this.auditService.log(
        action,
        tableName || 'unknown',
        `Raw SQL query executed`,
        {
          ...context,
          metadata: {
            ...context.metadata,
            sql: this.sanitizeSQL(sql),
            queryType: 'raw_sql',
            executionTime: executionTime || 0,
            parameters: parameters
              ? this.sanitizeParameters(parameters)
              : undefined,
            tableName,
          },
          tags: ['database', 'raw_sql', action.toLowerCase()],
        },
        {
          level: AuditLevel.INFO,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log raw SQL query:', error);
    }
  }

  async logStoredProcedure(
    procedureName: string,
    parameters: any[],
    context: any,
    executionTime?: number,
  ): Promise<void> {
    const config = getAuditConfig();
    if (!config.enabled || !config.logRawQueries) {
      return;
    }

    try {
      await this.auditService.log(
        AuditAction.CUSTOM,
        'stored_procedure',
        `Stored procedure ${procedureName} executed`,
        {
          ...context,
          metadata: {
            ...context.metadata,
            procedureName,
            parameters: this.sanitizeParameters(parameters),
            executionTime: executionTime || 0,
            queryType: 'stored_procedure',
          },
          tags: ['database', 'stored_procedure'],
        },
        {
          level: AuditLevel.INFO,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log stored procedure:', error);
    }
  }

  private extractTableNameFromSQL(sql: string): string | null {
    // Simple regex to extract table name from SELECT, INSERT, UPDATE, DELETE
    const patterns = [
      /FROM\s+(\w+)/i,
      /INTO\s+(\w+)/i,
      /UPDATE\s+(\w+)/i,
      /DELETE\s+FROM\s+(\w+)/i,
    ];

    for (const pattern of patterns) {
      const match = sql.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  private getActionFromSQL(sql: string): AuditAction {
    const upperSQL = sql.toUpperCase().trim();

    if (upperSQL.startsWith('SELECT')) {
      return AuditAction.READ;
    } else if (upperSQL.startsWith('INSERT')) {
      return AuditAction.CREATE;
    } else if (upperSQL.startsWith('UPDATE')) {
      return AuditAction.UPDATE;
    } else if (upperSQL.startsWith('DELETE')) {
      return AuditAction.DELETE;
    } else {
      return AuditAction.CUSTOM;
    }
  }

  private sanitizeSQL(sql: string): string {
    // Remove sensitive data from SQL queries
    const sensitivePatterns = [
      /password\s*=\s*'[^']*'/gi,
      /token\s*=\s*'[^']*'/gi,
      /secret\s*=\s*'[^']*'/gi,
      /key\s*=\s*'[^']*'/gi,
      /pwd\s*=\s*'[^']*'/gi,
      /pass\s*=\s*'[^']*'/gi,
    ];

    let sanitizedSQL = sql;
    sensitivePatterns.forEach((pattern) => {
      sanitizedSQL = sanitizedSQL.replace(pattern, (match) => {
        const key = match.split('=')[0].trim();
        return `${key} = '[REDACTED]'`;
      });
    });

    // Limit SQL length to prevent database bloat
    const maxLength = 2000;
    if (sanitizedSQL.length > maxLength) {
      return sanitizedSQL.substring(0, maxLength) + '... [truncated]';
    }

    return sanitizedSQL;
  }

  private sanitizeParameters(parameters: any[]): any[] {
    if (!parameters || !Array.isArray(parameters)) {
      return parameters;
    }

    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'pwd', 'pass'];

    return parameters.map((param) => {
      if (typeof param === 'object' && param !== null) {
        const sanitized = { ...param };
        Object.keys(sanitized).forEach((key) => {
          if (
            sensitiveKeys.some((sensitiveKey) =>
              key.toLowerCase().includes(sensitiveKey.toLowerCase()),
            )
          ) {
            sanitized[key] = '[REDACTED]';
          }
        });
        return sanitized;
      }
      return param;
    });
  }
}
