import { Injectable, Logger } from '@nestjs/common';

import { LokiService, LogEntry } from './loki.service';

export interface ApiLogData {
  method: string;
  url: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  status_code: number;
  response_time_ms: number;
  request_body: string | null;
  response_body: string | null;
  error_message?: string;
  controller?: string;
  action?: string;
}

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  constructor(private readonly lokiService: LokiService) {}

  async createLog(logData: ApiLogData): Promise<void> {
    try {
      const level = this.getLogLevel(logData.status_code);
      const message = this.formatLogMessage(logData);

      const labels = {
        job: 'api',
        method: logData.method,
        status_code: logData.status_code.toString(),
        controller: logData.controller || 'unknown',
        action: logData.action || 'unknown',
        level: level,
      };

      const fields = {
        url: logData.url,
        user_id: logData.user_id,
        ip_address: logData.ip_address,
        user_agent: logData.user_agent,
        response_time_ms: logData.response_time_ms,
        request_body: logData.request_body,
        response_body: logData.response_body,
        error_message: logData.error_message,
      };

      const logEntry = this.lokiService.createLogEntry(
        level,
        message,
        labels,
        fields,
      );

      await this.lokiService.sendLog(logEntry);
    } catch (error) {
      this.logger.error('Failed to create log entry:', error);
    }
  }

  private getLogLevel(statusCode: number): string {
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'warn';
    if (statusCode >= 300) return 'info';
    return 'info';
  }

  private formatLogMessage(logData: ApiLogData): string {
    const { method, url, status_code, response_time_ms, controller, action } =
      logData;

    let message = `${method} ${url} - ${status_code} (${response_time_ms}ms)`;

    if (controller && action) {
      message += ` [${controller}.${action}]`;
    }

    if (logData.error_message) {
      message += ` - Error: ${logData.error_message}`;
    }

    return message;
  }

  // Legacy methods for backward compatibility - these will now return empty arrays
  // since we're not storing logs in the database anymore
  async getLogs(limit?: number, offset?: number): Promise<any[]> {
    this.logger.warn(
      'getLogs() called - logs are now stored in Loki, not database',
    );
    return [];
  }

  async getLogById(id: number): Promise<any | null> {
    this.logger.warn(
      'getLogById() called - logs are now stored in Loki, not database',
    );
    return null;
  }

  async getLogsByUserId(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<any[]> {
    this.logger.warn(
      'getLogsByUserId() called - logs are now stored in Loki, not database',
    );
    return [];
  }

  async getLogsByStatusCode(
    statusCode: number,
    limit?: number,
    offset?: number,
  ): Promise<any[]> {
    this.logger.warn(
      'getLogsByStatusCode() called - logs are now stored in Loki, not database',
    );
    return [];
  }
}
