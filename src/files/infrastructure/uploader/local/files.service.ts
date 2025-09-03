import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ERROR_MESSAGES } from '@src/common/error-messages';
import { UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { AllConfigType } from '@src/config/config.type';
import { FileType } from '@src/files/domain/file';
import { FileAbstractRepository } from '@src/files/infrastructure/persistence/file.abstract.repository';

@Injectable()
export class FilesLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileAbstractRepository,
  ) {}

  async create(
    file: Express.Multer.File,
    type: string, // Add type parameter
    userId: string, // Add userId parameter
  ): Promise<{ file: FileType }> {
    if (!file) {
      throw UNPROCESSABLE_ENTITY(ERROR_MESSAGES.NOT_PRESENT('file'), 'file');
    }

    if (!type) {
      throw UNPROCESSABLE_ENTITY(ERROR_MESSAGES.NOT_PRESENT('type'), 'type');
    }

    if (!userId) {
      throw UNPROCESSABLE_ENTITY(
        ERROR_MESSAGES.NOT_PRESENT('userId'),
        'userId',
      );
    }

    return {
      file: await this.fileRepository.create({
        path: `/${this.configService.get('app.apiPrefix', {
          infer: true,
        })}/v1/${file.path}`,
        type, // Pass type to the repository
        userId: userId, // Pass userId to the repository
      }),
    };
  }
}
