import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';
import { DataSource, DataSourceOptions } from 'typeorm';

import fileConfig from '@src/files/config/file.config';
import { FilesModule } from '@src/files/files.module';
import { HomeModule } from '@src/home/home.module';
import { networkTarrifsModule } from '@src/network-tarrifs/network-tarrifs.module';
import { retailTariffsModule } from '@src/retail-tariffs/retail-tariffs.module';

import { AuthModule } from './auth/auth.module';
import authConfig from './auth/config/auth.config';
import { BillingModule } from './billing/billing.module';
import { ChargesModule } from './charges/charges.module';
import appConfig from './config/app.config';
import { AllConfigType } from './config/config.type';
import databaseConfig from './database/config/database.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { LoggingModule } from './logging/logging.module';
import { PlansModule } from './plans/plans.module';
import { RatesModule } from './rates/rates.module';
import { SessionModule } from './session/session.module';
import { UsersModule } from './users/users.module';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

@Module({
  imports: [
    HomeModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({
                ttl: configService.get('app.cacheTtl', {
                  infer: true,
                }),
              }),
            }),
            createKeyv(
              configService.get('app.cacheHost', {
                infer: true,
              }),
            ),
          ],
        };
      },
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    // I18nModule.forRootAsync({
    //   useFactory: (configService: ConfigService<AllConfigType>) => ({
    //     fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
    //       infer: true,
    //     }),
    //     loaderOptions: { path: path.join(__dirname, '../i18n/'), watch: true },
    //   }),
    //   resolvers: [
    //     {
    //       use: HeaderResolver,
    //       useFactory: (configService: ConfigService<AllConfigType>) => {
    //         return [
    //           configService.get('app.headerLanguage', {
    //             infer: true,
    //           }),
    //         ];
    //       },
    //       inject: [ConfigService],
    //     },
    //   ],
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    // }),
    UsersModule,
    FilesModule,
    AuthModule,
    SessionModule,
    PlansModule,
    RatesModule,
    networkTarrifsModule,
    retailTariffsModule,
    ChargesModule,
    BillingModule,
    LoggingModule,
  ],
})
export class AppModule {}
