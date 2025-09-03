import { RateClass } from '@src/rates/domain/rate-class';
import { RateClassEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-class.entity';

export class RateClassMapper {
  static toDomain(raw: RateClassEntity): RateClass {
    const domain = new RateClass();
    domain.rateClassId = raw.rate_class_id;
    domain.rateClassCode = raw.rate_class_code;
    domain.rateClassName = raw.rate_class_name;
    domain.validate24HourTiming = raw.validate_24_hour_timing;
    domain.multiplier = raw.multiplier;
    return domain;
  }

  static toPersistence(domain: RateClass): Partial<RateClassEntity> {
    const entity = new RateClassEntity();
    entity.rate_class_id = domain.rateClassId;
    entity.rate_class_code = domain.rateClassCode;
    entity.rate_class_name = domain.rateClassName;
    entity.validate_24_hour_timing = domain.validate24HourTiming;
    entity.multiplier = domain.multiplier;
    return entity;
  }
}
