import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AuditService } from '../audit.service';
import { BulkAuditService } from '../services/bulk-audit.service';
import { SqlAuditService } from '../services/sql-audit.service';
import { AuditAction, AuditLevel } from '../domain/audit-log';

/**
 * Example service demonstrating advanced audit logging features
 * including raw SQL queries, bulk operations, and comprehensive database activity tracking
 */
@Injectable()
export class AdvancedAuditUsageExample {
  private readonly logger = new Logger(AdvancedAuditUsageExample.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly bulkAuditService: BulkAuditService,
    private readonly sqlAuditService: SqlAuditService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Example: Logging raw SQL queries
   */
  async executeRawQuery() {
    const context = {
      userId: 'user123',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      metadata: {
        source: 'raw_query_example',
        operation: 'custom_report',
      },
      tags: ['reporting', 'custom_query'],
    };

    try {
      // Execute raw SQL query
      const startTime = Date.now();
      const result = await this.dataSource.query(
        'SELECT p.*, c.name as campaign_name FROM plans p LEFT JOIN campaigns c ON p.id = c.plan_id WHERE p.status = ?',
        ['active'],
      );
      const executionTime = Date.now() - startTime;

      // Log the raw SQL query
      await this.sqlAuditService.logRawQuery(
        'SELECT p.*, c.name as campaign_name FROM plans p LEFT JOIN campaigns c ON p.id = c.plan_id WHERE p.status = ?',
        context,
        executionTime,
        ['active'],
      );

      this.logger.log(
        `Raw query executed in ${executionTime}ms, returned ${result.length} records`,
      );
      return result;
    } catch (error) {
      this.logger.error('Raw query execution failed:', error);
      throw error;
    }
  }

  /**
   * Example: Logging stored procedure calls
   */
  async executeStoredProcedure() {
    const context = {
      userId: 'user123',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      metadata: {
        source: 'stored_procedure_example',
        operation: 'data_migration',
      },
      tags: ['migration', 'stored_procedure'],
    };

    try {
      const startTime = Date.now();
      const result = await this.dataSource.query(
        'CALL migrate_plan_data(?, ?)',
        ['2024-01-01', '2024-12-31'],
      );
      const executionTime = Date.now() - startTime;

      // Log the stored procedure call
      await this.sqlAuditService.logStoredProcedure(
        'migrate_plan_data',
        ['2024-01-01', '2024-12-31'],
        context,
        executionTime,
      );

      this.logger.log(`Stored procedure executed in ${executionTime}ms`);
      return result;
    } catch (error) {
      this.logger.error('Stored procedure execution failed:', error);
      throw error;
    }
  }

  /**
   * Example: Logging bulk create operations
   */
  async bulkCreatePlans(planData: any[]) {
    const context = {
      userId: 'user123',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      metadata: {
        source: 'bulk_create_example',
        operation: 'plan_import',
        importSource: 'csv_file',
      },
      tags: ['bulk_operation', 'plan_import'],
    };

    try {
      // Simulate bulk insert
      const createdPlans = planData.map((data, index) => ({
        id: index + 1000,
        name: data.name,
        price: data.price,
        status: 'draft',
        created_at: new Date(),
      }));

      // Log the bulk create operation
      await this.bulkAuditService.logBulkCreate(createdPlans, 'plans', context);

      this.logger.log(`Bulk created ${createdPlans.length} plans`);
      return createdPlans;
    } catch (error) {
      this.logger.error('Bulk create operation failed:', error);
      throw error;
    }
  }

  /**
   * Example: Logging bulk update operations
   */
  async bulkUpdatePlans(planIds: number[], updateData: any) {
    const context = {
      userId: 'user123',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      metadata: {
        source: 'bulk_update_example',
        operation: 'plan_status_update',
        updateReason: 'batch_approval',
      },
      tags: ['bulk_operation', 'plan_update'],
    };

    try {
      // Simulate bulk update
      const updatedPlans = planIds.map((id) => ({
        id,
        ...updateData,
        updated_at: new Date(),
      }));

      // Log the bulk update operation
      await this.bulkAuditService.logBulkUpdate(updatedPlans, 'plans', context);

      this.logger.log(`Bulk updated ${updatedPlans.length} plans`);
      return updatedPlans;
    } catch (error) {
      this.logger.error('Bulk update operation failed:', error);
      throw error;
    }
  }

  /**
   * Example: Logging bulk delete operations
   */
  async bulkDeletePlans(planIds: number[]) {
    const context = {
      userId: 'user123',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      metadata: {
        source: 'bulk_delete_example',
        operation: 'plan_cleanup',
        deleteReason: 'expired_plans',
      },
      tags: ['bulk_operation', 'plan_cleanup'],
    };

    try {
      // Simulate bulk delete
      const deletedPlans = planIds.map((id) => ({
        id,
        deleted_at: new Date(),
      }));

      // Log the bulk delete operation
      await this.bulkAuditService.logBulkDelete(deletedPlans, 'plans', context);

      this.logger.log(`Bulk deleted ${deletedPlans.length} plans`);
      return deletedPlans;
    } catch (error) {
      this.logger.error('Bulk delete operation failed:', error);
      throw error;
    }
  }

  /**
   * Example: Logging bulk read operations
   */
  async bulkReadPlans(filters: any) {
    const context = {
      userId: 'user123',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      metadata: {
        source: 'bulk_read_example',
        operation: 'plan_export',
        exportFormat: 'csv',
      },
      tags: ['bulk_operation', 'plan_export'],
    };

    try {
      // Simulate bulk read
      const plans = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        name: `Plan ${index + 1}`,
        price: Math.random() * 1000,
        status: 'active',
      }));

