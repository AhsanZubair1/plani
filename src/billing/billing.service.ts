import { Injectable } from '@nestjs/common';

import { BillingCodeAbstractRepository } from './infrastructure/persistence/billing-code.abstract.repository';
import { BillingCode } from './domain/billing-code';

@Injectable()
export class BillingService {
  constructor(
    private readonly billingCodeRepository: BillingCodeAbstractRepository,
  ) {}

  async findAll(): Promise<BillingCode[]> {
    return this.billingCodeRepository.findMany();
  }

  async findOne(id: number): Promise<BillingCode | null> {
    return this.billingCodeRepository.findById(id);
  }

  async findByPlan(planId: number): Promise<BillingCode[]> {
    return this.billingCodeRepository.findByPlan(planId);
  }
}
