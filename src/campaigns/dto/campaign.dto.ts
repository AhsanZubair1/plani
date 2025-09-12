import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CampaignDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Campaign ID',
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: String,
    example: 'CAMP001',
    description: 'Campaign Code',
  })
  @Expose()
  campaignCode: string;

  @ApiProperty({
    type: String,
    example: 'Summer Energy Campaign',
    description: 'Campaign Name',
  })
  @Expose()
  campaignName: string;

  @ApiProperty({
    type: String,
    example: 'Promotional campaign for summer energy plans',
    description: 'Campaign Description',
    required: false,
  })
  @Expose()
  campaignDesc?: string;

  @ApiProperty({
    type: Date,
    example: '2024-01-01',
    description: 'Effective From Date',
  })
  @Expose()
  effectiveFrom: Date;

  @ApiProperty({
    type: Date,
    example: '2024-12-31',
    description: 'Effective To Date',
    required: false,
  })
  @Expose()
  effectiveTo?: Date;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Campaign Status ID',
  })
  @Expose()
  campaignStatusId: number;

  @ApiProperty({
    type: Object,
    description: 'Campaign Status Details',
    required: false,
  })
  @Expose()
  campaignStatus?: {
    id: number;
    campaignStatusCode: string;
    campaignStatusName: string;
  };

  @ApiProperty({
    type: Date,
    description: 'Created At',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Updated At',
  })
  @Expose()
  updatedAt: Date;
}
