import { BillingCode } from '@src/billing/domain/billing-code';

export abstract class BillingCodeAbstractRepository {
  abstract findMany(): Promise<BillingCode[]>;
  abstract findById(id: number): Promise<BillingCode | null>;
  abstract findByPlan(planId: number): Promise<BillingCode[]>;
}
