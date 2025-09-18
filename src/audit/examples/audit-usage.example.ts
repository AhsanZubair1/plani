/**
 * Example usage of the comprehensive audit logging system
 * This demonstrates how to use the audit system in your controllers and services
 */

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';

import { AuditService } from '@src/audit/audit.service';
import { Audit, AuditOptions } from '@src/audit/decorators/audit.decorator';
import { AuditAction, AuditLevel } from '@src/audit/domain/audit-log';

// Example controller showing how to use audit decorators
@Controller('example')
export class ExampleController {
  constructor(private readonly auditService: AuditService) {}

  // Example 1: Using @Audit decorator for automatic logging
  @Post()
  @Audit({
    action: AuditAction.CREATE,
    resource: 'Example',
    message: 'Creating new example',
    includeRequest: true,
    includeResponse: true,
    resourceIdPath: 'data.id',
    tags: ['example', 'create'],
  })
  async create(@Body() createDto: any, @Request() req: any) {
    // Your business logic here
    return { data: { id: 1, name: 'Example' } };
  }

  // Example 2: Manual audit logging in service methods
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
    @Request() req: any,
  ) {
    // Get old values before update
    const oldValues = { name: 'Old Name', status: 'active' };

    // Perform update
    const updatedData = { id, ...updateDto };

    // Log the update manually
    await this.auditService.logUpdate(
      'Example',
      oldValues,
      updatedData,
      {
        userId: req.user?.id,
        userName: req.user?.name,
        userEmail: req.user?.email,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        sessionId: req.sessionID,
        metadata: { controller: 'ExampleController', method: 'update' },
        tags: ['example', 'update'],
      },
      id,
    );

    return updatedData;
  }

  // Example 3: Error logging
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    try {
      // Your delete logic here
      const deletedData = { id, name: 'Deleted Example' };

      // Log successful deletion
      await this.auditService.logDelete(
        'Example',
        deletedData,
        {
          userId: req.user?.id,
          userName: req.user?.name,
          userEmail: req.user?.email,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          sessionId: req.sessionID,
          metadata: { controller: 'ExampleController', method: 'delete' },
          tags: ['example', 'delete'],
        },
        id,
      );

      return { message: 'Deleted successfully' };
    } catch (error) {
      // Log error
      await this.auditService.logError(
        AuditAction.DELETE,
        'Example',
        'Failed to delete example',
        error,
        {
          userId: req.user?.id,
          userName: req.user?.name,
          userEmail: req.user?.email,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          sessionId: req.sessionID,
          metadata: { controller: 'ExampleController', method: 'delete' },
          tags: ['example', 'error'],
        },
        id,
      );

      throw error;
    }
  }

  // Example 4: Login/Logout logging
  @Post('login')
  async login(@Body() loginDto: any, @Request() req: any) {
    // Your authentication logic here
    const user = { id: 'user123', name: 'John Doe', email: 'john@example.com' };

    // Log successful login
    await this.auditService.logLogin(user.id, user.name, user.email, {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      sessionId: req.sessionID,
      metadata: { controller: 'ExampleController', method: 'login' },
      tags: ['authentication', 'login'],
    });

    return { user, token: 'jwt-token' };
  }

  @Post('logout')
  async logout(@Request() req: any) {
    const user = req.user;

    // Log logout
    await this.auditService.logLogout(user.id, user.name, {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      sessionId: req.sessionID,
      metadata: { controller: 'ExampleController', method: 'logout' },
      tags: ['authentication', 'logout'],
    });

    return { message: 'Logged out successfully' };
  }

  // Example 5: Bulk operations
  @Post('bulk-update')
  async bulkUpdate(@Body() bulkUpdateDto: any, @Request() req: any) {
    const { ids, updates } = bulkUpdateDto;

    // Log bulk update
    await this.auditService.log(
      AuditAction.BULK_UPDATE,
      'Example',
      `Bulk updated ${ids.length} examples`,
      {
        userId: req.user?.id,
        userName: req.user?.name,
        userEmail: req.user?.email,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        sessionId: req.sessionID,
        metadata: {
          controller: 'ExampleController',
          method: 'bulkUpdate',
          affectedIds: ids,
          updateFields: Object.keys(updates),
        },
        tags: ['example', 'bulk-update'],
      },
      {
        newValues: { ids, updates },
        level: AuditLevel.INFO,
      },
    );

    return { message: `Updated ${ids.length} examples` };
  }

  // Example 6: Export operations
  @Get('export')
  async export(@Request() req: any) {
    // Log export operation
    await this.auditService.log(
      AuditAction.EXPORT,
      'Example',
      'Exported examples data',
      {
        userId: req.user?.id,
        userName: req.user?.name,
        userEmail: req.user?.email,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        sessionId: req.sessionID,
        metadata: {
          controller: 'ExampleController',
          method: 'export',
          exportFormat: 'csv',
        },
        tags: ['example', 'export'],
      },
      {
        level: AuditLevel.INFO,
      },
    );

    return { message: 'Export completed' };
  }
}

/**
 * Example service showing how to use audit logging in service methods
 */
export class ExampleService {
  constructor(private readonly auditService: AuditService) {}

  async createExample(data: any, context: any) {
    // Log before creation
    await this.auditService.log(
      AuditAction.CREATE,
      'Example',
      'Creating example in service',
      { ...context, tags: ['service', 'create'] },
      {
        newValues: data,
        level: AuditLevel.INFO,
      },
    );

    // Your business logic here
    const created = { id: 1, ...data };

    return created;
  }

  async updateExample(id: string, oldData: any, newData: any, context: any) {
    // Log the update
    await this.auditService.logUpdate('Example', oldData, newData, context, id);

    // Your business logic here
    return { id, ...newData };
  }
}

/**
 * Example of how to configure audit logging in your application
 */
export const auditConfiguration = {
  // Global audit settings
  global: {
    enabled: true,
    logLevel: AuditLevel.INFO,
    includeRequest: true,
    includeResponse: false, // Be careful with large responses
    includeParams: true,
    includeQuery: true,
    includeBody: true,
  },

  // Entity-specific settings
  entities: {
    plans: {
      enabled: true,
      logLevel: AuditLevel.INFO,
      includeRequest: true,
      includeResponse: true,
      tags: ['plans', 'energy'],
    },
    users: {
      enabled: true,
      logLevel: AuditLevel.WARNING, // More sensitive
      includeRequest: false, // Don't log user data
      includeResponse: false,
      tags: ['users', 'sensitive'],
    },
  },

  // Retention settings
  retention: {
    defaultDays: 90,
    sensitiveDataDays: 365, // Keep sensitive data longer
    errorLogsDays: 180, // Keep error logs longer
  },

  // Export settings
  export: {
    maxRecords: 10000,
    allowedFormats: ['json', 'csv'],
    requireAuth: true,
  },
};
