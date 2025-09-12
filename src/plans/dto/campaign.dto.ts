import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CampaignDto {
  @ApiProperty({
    type: String,
    example: 'Summer Campaign',
    description: 'Campaign name',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    example: 'ACTIVE',
    description: 'Campaign status',
  })
  @Expose()
  status: string;
}
