import crypto from 'crypto';

import { Injectable, Logger } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import ms from 'ms';

import { AuthForgotPasswordDto } from '@src/auth/dto/auth-forgot-password.dto';
import { ResetPasswordOtpDto } from '@src/auth/dto/auth-reset-password-otp.dto';
import { AuthUserType } from '@src/auth/dto/auth-user.dto';
import { ERROR_MESSAGES } from '@src/common/error-messages';
import {
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from '@src/common/exceptions';
import { AllConfigType } from '@src/config/config.type';
import { Session } from '@src/session/domain/session';
import { SessionService } from '@src/session/session.service';
import { User } from '@src/users/domain/user';
import { UsersService } from '@src/users/users.service';
import { NullableType } from '@src/utils/types/nullable.type';

import { AuthProvidersEnum } from './auth-providers.enum';
import { AuthLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { SanitizedUserDto } from './dto/sanitized-user.dto';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name, { timestamp: true });
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async validateLogin(loginDto: AuthLoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw UNPROCESSABLE_ENTITY('error', 'erro');
    }
    if (!user.password) {
    }
    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isValidPassword) {
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,

      sessionId: session.id,
      hash,
    });

    const sanitizedUser = plainToInstance(SanitizedUserDto, user, {
      excludeExtraneousValues: true,
    });

    const userWithRoles = {
      ...sanitizedUser,
    };

    return {
      refresh_token: refreshToken,
      token,
      token_expires: tokenExpires,
      user: userWithRoles,
    };
  }

  async validateLoginWithBiometric(
    militaryId: string,
  ): Promise<LoginResponseDto> {
    const user = await this.findAndValidate('militaryId', militaryId);

    if (user.provider !== AuthProvidersEnum.militaryId) {
      throw UNPROCESSABLE_ENTITY(
        `needLoginViaProvider:${user.provider}`,
        'email',
      );
    }

    if (!user.password) {
      throw UNPROCESSABLE_ENTITY(
        ERROR_MESSAGES.NOT_PRESENT('password'),
        'password',
      );
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      sessionId: session.id,
      hash,
    });

    return {
      refresh_token: refreshToken,
      token,
      token_expires: tokenExpires,
      user,
    };
  }

  async resetPassword(
    dto: ResetPasswordOtpDto,
    authUser: AuthUserType,
  ): Promise<{ message: any }> {
    if (!authUser || !authUser.id) {
      throw new Error('User not found in request');
    }
    const user = (await this.usersService.findById(authUser.id)) as User;

    if (!user) {
      throw FORBIDDEN(ERROR_MESSAGES.NOT_PRESENT('user'), 'Id');
    }
    const isValidPassword = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw UNPROCESSABLE_ENTITY('message', 'currentPassword');
    }

    await this.usersService.update(user.id, { password: dto.newPassword });

    return { message: 'message' };
  }

  async confirmEmail(hash: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw UNPROCESSABLE_ENTITY(ERROR_MESSAGES.INCORRECT('hash'), 'hash');
    }

    const user = await this.usersService.findById(userId);
    if (user) await this.usersService.update(user.id, user);
  }

  async confirmNewEmail(hash: string): Promise<void> {
    let userId: User['id'];
    let newEmail: User['email'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
        newEmail: User['email'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
      newEmail = jwtData.newEmail;
    } catch {
      throw UNPROCESSABLE_ENTITY(ERROR_MESSAGES.INCORRECT('hash'), 'hash');
    }

    const user = (await this.usersService.findById(userId)) as User;

    user.email = newEmail;

    await this.usersService.update(user.id, user);
  }

  async forgotPassword(
    forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw UNPROCESSABLE_ENTITY('message', 'email');
    }

    user.password = forgotPasswordDto.password;
    await this.sessionService.deleteByUserId({
      userId: user.id,
    });
    await this.usersService.update(user.id, user);
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    if (!userJwtPayload || !userJwtPayload.id) {
      throw new Error('User not found in request');
    }

    const currentUser = (await this.usersService.findById(
      userJwtPayload.id,
    )) as User;

    if (userDto.password) {
      if (!userDto.oldPassword) {
        throw UNPROCESSABLE_ENTITY(
          ERROR_MESSAGES.NOT_PRESENT('oldPassword'),
          'oldPassword',
        );
      }

      if (!currentUser.password) {
        throw UNPROCESSABLE_ENTITY(
          ERROR_MESSAGES.NOT_PRESENT('password'),
          'password',
        );
      }

      const isValidOldPassword = await bcrypt.compare(
        userDto.oldPassword,
        currentUser.password,
      );

      if (!isValidOldPassword) {
        throw UNPROCESSABLE_ENTITY(
          ERROR_MESSAGES.INCORRECT('oldPassword'),
          'oldPassword',
        );
      } else {
        await this.sessionService.deleteByUserIdWithExclude({
          userId: currentUser.id,
          excludeSessionId: userJwtPayload.sessionId,
        });
      }
    }

    if (userDto.email && userDto.email !== currentUser.email) {
      const userByEmail = await this.usersService.findByEmail(userDto.email);

      if (userByEmail && userByEmail.id !== currentUser.id) {
        throw FORBIDDEN(ERROR_MESSAGES.ALREADY_EXISTS('email'), 'email');
      }

      await this.jwtService.signAsync(
        {
          confirmEmailUserId: currentUser.id,
          newEmail: userDto.email,
        },
        {
          secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
            infer: true,
          }),
        },
      );
    }

    delete userDto.email;
    delete userDto.oldPassword;

    await this.usersService.update(userJwtPayload.id, userDto);

    return this.usersService.findById(userJwtPayload.id);
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<Omit<LoginResponseDto, 'user'>> {
    const session = (await this.sessionService.findById(
      data.sessionId,
    )) as Session;

    if (session.hash !== data.hash) {
      throw UNAUTHORIZED('invalid session', 'session');
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await this.usersService.findById(session.user.id);

    // if (!user?.role) {
    //   throw UNAUTHORIZED('User not found with the valid role', 'role');
    // }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      sessionId: session.id,
      hash,
    });

    return {
      token,
      refresh_token: refreshToken,
      token_expires: tokenExpires,
    };
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.deleteById(data.sessionId);
  }

  private async getTokensData(data: {
    id: User['id'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const userServiceFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // captilize first letter of the field name
    if (typeof this.usersService[userServiceFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${userServiceFunction} not found on user service.`,
        field,
      );
    }

    const user = await this.usersService[userServiceFunction](value);
    if (!user) {
      throw NOT_FOUND('User', { [field]: value });
    }
    return user;
  }
}
