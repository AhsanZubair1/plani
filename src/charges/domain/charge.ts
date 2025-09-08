export class Charge {
  charge_id: number;
  charge_code: string;
  charge_description: string;
  charge_amount: number;
  charge_perc: number;
  greenpower_perc: number;
  reference_01?: string;
  plan_id: number;
  charge_type_id: number;
  charge_category_id: number;
  charge_term_id: number;
  created_at: Date;
  updated_at: Date;
}
