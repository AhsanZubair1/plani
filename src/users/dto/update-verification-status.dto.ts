import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { AppUserVerificationStatus } from '@src/utils/enums/user-verification.enum';

export class UpdateUserDecisionDto {
  @ApiProperty({
    enum: AppUserVerificationStatus,
    description: 'Updated verification status of the user',
    example: AppUserVerificationStatus.RESUBMISSION,
    required: true,
  })
  @IsEnum(AppUserVerificationStatus)
  verificationStatus: AppUserVerificationStatus;

  @ApiProperty({
    type: String,
    description: 'Comma separated list of reasons',
    example: 'e4eaaaf2-d142-11e1-b3e4-080027620cdd',
    required: true,
  })
  @IsString()
  reasons: string;
}
