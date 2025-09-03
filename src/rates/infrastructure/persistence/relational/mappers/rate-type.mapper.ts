import { RateType } from '@src/rates/domain/rate-type';
import { RateTypeEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-type.entity';

export class RateTypeMapper {
  static toDomain(raw: RateTypeEntity): RateType {
    const domain = new RateType();
    domain.rateTypeId = raw.rate_type_id;
    domain.rateTypeCode = raw.rate_type_code;
    domain.rateTypeName = raw.rate_type_name;
    domain.hasTimings = raw.has_timings;
    domain.rateClassId = raw.rate_class_id;
    return domain;
  }

  static toPersistence(domain: RateType): Partial<RateTypeEntity> {
    const entity = new RateTypeEntity();
    entity.rate_type_id = domain.rateTypeId;
    entity.rate_type_code = domain.rateTypeCode;
    entity.rate_type_name = domain.rateTypeName;
    entity.has_timings = domain.hasTimings;
    entity.rate_class_id = domain.rateClassId;
    return entity;
  }
}
