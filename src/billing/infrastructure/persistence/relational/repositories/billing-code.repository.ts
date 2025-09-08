import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BillingCodeAbstractRepository } from '@src/billing/infrastructure/persistence/billing-code.abstract.repository';
import { BillingCode } from '@src/billing/domain/billing-code';
import { BillingCodeEntity } from '../entities/billing-code.entity';

@Injectable()
export class BillingCodeRepository extends BillingCodeAbstractRepository {
  constructor(
    @InjectRepository(BillingCodeEntity)
    private readonly billingCodesRepository: Repository<BillingCodeEntity>,
  ) {
    super();
  }

  async findMany(): Promise<BillingCode[]> {
    return this.billingCodesRepository.find();
  }

  async findById(id: number): Promise<BillingCode | null> {
    return this.billingCodesRepository.findOne({
      where: { billing_code_id: id },
    });
  }

  async findByPlan(planId: number): Promise<BillingCode[]> {
    return this.billingCodesRepository.find({ where: { plan_id: planId } });
  }
}
