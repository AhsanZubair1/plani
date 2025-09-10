import { Module } from '@nestjs/common';

import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LoggingController } from './logging.controller';
import { LoggingService } from './logging.service';
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
