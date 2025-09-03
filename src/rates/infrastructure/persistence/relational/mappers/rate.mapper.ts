import { Rate } from '@src/rates/domain/rate';
import { RateEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate.entity';

export class RateMapper {
  static toDomain(raw: RateEntity): Rate {
    const domain = new Rate();
    domain.rateId = raw.rate_id;
    domain.rateCode = raw.rate_code;
    domain.rateName = raw.rate_name;
    domain.rateCategoryId = raw.rate_category_id;
    domain.rateCardId = raw.rate_card_id;
    return domain;
  }

  static toPersistence(domain: Rate): Partial<RateEntity> {
    const entity = new RateEntity();
    entity.rate_id = domain.rateId;
    entity.rate_code = domain.rateCode;
    entity.rate_name = domain.rateName;
    entity.rate_category_id = domain.rateCategoryId;
    entity.rate_card_id = domain.rateCardId;
    return entity;
  }
}
