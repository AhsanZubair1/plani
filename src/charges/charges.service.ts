import { Injectable } from '@nestjs/common';

import { ChargeAbstractRepository } from './infrastructure/persistence/charge.abstract.repository';
import { Charge } from './domain/charge';

@Injectable()
export class ChargesService {
  constructor(private readonly chargesRepository: ChargeAbstractRepository) {}

  async findAll(): Promise<Charge[]> {
    return this.chargesRepository.findMany();
  }

  async findOne(id: number): Promise<Charge | null> {
    return this.chargesRepository.findById(id);
  }

  async findByPlan(planId: number): Promise<Charge[]> {
    return this.chargesRepository.findByPlan(planId);
  }
}
