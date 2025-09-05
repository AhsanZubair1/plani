import { Charge } from '@src/charges/domain/charge';

export abstract class ChargeAbstractRepository {
  abstract findMany(): Promise<Charge[]>;
  abstract findById(id: number): Promise<Charge | null>;
  abstract findByPlan(planId: number): Promise<Charge[]>;
}
