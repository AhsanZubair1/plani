import { ApiProperty } from '@nestjs/swagger';

export class PlanMappingStatusCountsDto {
  @ApiProperty({
    type: Number,
    example: 1323,
    description: 'Number of active plans',
  })
  active: number;

  @ApiProperty({
    type: Number,
    example: 4559,
    description: 'Number of expired plans',
  })
  expired: number;
}
