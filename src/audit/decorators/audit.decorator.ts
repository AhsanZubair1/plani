import { SetMetadata } from '@nestjs/common';
import { AuditAction, AuditLevel } from '../domain/audit-log';

export interface AuditOptions {
  action: AuditAction;
  resource: string;
  message?: string;
  level?: AuditLevel;
  includeRequest?: boolean;
  includeResponse?: boolean;
  includeParams?: boolean;
  includeQuery?: boolean;
  includeBody?: boolean;
  resourceIdPath?: string; // Path to resource ID in response (e.g., 'data.id')
  tags?: string[];
  metadata?: Record<string, any>;
}

export const AUDIT_KEY = 'audit';

export const Audit = (options: AuditOptions) => SetMetadata(AUDIT_KEY, options);
