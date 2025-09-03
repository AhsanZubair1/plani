import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  IsDateString,
} from 'class-validator';

import { User } from '@src/users/domain/user';
import { AppUserVerificationStatus } from '@src/utils/enums/user-verification.enum';

export class SortUserDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof User;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryUserDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortUserDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortUserDto)
  sort?: SortUserDto[] | null;
}

export enum DateRangeEnum {
  TODAY = 'TODAY',
  THIS_WEEK = 'THIS_WEEK',
  CUSTOM = 'CUSTOM',
}

export class FindAppUsersQueryDto {
  @ApiPropertyOptional({ enum: AppUserVerificationStatus })
  @IsOptional()
  @IsEnum(AppUserVerificationStatus)
  verificationStatus?: AppUserVerificationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userCategory?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sort?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ enum: DateRangeEnum })
  @IsOptional()
  @IsEnum(DateRangeEnum)
  dateRange?: DateRangeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
export class FindApprovedUsersQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userCategory?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sort?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ enum: DateRangeEnum })
  @IsOptional()
  @IsEnum(DateRangeEnum)
  dateRange?: DateRangeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
