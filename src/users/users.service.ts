import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { ERROR_MESSAGES } from '@src/common/error-messages';
import {
  FORBIDDEN,
  NOT_FOUND,
  CustomException,
  BAD_REQUEST,
} from '@src/common/exceptions';
import { EventService } from '@src/event/event.service';
import { FilesS3Service } from '@src/files/infrastructure/uploader/s3/files.service';
import { UpdateUserProfileDto } from '@src/users/dto/update-profile.dto';
import { UserProfileResponseDto } from '@src/users/dto/user-profile.dto';
import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';

import { User } from './domain/user';
import { UserAbstractRepository } from './infrastructure/persistence/user.abstract.repository';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserAbstractRepository,
    private readonly filesService: FilesS3Service,
    private readonly eventService: EventService,
  ) {}

  async findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  async findByIdWithRelations(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findByIdWithRelations(id);
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<NullableType<User>> {
    return this.usersRepository.findByPhoneNumber(phoneNumber);
  }

  async update(id: User['id'], payload: DeepPartial<User>): Promise<User> {
    const clonedPayload = { ...payload };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userByEmail = await this.usersRepository.findByEmail(
        clonedPayload.email,
      );
      if (userByEmail && userByEmail.id !== id) {
        throw FORBIDDEN(ERROR_MESSAGES.ALREADY_EXISTS('email'), 'email');
      }
    }

    if (clonedPayload.phoneNumber) {
      const userByPhone = await this.usersRepository.findByPhoneNumber(
        clonedPayload.phoneNumber,
      );
      if (userByPhone && userByPhone.id !== id) {
        throw FORBIDDEN(
          ERROR_MESSAGES.ALREADY_EXISTS('phone number'),
          'phoneNumber',
        );
      }
    }

    return this.usersRepository.update(id, clonedPayload);
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async restore(id: User['id']): Promise<void> {
    await this.usersRepository.restore(id);
  }

  async permanentlyDelete(id: User['id']): Promise<void> {
    await this.usersRepository.permanentlyDelete(id);
  }

  async findAndValidate(
    field: keyof User,
    value: any,
    fetchRelations = false,
  ): Promise<User> {
    const user = fetchRelations
      ? await this.usersRepository.findByIdWithRelations(value)
      : await this.usersRepository.findById(value);

    if (!user) {
      throw NOT_FOUND('User', { [field]: value });
    }
    return user;
  }

  async getProfile(id: User['id']): Promise<UserProfileResponseDto> {
    return this.usersRepository.getProfile(id);
  }

  async updateProfile(
    id: User['id'],
    updateProfileDto: UpdateUserProfileDto,
    file?: Express.MulterS3.File,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw NOT_FOUND('User', { id });
    }

    let profilePictureUrl = user.profilePicture;
    if (file) {
      try {
        const uploadedFile = await this.filesService.create(
          file,
          'profile_picture',
          'true',
        );
        if (uploadedFile.uploadSignedUrl) {
          profilePictureUrl = uploadedFile.uploadSignedUrl;
        } else {
          throw CustomException('Profile Picture', 'message');
        }
      } catch (error) {
        throw BAD_REQUEST('message');
      }
    }

    const updateData: DeepPartial<User> = {
      firstName: updateProfileDto.firstName,
      lastName: updateProfileDto.lastName,
      profilePicture: profilePictureUrl,
      phoneNumber: updateProfileDto.phoneNumber,
    };

    await this.usersRepository.update(id, updateData);

    return await this.usersRepository.getProfile(id);
  }
}
