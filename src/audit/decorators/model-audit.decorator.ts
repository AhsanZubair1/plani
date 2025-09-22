import { SetMetadata } from '@nestjs/common';
import { AuditAction, AuditLevel } from '../domain/audit-log';

export interface ModelAuditOptions {
  /**
   * The action to log (CREATE, READ, UPDATE, DELETE)
   */
  action: AuditAction;

  /**
   * The resource/entity name to log
   */
  resource: string;

  /**
   * Custom message for the audit log
   */
  message?: string;

  /**
   * Audit level (INFO, WARNING, ERROR)
   */
  level?: AuditLevel;

  /**
   * Whether to include the request data
   */
  includeRequest?: boolean;

  /**
   * Whether to include the response data
   */
  includeResponse?: boolean;

  /**
   * Whether to include query parameters
   */
  includeQuery?: boolean;

  /**
   * Whether to include request body
   */
  includeBody?: boolean;

  /**
   * Path to resource ID in response (e.g., 'data.id', 'result.planId')
   */
  resourceIdPath?: string;

  /**
   * Additional tags for the audit log
   */
  tags?: string[];

  /**
   * Additional metadata for the audit log
   */
  metadata?: Record<string, any>;

  /**
   * Whether to track field-level changes (for UPDATE operations)
   */
  trackFieldChanges?: boolean;

  /**
   * Fields to exclude from change tracking
   */
  excludeFields?: string[];

  /**
   * Fields to include in change tracking (if specified, only these fields will be tracked)
   */
  includeFields?: string[];

  /**
   * Whether to log the operation even if it fails
   */
  logOnError?: boolean;

  /**
   * Custom function to extract resource ID from the response
   */
  resourceIdExtractor?: (response: any) => string | number | undefined;

  /**
   * Custom function to extract additional metadata
   */
  metadataExtractor?: (request: any, response: any) => Record<string, any>;
}

export const MODEL_AUDIT_KEY = 'model_audit';

/**
 * Django-style audit decorator for models and entities
 *
 * @example
 * ```typescript
 * @ModelAudit({
 *   action: AuditAction.CREATE,
 *   resource: 'plans',
 *   message: 'Plan created successfully',
 *   includeResponse: true,
 *   resourceIdPath: 'data.plan_id',
 *   tags: ['plans', 'create'],
 *   trackFieldChanges: true
 * })
 * async createPlan(createPlanDto: CreatePlanDto): Promise<Plan> {
 *   // Implementation
 * }
 * ```
 */
export const ModelAudit = (options: ModelAuditOptions) =>
  SetMetadata(MODEL_AUDIT_KEY, options);

/**
 * Shorthand decorators for common audit operations
 */

/**
 * Audit decorator for CREATE operations
 */
export const AuditCreate = (
  resource: string,
  options: Partial<ModelAuditOptions> = {},
) =>
  ModelAudit({
    action: AuditAction.CREATE,
    resource,
    level: AuditLevel.INFO,
    includeResponse: true,
    trackFieldChanges: false,
    tags: ['create', resource],
    ...options,
  });

/**
 * Audit decorator for READ operations
 */
export const AuditRead = (
  resource: string,
  options: Partial<ModelAuditOptions> = {},
) =>
  ModelAudit({
    action: AuditAction.READ,
    resource,
    level: AuditLevel.INFO,
    includeRequest: true,
    includeQuery: true,
    tags: ['read', resource],
    ...options,
  });

/**
 * Audit decorator for UPDATE operations
 */
export const AuditUpdate = (
  resource: string,
  options: Partial<ModelAuditOptions> = {},
) =>
  ModelAudit({
    action: AuditAction.UPDATE,
    resource,
    level: AuditLevel.INFO,
    includeRequest: true,
    includeResponse: true,
    trackFieldChanges: true,
    tags: ['update', resource],
    ...options,
  });

/**
 * Audit decorator for DELETE operations
 */
export const AuditDelete = (
  resource: string,
  options: Partial<ModelAuditOptions> = {},
) =>
  ModelAudit({
    action: AuditAction.DELETE,
    resource,
    level: AuditLevel.WARNING,
    includeRequest: true,
    includeResponse: true,
    tags: ['delete', resource],
    ...options,
  });

/**
 * Audit decorator for bulk operations
 */
export const AuditBulk = (
  resource: string,
  action: AuditAction,
  options: Partial<ModelAuditOptions> = {},
) =>
  ModelAudit({
    action,
    resource,
    level: AuditLevel.INFO,
    includeRequest: true,
    includeResponse: true,
    tags: ['bulk', action.toLowerCase(), resource],
    metadataExtractor: (request, response) => ({
      bulkOperation: true,
      recordCount: response?.data?.length || response?.length || 0,
    }),
    ...options,
  });

/**
 * Audit decorator for sensitive operations
 */
export const AuditSensitive = (
  resource: string,
  action: AuditAction,
  options: Partial<ModelAuditOptions> = {},
) =>
  ModelAudit({
    action,
    resource,
    level: AuditLevel.WARNING,
    includeRequest: false, // Don't include request data for sensitive operations
    includeResponse: false, // Don't include response data for sensitive operations
    tags: ['sensitive', action.toLowerCase(), resource],
    ...options,
  });
