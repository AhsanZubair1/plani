import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { LoggingService } from './logging.service';
import { Log } from './domain/log';

@ApiTags('Logging')
@Controller({
  path: 'logs',
  version: '1',
})
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @Get()
  @ApiOperation({ summary: 'Get API logs with pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of logs to return (default: 100)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of logs to skip (default: 0)',
  })
  @ApiResponse({
    status: 200,
    description: 'Logs retrieved successfully',
    type: [Log],
  })
  async getLogs(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Log[]> {
    return this.loggingService.getLogs(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific log by ID' })
  @ApiResponse({
    status: 200,
    description: 'Log retrieved successfully',
    type: Log,
  })
  @ApiResponse({ status: 404, description: 'Log not found' })
  async getLogById(@Param('id', ParseIntPipe) id: number): Promise<Log | null> {
    return this.loggingService.getLogById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get logs by user ID' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of logs to return (default: 100)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of logs to skip (default: 0)',
  })
  @ApiResponse({
    status: 200,
    description: 'User logs retrieved successfully',
    type: [Log],
  })
  async getLogsByUserId(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Log[]> {
    return this.loggingService.getLogsByUserId(userId, limit, offset);
  }

  @Get('status/:statusCode')
  @ApiOperation({ summary: 'Get logs by status code' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of logs to return (default: 100)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of logs to skip (default: 0)',
  })
  @ApiResponse({
    status: 200,
    description: 'Status code logs retrieved successfully',
    type: [Log],
  })
  async getLogsByStatusCode(
    @Param('statusCode', ParseIntPipe) statusCode: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Log[]> {
    return this.loggingService.getLogsByStatusCode(statusCode, limit, offset);
  }
}
