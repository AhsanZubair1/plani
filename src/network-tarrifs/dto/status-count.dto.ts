import { ApiProperty } from '@nestjs/swagger';

export class StatusCountNetworkTarrifsDto {
  @ApiProperty({
    type: Number,
    example: 1323,
    description: 'Number of active network tarrifs',
  })
  active: number;

  @ApiProperty({
    type: Number,
    example: 4559,
    description: 'Number of inactive network tarrifs',
  })
  inActive: number;

  // @ApiProperty({
  //   type: Boolean,
  //   example: true,
  //   description: 'all solar network tarrifs',
  // })
  // solar: Boolean;
}
