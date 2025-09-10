import { Injectable } from '@nestjs/common';

import {
  RateItem,
  RateItemTiming,
  RateItemBlock,
  RateItemDemand,
} from '@src/rates/domain/rate-item';
import { RateItemBlockEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-item-block.entity';
import { RateItemDemandEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-item-demand.entity';
import { RateItemTimingEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-item-timing.entity';
import { RateItemEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-item.entity';

@Injectable()
export class RateItemMapper {
  static toDomain(raw: RateItemEntity): RateItem {
    const domain = new RateItem();
    domain.rateItemId = raw.rate_item_id;
    domain.rateItemName = raw.rate_item_name;
    domain.rateItemDetails = raw.rate_item_details;
    domain.rateSeasonId = raw.rate_season_id;
    domain.rateTypeId = raw.rate_type_id;
    domain.ratePeriodId = raw.rate_period_id;
    domain.createdAt = raw.created_at;
    domain.updatedAt = raw.updated_at;

    if (raw.timings) {
      domain.timings = raw.timings.map((timing) => this.timingToDomain(timing));
    }

    if (raw.blocks) {
      domain.blocks = raw.blocks.map((block) => this.blockToDomain(block));
    }

    // if (raw.demand) {
    //   domain.demand = raw.demand
    // }

    return domain;
  }

  static timingToDomain(raw: RateItemTimingEntity): RateItemTiming {
    const domain = new RateItemTiming();
    domain.rateItemTimingId = raw.rate_item_timing_id;
    domain.timeBandStart = raw.time_band_start;
    domain.timeBandEnd = raw.time_band_end;
    domain.weekdays = raw.weekdays;
    domain.weekendSat = raw.weekend_sat;
    domain.weekendSun = raw.weekend_sun;
    domain.rateItemId = raw.rate_item_id;
    domain.createdAt = raw.created_at;
    domain.updatedAt = raw.updated_at;
    return domain;
  }

  static blockToDomain(raw: RateItemBlockEntity): RateItemBlock {
    const domain = new RateItemBlock();
    domain.rateItemBlockId = raw.rate_item_block_id;
    domain.blockNumber = raw.block_number;
    domain.blockConsumption = raw.block_consumption;
    domain.blockRate = raw.block_rate;
    domain.rateItemId = raw.rate_item_id;
    domain.createdAt = raw.created_at;
    domain.updatedAt = raw.updated_at;
    return domain;
  }

  static demandToDomain(raw: RateItemDemandEntity): RateItemDemand {
    const domain = new RateItemDemand();
    domain.rateItemDemandId = raw.rate_item_demand_id;
    domain.minKw = raw.min_kw;
    domain.maxKw = raw.max_kw;
    domain.charge = raw.charge;
    domain.rateItemId = raw.rate_item_id;
    domain.measurementPeriodId = raw.measurement_period_id;
    domain.createdAt = raw.created_at;
    domain.updatedAt = raw.updated_at;
    return domain;
  }

  static toPersistence(domain: RateItem): Partial<RateItemEntity> {
    const entity = new RateItemEntity();
    entity.rate_item_id = domain.rateItemId;
    entity.rate_item_name = domain.rateItemName;
    entity.rate_item_details = domain.rateItemDetails || null;
    entity.rate_season_id = domain.rateSeasonId;
    entity.rate_type_id = domain.rateTypeId;
    entity.rate_period_id = domain.ratePeriodId;
    return entity;
  }
}
