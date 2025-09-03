import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFcmTokenDto {
  @ApiProperty({
    description: 'Firebase Cloud Messaging token',
    example: 'fcm_token_here',
  })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
