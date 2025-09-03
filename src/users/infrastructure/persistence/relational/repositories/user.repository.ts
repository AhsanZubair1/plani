import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { User } from '@src/users/domain/user';
import { UserProfileResponseDto } from '@src/users/dto/user-profile.dto';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
import { UserMapper } from '@src/users/infrastructure/persistence/relational/mappers/user.mapper';
import { UserAbstractRepository } from '@src/users/infrastructure/persistence/user.abstract.repository';
import { NullableType } from '@src/utils/types/nullable.type';
@Injectable()
export class UsersRelationalRepository implements UserAbstractRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const newEntity = await this.usersRepository.save(
      this.usersRepository.create(persistenceModel),
    );
    return UserMapper.toDomain(newEntity);
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: { id },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByIdWithRelations(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: { id },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    if (!email) return null;

    const entity = await this.usersRepository.findOne({
      where: { email },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<NullableType<User>> {
    if (!phoneNumber) return null;

    const entity = await this.usersRepository.findOne({
      where: { phone_number: phoneNumber },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = await this.usersRepository.save(
      this.usersRepository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async restore(id: User['id']): Promise<void> {
    await this.usersRepository.restore(id);
  }

  async permanentlyDelete(id: User['id']): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getProfile(id: User['id']): Promise<UserProfileResponseDto> {
    const entity = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'profile_picture',
      ],
    });

    if (!entity) {
      throw new Error('User not found');
    }

    return UserMapper.toProfileDto(entity);
  }
}
