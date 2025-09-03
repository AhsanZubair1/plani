// sanitized-user.dto.ts
import { Expose, Type } from 'class-transformer';

export class PermissionDto {
  @Expose() id: string;
  @Expose() module: string;
  @Expose() action: string;
}

export class RoleDto {
  @Expose() name: string;
}

export class CategoryDto {
  @Expose() value: string;
}

export class SanitizedUserDto {
  @Expose() id: string;
  @Expose() email: string;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() phoneNumber: string;
  @Expose() accountStatus: string;
  @Expose() profilePicture: string;

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}
