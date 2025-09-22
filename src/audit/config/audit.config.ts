export interface AuditConfig {
  // Global settings
  enabled: boolean;
  logReads: boolean;
  logWrites: boolean;
  logDeletes: boolean;
  logRawQueries: boolean;
  logBulkOperations: boolean;

  // Performance settings
  batchSize: number;
  asyncLogging: boolean;
  maxRetries: number;

  // Retention settings
  retentionDays: number;
  sensitiveDataRetentionDays: number;

  // Sensitive entities that should always be audited
  sensitiveEntities: string[];

  // Entities to exclude from audit logging
  excludedEntities: string[];

  // Fields to exclude from audit logs
  excludedFields: string[];
}

export const defaultAuditConfig: AuditConfig = {
  enabled: process.env.AUDIT_ENABLED !== 'false',
  logReads: process.env.AUDIT_LOG_READS === 'true',
  logWrites: process.env.AUDIT_LOG_WRITES !== 'false',
  logDeletes: process.env.AUDIT_LOG_DELETES !== 'false',
  logRawQueries: process.env.AUDIT_LOG_RAW_QUERIES === 'true',
  logBulkOperations: process.env.AUDIT_LOG_BULK_OPERATIONS === 'true',

  batchSize: parseInt(process.env.AUDIT_BATCH_SIZE || '100', 10),
  asyncLogging: process.env.AUDIT_ASYNC_LOGGING !== 'false',
  maxRetries: parseInt(process.env.AUDIT_MAX_RETRIES || '3', 10),

  retentionDays: parseInt(process.env.AUDIT_RETENTION_DAYS || '90', 10),
  sensitiveDataRetentionDays: parseInt(
    process.env.AUDIT_SENSITIVE_RETENTION_DAYS || '365',
    10,
  ),

  sensitiveEntities: [
    'users',
    'audit_logs',
    'sessions',
    'tokens',
    'plans',
    'campaigns',
    'charges',
    'rates',
    'retail_tariffs',
    'network_tariffs',
  ],

  excludedEntities: [
    'migrations',
    'migration_versions',
    'typeorm_metadata',
    'temp_tables',
  ],

  excludedFields: [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'refreshToken',
    'accessToken',
    'creditCard',
    'cvv',
    'ssn',
    'cardNumber',
    'expiry',
    'securityCode',
    'created_at',
    'updated_at',
  ],
};

export const getAuditConfig = (): AuditConfig => {
  return {
    ...defaultAuditConfig,
    // Override with environment variables if needed
    enabled: process.env.AUDIT_ENABLED !== 'false',
    logReads: process.env.AUDIT_LOG_READS === 'true',
    logWrites: process.env.AUDIT_LOG_WRITES !== 'false',
    logDeletes: process.env.AUDIT_LOG_DELETES !== 'false',
    logRawQueries: process.env.AUDIT_LOG_RAW_QUERIES === 'true',
    logBulkOperations: process.env.AUDIT_LOG_BULK_OPERATIONS === 'true',
  };
};
