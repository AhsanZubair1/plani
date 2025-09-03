import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  newPassword: string;
}
