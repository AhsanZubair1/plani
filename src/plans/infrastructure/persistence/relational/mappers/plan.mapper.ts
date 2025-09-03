import { Plan } from '@src/plans/domain/plan';
import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';

export class PlanMapper {
  static toDomain(raw: PlanEntity): Plan {
    const domain = new Plan();
    domain.planId = raw.plan_id;
    domain.intPlanCode = raw.int_plan_code;
    domain.extPlanCode = raw.ext_plan_code;
    domain.planName = raw.plan_name;
    domain.effectiveFrom = raw.effective_from;
    domain.effectiveTo = raw.effective_to;
    domain.reviewDate = raw.review_date;
    domain.restricted = raw.restricted;
    domain.contingent = raw.contingent;
    domain.directDebitOnly = raw.direct_debit_only;
    domain.ebillingOnly = raw.ebilling_only;
    domain.solarCustOnly = raw.solar_cust_only;
    domain.evOnly = raw.ev_only;
    domain.instrinctGreen = raw.instrinct_green;
    domain.eligibilityCriteria = raw.eligibility_criteria;
    domain.priceVariationDetails = raw.price_variation_details;
    domain.termsAndConditions = raw.terms_and_conditions;
    domain.contractExpiryDetails = raw.contract_expiry_details;
    domain.fixedRates = raw.fixed_rates;
    domain.lowestRps = raw.lowest_rps;
    domain.zoneId = raw.zone_id;
    domain.planTypeId = raw.plan_type_id;
    domain.customerTypeId = raw.customer_type_id;
    domain.distributorId = raw.distributor_id;
    domain.rateCardId = raw.rate_card_id;
    domain.contractTermId = raw.contract_term_id;
    domain.billFreqId = raw.bill_freq_id;

    return domain;
  }

  static toPersistence(domain: Plan): Partial<PlanEntity> {
    const entity = new PlanEntity();
    entity.plan_id = domain.planId;
    entity.int_plan_code = domain.intPlanCode;
    entity.ext_plan_code = domain.extPlanCode;
    entity.plan_name = domain.planName;
    entity.effective_from = domain.effectiveFrom;
    entity.effective_to = domain.effectiveTo;
    entity.review_date = domain.reviewDate;
    entity.restricted = domain.restricted;
    entity.contingent = domain.contingent;
    entity.direct_debit_only = domain.directDebitOnly;
    entity.ebilling_only = domain.ebillingOnly;
    entity.solar_cust_only = domain.solarCustOnly;
    entity.ev_only = domain.evOnly;
    entity.instrinct_green = domain.instrinctGreen;
    entity.eligibility_criteria = domain.eligibilityCriteria;
    entity.price_variation_details = domain.priceVariationDetails;
    entity.terms_and_conditions = domain.termsAndConditions;
    entity.contract_expiry_details = domain.contractExpiryDetails;
    entity.fixed_rates = domain.fixedRates;
    entity.lowest_rps = domain.lowestRps;
    entity.zone_id = domain.zoneId;
    entity.plan_type_id = domain.planTypeId;
    entity.customer_type_id = domain.customerTypeId;
    entity.distributor_id = domain.distributorId;
    entity.rate_card_id = domain.rateCardId;
    entity.contract_term_id = domain.contractTermId;
    entity.bill_freq_id = domain.billFreqId;

    return entity;
  }
}
