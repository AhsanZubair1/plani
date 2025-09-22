import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class PlanCampaignFilterDto {
  @ApiPropertyOptional({
    description: 'Include expired campaigns in results',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showExpiredCampaigns?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum number of campaigns to show per plan',
    example: 5,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  campaignLimit?: number;
}
