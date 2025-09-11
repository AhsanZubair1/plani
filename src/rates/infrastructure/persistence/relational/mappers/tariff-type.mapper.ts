import { TariffType } from '@src/rates/domain/tariff-type';
import { TariffTypeEntity } from '@src/rates/infrastructure/persistence/relational/entities/tariff-type.entity';

export class TariffTypeMapper {
  static toDomain(raw: TariffTypeEntity): TariffType {
    const domain = new TariffType();
    domain.tariffTypeId = raw.tariff_type_id;
    domain.tariffTypeCode = raw.tariff_type_code;
    domain.tariffTypeName = raw.tariff_type_name;
    domain.fuelTypeId = raw.fuel_type_id;
    return domain;
  }

  static toPersistence(domain: TariffType): Partial<TariffTypeEntity> {
    const entity = new TariffTypeEntity();
    entity.tariff_type_id = domain.tariffTypeId;
    entity.tariff_type_code = domain.tariffTypeCode;
    entity.tariff_type_name = domain.tariffTypeName;
    entity.fuel_type_id = domain.fuelTypeId;
    return entity;
  }
}
