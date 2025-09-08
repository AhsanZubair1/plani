import { Module } from '@nestjs/common';

import { RelationalLogPersistenceModule } from './infrastructure/persistence/relational/relational-log-persistence.module';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [RelationalLogPersistenceModule],
  controllers: [LoggingController],
  providers: [
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
