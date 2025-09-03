import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUserType } from '@src/auth/dto/auth-user.dto';
import { UpdateUserProfileDto } from '@src/users/dto/update-profile.dto';
import { UserProfileResponseDto } from '@src/users/dto/user-profile.dto';
import { UsersService } from '@src/users/users.service';
import { AuthUser } from '@src/utils/decorators/auth.decorator';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    // private readonly appUsersService: AppUsersService,
    // private readonly userDecisionService: UserDecisionService,
  ) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserProfileResponseDto,
    description: 'User profile retrieved successfully',
  })
  async getProfile(
    @AuthUser() user: AuthUserType,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.getProfile(user.id);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserProfileResponseDto,
    description: 'User profile updated successfully',
  })
  async updateProfile(
    @AuthUser() user: AuthUserType,
    @Body() updateProfileDto: UpdateUserProfileDto,
    @UploadedFile() file?: Express.MulterS3.File,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateProfile(user.id, updateProfileDto, file);
  }
}
