import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class User {
  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ type: String, example: 'john.doe@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ type: String })
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ type: String, example: 'John' })
  @Expose()
  firstName: string;

  @ApiProperty({ type: String, example: 'Doe' })
  @Expose()
  lastName: string;

  @ApiProperty({ type: String, example: '+60123456789' })
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @Expose()
  profilePicture: string | null;

  @Expose()
  accountStatus: string;

  @ApiProperty({
    type: String,
    example: 'Approved',
    enum: ['Pending', 'Approved', 'Rejected'],
  })
  @Expose()
  status: string;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  reason: string | null;

  @ApiProperty({ type: Date, nullable: true })
  @Expose()
  lastLogin: Date | null;

  @ApiProperty({ type: Date })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Expose()
  updatedAt: Date;
}
