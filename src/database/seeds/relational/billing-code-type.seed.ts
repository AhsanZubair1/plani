import { DataSource } from 'typeorm';

import { BillingCodeType } from '@src/plans/infrastructure/persistence/relational/entities/billing-code-type.entity';

export async function seedBillingCodeTypes(
  dataSource: DataSource,
): Promise<void> {
  const billingCodeTypeRepository = dataSource.getRepository(BillingCodeType);

  const billingCodeTypes = [
    {
      billing_code_type_id: 1,
      billing_code_type: 'PRODUCT',
      billing_code_type_name: 'Product Code',
    },
    {
      billing_code_type_id: 2,
      billing_code_type: 'OFFERING',
      billing_code_type_name: 'Offering Code',
    },
    {
      billing_code_type_id: 3,
      billing_code_type: 'PRICING',
      billing_code_type_name: 'Pricing Tag',
    },
  ];

  for (const billingCodeTypeData of billingCodeTypes) {
    const existingBillingCodeType = await billingCodeTypeRepository.findOne({
      where: { billing_code_type_id: billingCodeTypeData.billing_code_type_id },
    });

    if (!existingBillingCodeType) {
      const billingCodeType =
        billingCodeTypeRepository.create(billingCodeTypeData);
      await billingCodeTypeRepository.save(billingCodeType);
      console.log(
        `Created billing code type: ${billingCodeTypeData.billing_code_type}`,
      );
    } else {
      console.log(
        `Billing code type already exists: ${billingCodeTypeData.billing_code_type}`,
      );
    }
  }
}
