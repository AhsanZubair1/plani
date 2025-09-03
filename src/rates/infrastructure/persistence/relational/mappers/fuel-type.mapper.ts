import { FuelType } from '@src/rates/domain/fuel-type';
import { FuelTypeEntity } from '@src/rates/infrastructure/persistence/relational/entities/fuel-type.entity';

export class FuelTypeMapper {
  static toDomain(raw: FuelTypeEntity): FuelType {
    const domain = new FuelType();
    domain.fuelTypeId = raw.fuel_type_id;
    domain.fuelTypeCode = raw.fuel_type_code;
    domain.fuelTypeName = raw.fuel_type_name;
    return domain;
  }

  static toPersistence(domain: FuelType): Partial<FuelTypeEntity> {
    const entity = new FuelTypeEntity();
    entity.fuel_type_id = domain.fuelTypeId;
    entity.fuel_type_code = domain.fuelTypeCode;
    entity.fuel_type_name = domain.fuelTypeName;
    return entity;
  }
}
