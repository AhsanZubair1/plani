import { RateSeason } from '@src/rates/domain/rate-season';
import { RateSeasonEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-season.entity';

export class RateSeasonMapper {
  static toDomain(raw: RateSeasonEntity): RateSeason {
    const domain = new RateSeason();
    domain.rateSeasonId = raw.rate_season_id;
    domain.seasonCode = raw.season_code;
    domain.seasonName = raw.season_name;
    domain.effectiveFrom = raw.effective_from;
    domain.effectiveTo = raw.effective_to;
    domain.dailyCharge = raw.daily_charge;
    domain.rateId = raw.rate_id;
    return domain;
  }

  static toPersistence(domain: RateSeason): Partial<RateSeasonEntity> {
    const entity = new RateSeasonEntity();
    entity.rate_season_id = domain.rateSeasonId;
    entity.season_code = domain.seasonCode;
    entity.season_name = domain.seasonName;
    entity.effective_from = domain.effectiveFrom;
    entity.effective_to = domain.effectiveTo;
    entity.daily_charge = domain.dailyCharge;
    entity.rate_id = domain.rateId;
    return entity;
  }
}
