import { RateCategory } from '@src/rates/domain/rate-category';
import { RateCategoryEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-category.entity';

export class RateCategoryMapper {
  static toDomain(raw: RateCategoryEntity): RateCategory {
    const domain = new RateCategory();
    domain.rateCategoryId = raw.rate_category_id;
    domain.rateCategoryCode = raw.rate_category_code;
    domain.rateCategoryName = raw.rate_category_name;
    domain.allowMultiSeasons = raw.allow_multi_seasons;
    return domain;
  }

  static toPersistence(domain: RateCategory): Partial<RateCategoryEntity> {
    const entity = new RateCategoryEntity();
    entity.rate_category_id = domain.rateCategoryId;
    entity.rate_category_code = domain.rateCategoryCode;
    entity.rate_category_name = domain.rateCategoryName;
    entity.allow_multi_seasons = domain.allowMultiSeasons;
    return entity;
  }
}
