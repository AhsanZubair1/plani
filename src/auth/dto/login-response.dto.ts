import { ApiProperty } from '@nestjs/swagger';

import { SanitizedUserDto } from '@src/auth/dto/sanitized-user.dto';

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  token_expires: number;

  @ApiProperty({
    type: () => SanitizedUserDto,
  })
  user: SanitizedUserDto;
}
