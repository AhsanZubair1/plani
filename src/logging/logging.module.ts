import { Module } from '@nestjs/common';

import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LokiService } from './loki.service';

@Module({
  imports: [],
  controllers: [LoggingController],
  providers: [
    LokiService,
    LoggingService,
    LoggingInterceptor,
    {
      provide: 'LoggingService',
      useExisting: LoggingService,
    },
  ],
  exports: [LoggingService, LoggingInterceptor, 'LoggingService'],
})
export class LoggingModule {}
