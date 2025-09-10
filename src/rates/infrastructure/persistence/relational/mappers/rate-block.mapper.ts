import { Injectable } from '@nestjs/common';

import { RateBlock } from '@src/rates/domain/rate-block';

import { RateBlockEntity } from '../entities/rate-block.entity';

@Injectable()
export class RateBlockMapper {
  static toDomain(raw: RateBlockEntity): RateBlock {
    const domain = new RateBlock();
    domain.rateBlockId = raw.rate_block_id;
    domain.planId = raw.plan_id;
    domain.rateBlockName = raw.rate_block_name;
    domain.description = raw.description;
    domain.startTime = raw.start_time;
    domain.endTime = raw.end_time;
    domain.daysOfWeek = raw.days_of_week;
    domain.ratePerKwh = raw.rate_per_kwh;
    domain.supplyChargePerDay = raw.supply_charge_per_day;
    domain.rateType = raw.rate_type;
    domain.season = raw.season;
    domain.effectiveFrom = raw.effective_from;
    domain.effectiveTo = raw.effective_to;
    domain.priority = raw.priority;
    domain.isActive = raw.is_active;
    domain.createdAt = raw.created_at;
    domain.updatedAt = raw.updated_at;

    return domain;
  }

  static toPersistence(domain: RateBlock): Partial<RateBlockEntity> {
    const entity = new RateBlockEntity();
    entity.rate_block_id = domain.rateBlockId;
    entity.plan_id = domain.planId;
    entity.rate_block_name = domain.rateBlockName;
    entity.description = domain.description || null;
    entity.start_time = domain.startTime;
    entity.end_time = domain.endTime;
    entity.days_of_week = domain.daysOfWeek;
    entity.rate_per_kwh = domain.ratePerKwh;
    entity.supply_charge_per_day = domain.supplyChargePerDay;
    entity.rate_type = domain.rateType;
    entity.season = domain.season;
    entity.effective_from = domain.effectiveFrom;
    entity.effective_to = domain.effectiveTo;
    entity.priority = domain.priority;
    entity.is_active = domain.isActive;

    return entity;
  }
}
