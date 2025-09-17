import { ApiProperty } from '@nestjs/swagger';

export class PlanMappingStatusCountsDto {
  @ApiProperty({
    type: Number,
    example: 1323,
    description: 'Number of ready plans',
  })
  ready: number;

  @ApiProperty({
    type: Number,
    example: 4559,
    description: 'Number of incomplete plans',
  })
  incomplete: number;

  @ApiProperty({
    type: Number,
    example: 4559,
    description: 'Number of expired plans',
  })
  expired: number;
}