      // Log the bulk read operation
      await this.bulkAuditService.logBulkRead(plans, 'plans', context);

      this.logger.log(`Bulk read ${plans.length} plans`);
      return plans;
    } catch (error) {
      this.logger.error('Bulk read operation failed:', error);
      throw error;
    }
  }

  /**
   * Example: Comprehensive audit logging with custom actions
   */
  async comprehensiveAuditExample() {
    const context = {
      userId: 'user123',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      metadata: {
        source: 'comprehensive_example',
        operation: 'data_processing_pipeline',
        pipelineStep: 'validation',
      },
      tags: ['pipeline', 'data_processing'],
    };

    try {
      // Log the start of a complex operation
      await this.auditService.log(
        AuditAction.CUSTOM,
        'data_pipeline',
        'Data processing pipeline started',
        {
          ...context,
          metadata: {
            ...context.metadata,
            pipelineStep: 'start',
            totalRecords: 10000,
          },
          tags: ['pipeline', 'start'],
        },
        {
          level: AuditLevel.INFO,
        },
      );

      // Simulate some processing steps
      await this.bulkReadPlans({ status: 'active' });
      await this.bulkUpdatePlans([1, 2, 3], { status: 'processed' });
      await this.executeRawQuery();

      // Log the completion
      await this.auditService.log(
        AuditAction.CUSTOM,
        'data_pipeline',
        'Data processing pipeline completed successfully',
        {
          ...context,
          metadata: {
            ...context.metadata,
            pipelineStep: 'complete',
            processedRecords: 10000,
            successRate: 100,
          },
          tags: ['pipeline', 'complete'],
        },
        {
          level: AuditLevel.INFO,
        },
      );

      this.logger.log('Comprehensive audit example completed');
    } catch (error) {
      // Log errors
      await this.auditService.log(
        AuditAction.CUSTOM,
        'data_pipeline',
        'Data processing pipeline failed',
        {
          ...context,
          metadata: {
            ...context.metadata,
            pipelineStep: 'error',
            error: error.message,
          },
          tags: ['pipeline', 'error'],
        },
        {
          level: AuditLevel.ERROR,
        },
      );

      this.logger.error('Comprehensive audit example failed:', error);
      throw error;
    }
  }

  /**
   * Example: Performance monitoring with audit logs
   */
  async performanceMonitoringExample() {
    const context = {
      userId: 'user123',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      metadata: {
        source: 'performance_monitoring',
        operation: 'slow_query_analysis',
      },
      tags: ['performance', 'monitoring'],
    };

    try {
      const startTime = Date.now();

      // Execute a potentially slow operation
      const result = await this.dataSource.query(
        'SELECT * FROM plans p JOIN campaigns c ON p.id = c.plan_id JOIN users u ON c.user_id = u.id WHERE p.created_at > ? ORDER BY p.created_at DESC',
        ['2024-01-01'],
      );

      const executionTime = Date.now() - startTime;

      // Log performance metrics
      await this.auditService.log(
        AuditAction.READ,
        'plans',
        `Slow query executed in ${executionTime}ms`,
        {
          ...context,
          metadata: {
            ...context.metadata,
            executionTime,
            recordCount: result.length,
            queryType: 'complex_join',
            performanceLevel: executionTime > 1000 ? 'slow' : 'normal',
          },
          tags: [
            'performance',
            executionTime > 1000 ? 'slow_query' : 'normal_query',
          ],
        },
        {
          level: executionTime > 1000 ? AuditLevel.WARNING : AuditLevel.INFO,
        },
      );

      this.logger.log(
        `Query executed in ${executionTime}ms, returned ${result.length} records`,
      );
      return result;
    } catch (error) {
      this.logger.error('Performance monitoring example failed:', error);
      throw error;
    }
  }
}
