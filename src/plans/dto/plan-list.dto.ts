import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PlanListDto {
  @ApiProperty({
    type: String,
    example: 'Residential Basic Plan',
    description: 'Plan Name',
  })
  @Expose()
  planName: string;

  @ApiProperty({
    type: String,
    example: 'RES001',
    description: 'Plan ID',
  })
  @Expose()
  planId: string;

  @ApiProperty({
    type: String,
    example: 'SR',
    description: 'Tariff',
  })
  @Expose()
  tariff: string;

  @ApiProperty({
    type: String,
    example: 'Market',
    description: 'Plan Type',
  })
  @Expose()
  planType: string;

  @ApiProperty({
    type: String,
    example: 'RES',
    description: 'Customer Type',
  })
  @Expose()
  customer: string;

  @ApiProperty({
    type: String,
    example: 'VIC',
    description: 'State',
  })
  @Expose()
  state: string;

  @ApiProperty({
    type: String,
    example: 'Citipower',
    description: 'Distributor',
  })
  @Expose()
  distributor: string;

  @ApiProperty({
    type: String,
    example: '12/12/2024',
    description: 'Effective till date',
  })
  @Expose()
  effectiveTill: string;
}
