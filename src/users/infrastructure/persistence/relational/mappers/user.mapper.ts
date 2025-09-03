import { User } from '@src/users/domain/user';
import { UserProfileResponseDto } from '@src/users/dto/user-profile.dto';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.firstName = raw.first_name;
    domainEntity.lastName = raw.last_name;
    domainEntity.phoneNumber = raw.phone_number;
    domainEntity.lastLogin = raw.last_login;
    domainEntity.accountStatus = raw.account_status;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;
    domainEntity.profilePicture = raw.profile_picture;
    // if (raw.armed_force_branch) {
    //   domainEntity.armedForceBranch = AppArmedForceBranchMapper.toDomain(
    //     raw.armed_force_branch,
    //   );
    // }

    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
    const persistenceEntity = new UserEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.email = domainEntity.email;
    persistenceEntity.password = domainEntity.password;
    persistenceEntity.first_name = domainEntity.firstName;
    persistenceEntity.last_name = domainEntity.lastName;
    persistenceEntity.phone_number = domainEntity.phoneNumber;
    persistenceEntity.last_login = domainEntity.lastLogin;
    persistenceEntity.account_status = domainEntity.accountStatus;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;
    persistenceEntity.profile_picture = domainEntity.profilePicture;

    // if (domainEntity.armedForceBranch) {
    //   persistenceEntity.armed_force_branch =
    //     AppArmedForceBranchMapper.toPersistence(domainEntity.armedForceBranch);
    // }

    return persistenceEntity;
  }

  static toProfileDto(user: UserEntity): UserProfileResponseDto {
    return {
      profilePicture: user.profile_picture,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
    };
  }
}
