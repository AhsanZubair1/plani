import { AuthConfig } from '@src/auth/config/auth-config.type';
import { DatabaseConfig } from '@src/database/config/database-config.type';

import { AppConfig } from './app-config.type';

export interface AllConfigType {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;

  file: {
    awsS3Region: string;
    accessKeyId: string;
    secretAccessKey: string;
    awsDefaultS3Bucket: string;
    maxFileSize: number;
  };
}
