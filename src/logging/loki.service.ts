import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  labels: Record<string, string>;
  fields: Record<string, any>;
}

@Injectable()
export class LokiService {
  private readonly logger = new Logger(LokiService.name);
  private readonly lokiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.lokiUrl = this.configService.get<string>(
      'LOKI_URL',
      'http://localhost:3100',
    );
  }

  async sendLogs(logs: LogEntry[]): Promise<void> {
    try {
      const streams = this.groupLogsByLabels(logs);
      const payload = {
        streams: streams.map((stream) => ({
          stream: stream.labels,
          values: stream.entries.map((entry) => [
            entry.timestamp,
            entry.message,
          ]),
        })),
      };

      await axios.post(`${this.lokiUrl}/loki/api/v1/push`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      this.logger.debug(`Successfully sent ${logs.length} logs to Loki`);
    } catch (error) {
      this.logger.error('Failed to send logs to Loki:', error.message);
      // Don't throw error to prevent breaking the main application flow
    }
  }

  async sendLog(log: LogEntry): Promise<void> {
    await this.sendLogs([log]);
  }

  private groupLogsByLabels(
    logs: LogEntry[],
  ): Array<{ labels: Record<string, string>; entries: LogEntry[] }> {
    const groups = new Map<
      string,
      { labels: Record<string, string>; entries: LogEntry[] }
    >();

    for (const log of logs) {
      const key = JSON.stringify(log.labels);
      if (!groups.has(key)) {
        groups.set(key, { labels: log.labels, entries: [] });
      }
      groups.get(key)!.entries.push(log);
    }

    return Array.from(groups.values());
  }

  private formatTimestamp(timestamp: Date): string {
    return (timestamp.getTime() * 1000000).toString(); // Convert to nanoseconds
  }

  createLogEntry(
    level: string,
    message: string,
    labels: Record<string, string>,
    fields: Record<string, any> = {},
  ): LogEntry {
    // Include fields in the message for better visibility in Grafana
    const fieldsString = Object.entries(fields)
      .filter(
        ([key, value]) => value !== null && value !== undefined && value !== '',
      )
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join(' ');

    const fullMessage = fieldsString ? `${message} | ${fieldsString}` : message;

    return {
      timestamp: this.formatTimestamp(new Date()),
      level,
      message: fullMessage,
      labels,
      fields,
    };
  }
}
