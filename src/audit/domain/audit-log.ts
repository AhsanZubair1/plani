export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  PUBLISH = 'PUBLISH',
  UNPUBLISH = 'UNPUBLISH',
  ARCHIVE = 'ARCHIVE',
  RESTORE = 'RESTORE',
  BULK_UPDATE = 'BULK_UPDATE',
  BULK_DELETE = 'BULK_DELETE',
  CUSTOM = 'CUSTOM',
}

export enum AuditLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface AuditLogData {
  id?: number;
  userId?: string;
  userName?: string;
  userEmail?: string;
  sessionId?: string;
  action: AuditAction;
  resource: string; // Table/Entity name
  resourceId?: string | number;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  level: AuditLevel;
  message: string;
  metadata?: Record<string, any>;
  tags?: string[];
  createdAt?: Date;
}

export class AuditLog {
  constructor(
    public readonly id: number,
    public readonly userId: string | undefined,
    public readonly userName: string | undefined,
    public readonly userEmail: string | undefined,
    public readonly sessionId: string | undefined,
    public readonly action: AuditAction,
    public readonly resource: string,
    public readonly resourceId: string | number | undefined,
    public readonly oldValues: Record<string, any> | undefined,
    public readonly newValues: Record<string, any> | undefined,
    public readonly changes: Record<string, { old: any; new: any }> | undefined,
    public readonly ipAddress: string | undefined,
    public readonly userAgent: string | undefined,
    public readonly requestId: string | undefined,
    public readonly method: string | undefined,
    public readonly url: string | undefined,
    public readonly statusCode: number | undefined,
    public readonly responseTime: number | undefined,
    public readonly level: AuditLevel,
    public readonly message: string,
    public readonly metadata: Record<string, any> | undefined,
    public readonly tags: string[] | undefined,
    public readonly createdAt: Date,
  ) {}

  static create(data: AuditLogData): AuditLog {
    return new AuditLog(
      data.id || 0,
      data.userId,
      data.userName,
      data.userEmail,
      data.sessionId,
      data.action,
      data.resource,
      data.resourceId,
      data.oldValues,
      data.newValues,
      data.changes,
      data.ipAddress,
      data.userAgent,
      data.requestId,
      data.method,
      data.url,
      data.statusCode,
      data.responseTime,
      data.level,
      data.message,
      data.metadata,
      data.tags,
      data.createdAt || new Date(),
    );
  }

  toJSON(): AuditLogData {
    return {
      id: this.id,
      userId: this.userId,
      userName: this.userName,
      userEmail: this.userEmail,
      sessionId: this.sessionId,
      action: this.action,
      resource: this.resource,
      resourceId: this.resourceId,
      oldValues: this.oldValues,
      newValues: this.newValues,
      changes: this.changes,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      requestId: this.requestId,
      method: this.method,
      url: this.url,
      statusCode: this.statusCode,
      responseTime: this.responseTime,
      level: this.level,
      message: this.message,
      metadata: this.metadata,
      tags: this.tags,
      createdAt: this.createdAt,
    };
  }
}
