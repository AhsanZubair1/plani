import { ApiProperty } from '@nestjs/swagger';

export class ExpirePlansResponseDto {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether the operation was successful',
  })
  success: boolean;

  @ApiProperty({
    type: String,
    example: 'Successfully expired 3 plan(s)',
    description: 'Success or error message',
  })
  message: string;

  @ApiProperty({
    type: Number,
    example: 3,
    description: 'Number of plans that were expired',
  })
  expiredCount: number;
}


