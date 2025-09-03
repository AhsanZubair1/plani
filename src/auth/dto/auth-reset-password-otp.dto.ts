import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ResetPasswordOtpDto {
  @ApiProperty({ example: 'Abc@1a23', description: 'Current Password' })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'New@Pass1', description: 'New Password' })
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}
