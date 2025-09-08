import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChargeAbstractRepository } from '@src/charges/infrastructure/persistence/charge.abstract.repository';
import { Charge } from '@src/charges/domain/charge';
import { ChargeEntity } from '../entities/charge.entity';

@Injectable()
export class ChargeRepository extends ChargeAbstractRepository {
  constructor(
    @InjectRepository(ChargeEntity)
    private readonly chargesRepository: Repository<ChargeEntity>,
  ) {
    super();
  }

  async findMany(): Promise<Charge[]> {
    return this.chargesRepository.find();
  }

  async findById(id: number): Promise<Charge | null> {
    return this.chargesRepository.findOne({ where: { charge_id: id } });
  }

  async findByPlan(planId: number): Promise<Charge[]> {
    return this.chargesRepository.find({ where: { plan_id: planId } });
  }
}
