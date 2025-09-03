import { ApiProperty } from '@nestjs/swagger';

export class retailTariffs {
  @ApiProperty({
    type: String,
  })
  id: number;

  // @custom-inject-point
  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
