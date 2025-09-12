import { DataSource } from 'typeorm';

import { BillingCode } from '@src/plans/infrastructure/persistence/relational/entities/billing-code.entity';

export async function seedBillingCodes(dataSource: DataSource): Promise<void> {
  const billingCodeRepository = dataSource.getRepository(BillingCode);

  const billingCodes = [
    {
      billing_code_id: 1,
      billing_code: 'EVRMAY2025MR',
      billing_code_type_id: 1,
      plan_id: 2,
    },
    {
      billing_code_id: 2,
      billing_code: 'ABCD123',
      billing_code_type_id: 2,
      plan_id: 2,
    },
    {
      billing_code_id: 3,
      billing_code: 'ZZZ334R',
      billing_code_type_id: 3,
      plan_id: 2,
    },
    {
      billing_code_id: 4,
      billing_code: 'EVRMAY2025MR',
      billing_code_type_id: 1,
      plan_id: 3,
    },
    {
      billing_code_id: 5,
      billing_code: 'ABCD123',
      billing_code_type_id: 2,
      plan_id: 3,
    },
    {
      billing_code_id: 6,
      billing_code: 'ZZZ334R',
      billing_code_type_id: 3,
      plan_id: 3,
    },
  ];

  for (const billingCodeData of billingCodes) {
    const existingBillingCode = await billingCodeRepository.findOne({
      where: { billing_code_id: billingCodeData.billing_code_id },
    });

    if (!existingBillingCode) {
      const billingCode = billingCodeRepository.create(billingCodeData);
      await billingCodeRepository.save(billingCode);
      console.log(
        `Created billing code: ${billingCodeData.billing_code} for plan ${billingCodeData.plan_id}`,
      );
    } else {
      console.log(
        `Billing code already exists: ${billingCodeData.billing_code}`,
      );
    }
  }
}
