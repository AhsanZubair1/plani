import { User } from '@src/users/domain/user';
import { UserProfileResponseDto } from '@src/users/dto/user-profile.dto';
import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
export abstract class UserAbstractRepository {
  abstract create(
    data: Omit<Partial<User>, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;

  abstract findByIdWithRelations(id: User['id']): Promise<NullableType<User>>;

  abstract findByEmail(email: User['email']): Promise<NullableType<User>>;

  abstract findByPhoneNumber(phoneNumber: string): Promise<NullableType<User>>;

  abstract update(id: User['id'], payload: DeepPartial<User>): Promise<User>;

  abstract softDelete(id: User['id']): Promise<void>;

  abstract restore(id: User['id']): Promise<void>;

  abstract permanentlyDelete(id: User['id']): Promise<void>;

  abstract getProfile(id: User['id']): Promise<UserProfileResponseDto>;
}
