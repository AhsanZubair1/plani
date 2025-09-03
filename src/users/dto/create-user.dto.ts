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
  ValidateIf,
} from 'class-validator';

import { GenderEnum } from '@src/utils/enums/gender.enum';
import { AppUserCategory } from '@src/utils/enums/user-category.enum';
import { lowerCaseTransformer } from '@src/utils/transformers/lower-case.transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com', nullable: true })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'HR,ADMIN' })
  @ValidateIf((o) => o.userCategory === AppUserCategory.MINDEF_EMPLOY)
  @IsString()
  @IsNotEmpty()
  organization: string;

  @ApiProperty()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ example: '+923110357070' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: 'ABC123456', description: 'Encrypted MILITARY ID' })
  @ValidateIf((o) => o.userCategory === AppUserCategory.MILITARY)
  @IsString()
  @IsNotEmpty()
  militaryId?: string;

  @ApiProperty({
    example: '123456789012',
    description: 'MyKad ID (Malaysian identity card number)',
    required: false,
  })
  @ValidateIf((o) => o.userCategory === AppUserCategory.MILITARY_FAMILY)
  @IsString()
  @IsNotEmpty()
  mykadId?: string;

  @ApiProperty({
    example: 'email',
    description: 'Preferred communication method (email, sms, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  preferredCommunicationMethod: string;

  @ApiProperty({ example: 'Male', enum: ['MALE', 'FEMALE', 'Other'] })
  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;

  @ApiProperty({ example: 'UUID', nullable: true })
  @ValidateIf(
    (o) =>
      o.userCategory === AppUserCategory.MILITARY ||
      o.userCategory === AppUserCategory.VETERANS,
  )
  @IsString()
  @IsNotEmpty()
  armedForceBranch?: string | null;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  biometricLogin?: boolean = false;

  @ApiProperty({ enum: AppUserCategory, description: 'User category' })
  @IsEnum(AppUserCategory)
  userCategory: AppUserCategory;

  @ApiPropertyOptional({
    type: String,
    description: 'MILITARY ID key',
    required: false,
  })
  @ValidateIf((o) => o.userCategory !== AppUserCategory.MILITARY_FAMILY)
  @IsString()
  @IsNotEmpty()
  idImageS3Key?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Selfie ID key',
    required: false,
  })
  @ValidateIf((o) => o.userCategory !== AppUserCategory.MILITARY_FAMILY)
  @IsString()
  @IsNotEmpty()
  selfieImageS3Key?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Referral code',
    example: 'REF123',
    nullable: true,
  })
  @ValidateIf((o) => o.userCategory === AppUserCategory.MILITARY_FAMILY)
  @IsNotEmpty()
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
    type: String,
    description: 'UUID',
    nullable: false,
  })
  @IsNotEmpty()
  category: string;
}
