import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ERROR_MESSAGES } from '@src/common/error-messages';
import { UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { AllConfigType } from '@src/config/config.type';
import { FileResponseDto } from '@src/files/infrastructure/uploader/s3/dto/file-response.dto';

@Injectable()
export class FilesS3Service {
  private s3: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private configService: ConfigService<AllConfigType>) {
    this.s3 = new S3Client({
      region: this.configService.get('file.awsS3Region', { infer: true }),
      credentials: {
        accessKeyId: this.configService.getOrThrow('file.accessKeyId', {
          infer: true,
        }),
        secretAccessKey: this.configService.getOrThrow('file.secretAccessKey', {
          infer: true,
        }),
      },
    });
  }

  async uploadFile(file: Express.Multer.File, type: string): Promise<string> {
    if (!file) {
      throw UNPROCESSABLE_ENTITY(ERROR_MESSAGES.NOT_PRESENT('file'), 'file');
    }

    if (!type) {
      throw UNPROCESSABLE_ENTITY(ERROR_MESSAGES.NOT_PRESENT('type'), 'type');
    }

    try {
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      const key = `${type}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

      // Upload file to S3 without ACL
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  async create(
    file: Express.MulterS3.File,
    type: string,
    assignUrl: string = 'false',
  ): Promise<FileResponseDto> {
    if (!file) {
      throw UNPROCESSABLE_ENTITY(ERROR_MESSAGES.NOT_PRESENT('file'), 'file');
    }

    if (!type) {
      throw UNPROCESSABLE_ENTITY(ERROR_MESSAGES.NOT_PRESENT('type'), 'type');
    }

    const contentType = file.mimetype;
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/avi'];

    if (![...allowedImageTypes, ...allowedVideoTypes].includes(contentType)) {
      throw UNPROCESSABLE_ENTITY(
        `Unsupported file type: ${contentType}`,
        'file',
      );
    }
    const key = file.key;
    const resp = {
      key,
      type: contentType.startsWith('image/') ? 'image' : 'video',
    };

    let uploadSignedUrl: string;

    try {
      if (assignUrl === 'true') {
        uploadSignedUrl = await this.getFileUrl(key);
        resp['uploadSignedUrl'] = uploadSignedUrl;
      }

      return resp;
    } catch (error) {
      console.error('Error processing file:', error);
      throw new InternalServerErrorException('Failed to process file');
    }
  }
  getFileUrl(key: string): Promise<string> {
    const bucket = this.configService.getOrThrow('file.awsDefaultS3Bucket', {
      infer: true,
    });

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn: 300000 });
  }
  private isVideoFile(contentType: string, extension?: string) {
    const videoContentTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/webm',
      'video/ogg',
      'video/x-matroska',
      'video/mpeg',
    ];

    const videoExtensions = [
      'mp4',
      'mov',
      'avi',
      'webm',
      'ogv',
      'mkv',
      'mpg',
      'mpeg',
      'm4v',
      '3gp',
    ];

    return (
      videoContentTypes.includes(contentType) ||
      (extension && videoExtensions.includes(extension))
    );
  }
}
