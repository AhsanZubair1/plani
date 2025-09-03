import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'adnanhussin@gmail.com',
    description: 'Email address',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'WhatsApp',
    description: 'Preferred communication method',
    required: false,
    enum: ['WhatsApp', 'SMS'],
  })
  @IsString()
  @IsOptional()
  preferredCommunicationMethod?: string;

  @ApiProperty({
    example: 'profile-images/user-12345-abcdef.jpg',
    description: 'S3 key for profile image',
    required: false,
  })
  @IsString()
  @IsOptional()
  profileImageS3Key?: string;
}
