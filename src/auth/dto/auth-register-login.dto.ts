import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';

import { UserCategory } from '@src/utils/enums/user-category.enum';
import { lowerCaseTransformer } from '@src/utils/transformers/lower-case.transformer';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'test1@example.com', nullable: true })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  password?: string;

  @ApiProperty({ example: '+923110357070' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: 'ABC123456', description: 'Encrypted MILITARY ID' })
  @ValidateIf((o) => o.userCategory === UserCategory.MILITARY)
  @IsString()
  @IsNotEmpty()
  militaryId?: string;

  @ApiProperty({
    example: '123456789012',
    description: 'MyKad ID (Malaysian identity card number)',
    required: false,
  })
  @ApiProperty({
    example: 'email',
    description: 'Preferred communication method (email, sms, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  preferredCommunicationMethod: string;

  @ApiProperty({ example: '+923110357070', required: false })
  @IsOptional()
  @IsPhoneNumber()
  secondaryPhone?: string;

  @ApiProperty({ example: 'Male', enum: ['Male', 'Female', 'Other'] })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ example: 'UUID', nullable: true })
  @ValidateIf((o) => o.userCategory === UserCategory.MILITARY)
  @IsString()
  @IsNotEmpty()
  baseCamp?: string | null;

  @ApiProperty({ example: 'UUID', nullable: true })
  @ValidateIf((o) => o.userCategory === UserCategory.MILITARY)
  @IsString()
  @IsNotEmpty()
  armedForceBranch?: string | null;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  biometricLogin?: boolean = false;

  @ApiProperty({ enum: UserCategory, description: 'User category' })
  @IsEnum(UserCategory)
  userCategory: UserCategory;

  @ApiPropertyOptional({
    type: String,
    description: 'MILITARY ID key',
    required: false,
  })
  @ValidateIf((o) => o.userCategory === UserCategory.MILITARY)
  @IsString()
  @IsNotEmpty()
  militaryIdKey?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Selfie ID key',
    required: false,
  })
  @ValidateIf((o) => o.userCategory === UserCategory.MILITARY)
  @IsString()
  @IsNotEmpty()
  selfieIdKey?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Verification token',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  verificationToken?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'URL or path to profile image',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  profileImage?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Referral code',
    example: 'REF123',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  referralCode?: string | null;

  @ApiPropertyOptional({
    type: Date,
    description: 'Date of birth',
    example: '1990-01-01',
    nullable: true,
  })
  @IsOptional()
  dateOfBirth?: Date | null;

  @ApiPropertyOptional({
    type: Date,
    description: 'Date of birth',
    example: '1990-01-01',
    nullable: true,
  })
  @IsNotEmpty()
  category: string;
}
