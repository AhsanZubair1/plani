import { RateCard } from '@src/rates/domain/rate-card';
import { RateCardEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-card.entity';

export class RateCardMapper {
  static toDomain(raw: RateCardEntity): RateCard {
    const domain = new RateCard();
    domain.rateCardId = raw.rate_card_id;
    domain.rateCardName = raw.rate_card_name;
    domain.underlyingNtType = raw.underlying_nt_type;
    domain.tariffTypeId = raw.tariff_type_id;
    return domain;
  }

  static toPersistence(domain: RateCard): Partial<RateCardEntity> {
    const entity = new RateCardEntity();
    entity.rate_card_id = domain.rateCardId;
    entity.rate_card_name = domain.rateCardName;
    entity.underlying_nt_type = domain.underlyingNtType;
    entity.tariff_type_id = domain.tariffTypeId;
    return entity;
  }
}
