import { Injectable } from '@nestjs/common';

import { RateTiming } from '@src/rates/domain/rate-timing';
import { RateTimingEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-timing.entity';

@Injectable()
export class RateTimingMapper {
  static toDomain(raw: RateTimingEntity): RateTiming {
    const domain = new RateTiming();
    domain.rateTimingId = raw.rate_timing_id;
    domain.planId = raw.plan_id;
    domain.timingName = raw.timing_name;
    domain.description = raw.description;
    domain.startTime = raw.start_time;
    domain.endTime = raw.end_time;
    domain.daysOfWeek = raw.days_of_week;
    domain.season = raw.season;
    domain.isActive = raw.is_active;
    domain.createdAt = raw.created_at;
    domain.updatedAt = raw.updated_at;

    return domain;
  }

  static toPersistence(domain: RateTiming): Partial<RateTimingEntity> {
    const entity = new RateTimingEntity();
    entity.rate_timing_id = domain.rateTimingId;
    entity.plan_id = domain.planId;
    entity.timing_name = domain.timingName;
    entity.description = domain.description || null;
    entity.start_time = domain.startTime;
    entity.end_time = domain.endTime;
    entity.days_of_week = domain.daysOfWeek;
    entity.season = domain.season;
    entity.is_active = domain.isActive;

    return entity;
  }
}
