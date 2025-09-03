import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty({ type: String, example: 'https://example.com/profile.jpg' })
  profilePicture: string | null;

  @ApiProperty({ type: String, example: 'John' })
  firstName: string;

  @ApiProperty({ type: String, example: 'Doe' })
  lastName: string;

  @ApiProperty({ type: String, example: '+1234567890' })
  phoneNumber: string;
}
