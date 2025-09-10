export class Charge {
  charge_id: number;
  charge_code: string;
  charge_description: string;
  charge_amount: number | null;
  charge_perc: number | null;
  greenpower_perc: number | null;
  reference_01?: string;
  plan_id: number;
  charge_type_id: number;
  charge_category_id: number;
  charge_term_id: number;
  created_at: Date;
  updated_at: Date;
}
