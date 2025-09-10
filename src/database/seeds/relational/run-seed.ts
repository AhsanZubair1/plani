import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { AppModule } from '@src/app.module';

async function runSeeds() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🌱 Starting database seeding...');

    // Seed Fuel Types
    console.log('📊 Seeding Fuel Types...');
    await seedFuelTypes(dataSource);

    // Seed Tariff Types
    console.log('📊 Seeding Tariff Types...');
    await seedTariffTypes(dataSource);

    // Seed Rate Cards
    console.log('📊 Seeding Rate Cards...');
    await seedRateCards(dataSource);

    // Seed States
    console.log('📊 Seeding States...');
    await seedStates(dataSource);

    // Seed Distributors
    console.log('📊 Seeding Distributors...');
    await seedDistributors(dataSource);

    // Seed Customer Types
    console.log('📊 Seeding Customer Types...');
    await seedCustomerTypes(dataSource);

    // Seed Plan Types
    console.log('📊 Seeding Plan Types...');
    await seedPlanTypes(dataSource);

    // Seed Zones
    console.log('📊 Seeding Zones...');
    await seedZones(dataSource);

    // Seed Contract Terms
    console.log('📊 Seeding Contract Terms...');
    // await seedContractTerms(dataSource);

    // Seed Billing Frequencies
    console.log('📊 Seeding Billing Frequencies...');
    // await seedBillingFrequencies(dataSource); // Table doesn't exist

    // Seed Retail Tariffs
    console.log('📊 Seeding Retail Tariffs...');
    await seedRetailTariffs(dataSource);

    // Seed Plans
    console.log('📊 Seeding Plans...');
    await seedPlans(dataSource);

    // Seed Billing Code Types
    console.log('📊 Seeding Billing Code Types...');
    // await seedBillingCodeTypes(dataSource); // Table doesn't exist

    // Seed Charge Classes
    console.log('📊 Seeding Charge Classes...');
    await seedChargeClasses(dataSource);

    // Seed Charge Types
    console.log('📊 Seeding Charge Types...');
    await seedChargeTypes(dataSource);

    // Seed Charge Categories
    console.log('📊 Seeding Charge Categories...');
    await seedChargeCategories(dataSource);

    // Seed Charge Terms
    console.log('📊 Seeding Charge Terms...');
    await seedChargeTerms(dataSource);

    // Seed Billing Codes
    console.log('📊 Seeding Billing Codes...');
    // await seedBillingCodes(dataSource); // Table doesn't exist

    // Seed Charges
    console.log('📊 Seeding Charges...');
    await seedCharges(dataSource);

    // Seed Rate Seasons
    console.log('📊 Seeding Rate Seasons...');
    // await seedRateSeasons(dataSource); // Table exists but no data

    // Seed Rate Classes
    console.log('📊 Seeding Rate Classes...');
    await seedRateClasses(dataSource);

    // Seed Rate Types
    console.log('📊 Seeding Rate Types...');
    await seedRateTypes(dataSource);

    // Seed Rate Periods
    console.log('📊 Seeding Rate Periods...');
    await seedRatePeriods(dataSource);

    // Seed Rate Items
    console.log('📊 Seeding Rate Items...');
    // await seedRateItems(dataSource); // Depends on rate_seasons which has no data

    // Seed Rate Item Timings
    console.log('📊 Seeding Rate Item Timings...');
    // await seedRateItemTimings(dataSource); // Depends on rate_items

    // Seed Rate Item Blocks
    console.log('📊 Seeding Rate Item Blocks...');
    // await seedRateItemBlocks(dataSource); // Depends on rate_items

    // Seed Rate Item Demands
    console.log('📊 Seeding Rate Item Demands...');
    // await seedRateItemDemands(dataSource); // Depends on rate_items

    // Seed Rate Blocks (Legacy)
    console.log('📊 Seeding Rate Blocks...');
    // await seedRateBlocks(dataSource); // Depends on rate_items

    // Seed Rate Timings (Legacy)
    console.log('📊 Seeding Rate Timings...');
    // await seedRateTimings(dataSource); // Depends on rate_items

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await app.close();
  }
}

async function seedFuelTypes(dataSource: DataSource) {
  const fuelTypes = [
    { fuel_type_code: 'ELEC', fuel_type_name: 'Electricity' },
    { fuel_type_code: 'GAS', fuel_type_name: 'Gas' },
  ];

  for (const fuelType of fuelTypes) {
    const existing = await dataSource.query(
      'SELECT * FROM fuel_types WHERE fuel_type_code = $1',
      [fuelType.fuel_type_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO fuel_types (fuel_type_code, fuel_type_name, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())',
        [fuelType.fuel_type_code, fuelType.fuel_type_name],
      );
      console.log(`  ✓ Created fuel type: ${fuelType.fuel_type_name}`);
    } else {
      console.log(`  - Fuel type already exists: ${fuelType.fuel_type_name}`);
    }
  }
}

async function seedTariffTypes(dataSource: DataSource) {
  const tariffTypes = [
    {
      tariff_type_code: 'SR',
      tariff_type_name: 'Single Rate',
      fuel_type_id: 1,
    },
    {
      tariff_type_code: 'TOU',
      tariff_type_name: 'Time of Use',
      fuel_type_id: 1,
    },
    {
      tariff_type_code: 'FLEX',
      tariff_type_name: 'Flexible Pricing',
      fuel_type_id: 1,
    },
    {
      tariff_type_code: 'GAS',
      tariff_type_name: 'Gas',
      fuel_type_id: 2,
    },
  ];

  for (const tariffType of tariffTypes) {
    const existing = await dataSource.query(
      'SELECT * FROM tariff_types WHERE tariff_type_code = $1',
      [tariffType.tariff_type_code],
    );

    if (existing.length === 0) {
      const result = await dataSource.query(
        'INSERT INTO tariff_types (tariff_type_code, tariff_type_name, fuel_type_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING tariff_type_id',
        [
          tariffType.tariff_type_code,
          tariffType.tariff_type_name,
          tariffType.fuel_type_id,
        ],
      );
      console.log(
        `  ✓ Created tariff type: ${tariffType.tariff_type_name} with ID: ${result[0].tariff_type_id}`,
      );
    } else {
      console.log(
        `  - Tariff type already exists: ${tariffType.tariff_type_name} with ID: ${existing[0].tariff_type_id}`,
      );
    }
  }
}

async function seedRateCards(dataSource: DataSource) {
  const rateCards = [
    {
      rate_card_name: 'TRU556579SR_RC',
      underlying_nt_type: 'Time Varying',
      time_definition: null,
      tariff_type_code: 'SR',
    },
    {
      rate_card_name: 'TRU566093MR_RC',
      underlying_nt_type: 'Time Varying',
      time_definition: null,
      tariff_type_code: 'SR',
    },
    {
      rate_card_name: 'TRU566094MR_RC',
      underlying_nt_type: 'Time Varying',
      time_definition: null,
      tariff_type_code: 'SR',
    },
    {
      rate_card_name: 'TRU556433MR_RC',
      underlying_nt_type: 'Time Varying',
      time_definition: null,
      tariff_type_code: 'TOU',
    },
    {
      rate_card_name: 'TRU556443SR_RC',
      underlying_nt_type: 'Time Varying',
      time_definition: null,
      tariff_type_code: 'TOU',
    },
    {
      rate_card_name: 'TRU567149SR_RC',
      underlying_nt_type: null,
      time_definition: null,
      tariff_type_code: 'GAS',
    },
    {
      rate_card_name: 'TRU567144MR_RC',
      underlying_nt_type: null,
      time_definition: null,
      tariff_type_code: 'GAS',
    },
  ];

  for (const rateCard of rateCards) {
    const existing = await dataSource.query(
      'SELECT * FROM rate_cards WHERE rate_card_name = $1',
      [rateCard.rate_card_name],
    );

    if (existing.length === 0) {
      // Get the tariff_type_id by code
      const tariffType = await dataSource.query(
        'SELECT tariff_type_id FROM tariff_types WHERE tariff_type_code = $1',
        [rateCard.tariff_type_code],
      );

      if (tariffType.length === 0) {
        console.log(
          `  ❌ Tariff type code ${rateCard.tariff_type_code} does not exist for rate card: ${rateCard.rate_card_name}`,
        );
        continue;
      }

      const tariffTypeId = tariffType[0].tariff_type_id;

      await dataSource.query(
        'INSERT INTO rate_cards (rate_card_name, underlying_nt_type, tariff_type_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
        [rateCard.rate_card_name, rateCard.underlying_nt_type, tariffTypeId],
      );
      console.log(
        `  ✓ Created rate card: ${rateCard.rate_card_name} with tariff_type_code: ${rateCard.tariff_type_code} (ID: ${tariffTypeId})`,
      );
    } else {
      console.log(`  - Rate card already exists: ${rateCard.rate_card_name}`);
    }
  }
}

async function seedStates(dataSource: DataSource) {
  const states = [
    { state_code: 'NT', state_name: 'Northern Territory' },
    { state_code: 'NSW', state_name: 'New South Wales' },
    { state_code: 'QLD', state_name: 'Queensland' },
    { state_code: 'SA', state_name: 'South Australia' },
    { state_code: 'TAS', state_name: 'Tasmania' },
    { state_code: 'WA', state_name: 'Western Australia' },
    { state_code: 'VIC', state_name: 'Victoria' },
  ];

  for (const state of states) {
    const existing = await dataSource.query(
      'SELECT * FROM state WHERE state_code = $1',
      [state.state_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO state (state_code, state_name) VALUES ($1, $2)',
        [state.state_code, state.state_name],
      );
      console.log(`  ✓ Created state: ${state.state_name}`);
    } else {
      console.log(`  - State already exists: ${state.state_name}`);
    }
  }
}

async function seedDistributors(dataSource: DataSource) {
  const distributors = [
    {
      distributor_code: 'PWC',
      distributor_name: 'Power and Water Corporation',
      mirn_prefix: null,
      state_id: 1,
    },
    {
      distributor_code: 'AUSGRID',
      distributor_name: 'Ausgrid',
      mirn_prefix: null,
      state_id: 2,
    },
    {
      distributor_code: 'ENDEAVOUR',
      distributor_name: 'Endeavour Energy',
      mirn_prefix: null,
      state_id: 2,
    },
    {
      distributor_code: 'ERGON',
      distributor_name: 'Ergon Energy',
      mirn_prefix: null,
      state_id: 3,
    },
    {
      distributor_code: 'ENERGEX',
      distributor_name: 'Energex',
      mirn_prefix: null,
      state_id: 4,
    },
    {
      distributor_code: 'SA_POWER',
      distributor_name: 'SA Power Networks',
      mirn_prefix: null,
      state_id: 4,
    },
    {
      distributor_code: 'AURORA',
      distributor_name: 'Aurora Energy',
      mirn_prefix: null,
      state_id: 5,
    },
    {
      distributor_code: 'WESTERN',
      distributor_name: 'Western Power',
      mirn_prefix: null,
      state_id: 6,
    },
    {
      distributor_code: 'CITIPOWER',
      distributor_name: 'CitiPower',
      mirn_prefix: null,
      state_id: 7,
    },
    {
      distributor_code: 'JEMENA',
      distributor_name: 'Jemena',
      mirn_prefix: null,
      state_id: 7,
    },
    {
      distributor_code: 'POWERCOR',
      distributor_name: 'Powercor',
      mirn_prefix: null,
      state_id: 7,
    },
    {
      distributor_code: 'UNITED',
      distributor_name: 'United Energy',
      mirn_prefix: null,
      state_id: 7,
    },
    {
      distributor_code: 'AUSNET',
      distributor_name: 'Ausnet',
      mirn_prefix: null,
      state_id: 7,
    },
    {
      distributor_code: 'AGN',
      distributor_name: 'Australian Gas Networks',
      mirn_prefix: '532',
      state_id: 4,
    },
    {
      distributor_code: 'MULTI',
      distributor_name: 'Multinet',
      mirn_prefix: '531',
      state_id: 7,
    },
    {
      distributor_code: 'AUSNET_GAS',
      distributor_name: 'Ausnet Services',
      mirn_prefix: '533',
      state_id: 7,
    },
  ];

  for (const distributor of distributors) {
    const existing = await dataSource.query(
      'SELECT * FROM distributors WHERE distributor_code = $1',
      [distributor.distributor_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO distributors (distributor_code, distributor_name, mirn_prefix, state_id) VALUES ($1, $2, $3, $4)',
        [
          distributor.distributor_code,
          distributor.distributor_name,
          distributor.mirn_prefix,
          distributor.state_id,
        ],
      );
      console.log(`  ✓ Created distributor: ${distributor.distributor_name}`);
    } else {
      console.log(
        `  - Distributor already exists: ${distributor.distributor_name}`,
      );
    }
  }
}

async function seedCustomerTypes(dataSource: DataSource) {
  const customerTypes = [
    { customer_type_code: 'RESI', customer_type_name: 'Residential' },
    { customer_type_code: 'BUS', customer_type_name: 'Business' },
  ];

  for (const customerType of customerTypes) {
    const existing = await dataSource.query(
      'SELECT * FROM customer_types WHERE customer_type_code = $1',
      [customerType.customer_type_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO customer_types (customer_type_code, customer_type_name) VALUES ($1, $2)',
        [customerType.customer_type_code, customerType.customer_type_name],
      );
      console.log(
        `  ✓ Created customer type: ${customerType.customer_type_name}`,
      );
    } else {
      console.log(
        `  - Customer type already exists: ${customerType.customer_type_name}`,
      );
    }
  }
}

async function seedPlanTypes(dataSource: DataSource) {
  const planTypes = [
    { plan_type_code: 'STANDING', plan_type_name: 'Standing Offer' },
    { plan_type_code: 'MARKET', plan_type_name: 'Market Offer' },
  ];

  for (const planType of planTypes) {
    const existing = await dataSource.query(
      'SELECT * FROM plan_types WHERE plan_type_code = $1',
      [planType.plan_type_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO plan_types (plan_type_code, plan_type_name) VALUES ($1, $2)',
        [planType.plan_type_code, planType.plan_type_name],
      );
      console.log(`  ✓ Created plan type: ${planType.plan_type_name}`);
    } else {
      console.log(`  - Plan type already exists: ${planType.plan_type_name}`);
    }
  }
}

async function seedZones(dataSource: DataSource) {
  const zones = [
    {
      zone_code: 'ENV_CEN_1',
      zone_name: 'Envestra Central 1',
      supply_areas: null,
    },
    {
      zone_code: 'MAIN_2',
      zone_name: 'Main 2',
      supply_areas: null,
    },
  ];

  for (const zone of zones) {
    const existing = await dataSource.query(
      'SELECT * FROM zones WHERE zone_code = $1',
      [zone.zone_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO zones (zone_code, zone_name, supply_areas) VALUES ($1, $2, $3)',
        [zone.zone_code, zone.zone_name, zone.supply_areas],
      );
      console.log(`  ✓ Created zone: ${zone.zone_name}`);
    } else {
      console.log(`  - Zone already exists: ${zone.zone_name}`);
    }
  }
}

/*
async function seedContractTerms(dataSource: DataSource) {
  const contractTerms = [
    { contract_term_code: 'NA', contract_term_name: 'None' },
    { contract_term_code: 'Y1', contract_term_name: '1 Year' },
    { contract_term_code: 'Y2', contract_term_name: '2 Year' },
    { contract_term_code: 'Y3', contract_term_name: '3 Year' },
    { contract_term_code: 'Y4', contract_term_name: '4 Year' },
    { contract_term_code: 'Y5', contract_term_name: '5 Year' },
    { contract_term_code: 'OTHER', contract_term_name: 'Other' },
  ];

  for (const contractTerm of contractTerms) {
    const existing = await dataSource.query(
      'SELECT * FROM contract_terms WHERE contract_term_code = $1',
      [contractTerm.contract_term_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO contract_terms (contract_term_code, contract_term_name, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())',
        [contractTerm.contract_term_code, contractTerm.contract_term_name],
      );
      console.log(
        `  ✓ Created contract term: ${contractTerm.contract_term_name}`,
      );
    } else {
      console.log(
        `  - Contract term already exists: ${contractTerm.contract_term_name}`,
      );
    }
  }
}
*/

async function seedBillingFrequencies(dataSource: DataSource) {
  const billingFrequencies = [
    { frequency_code: 'M1', frequency_name: '1 month' },
    { frequency_code: 'M2', frequency_name: '2 months' },
    { frequency_code: 'M3', frequency_name: '3 months' },
    { frequency_code: 'M4', frequency_name: '4 months' },
    { frequency_code: 'M5', frequency_name: '5 months' },
  ];

  for (const freq of billingFrequencies) {
    const existing = await dataSource.query(
      'SELECT * FROM billing_frequencies WHERE frequency_code = $1',
      [freq.frequency_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO billing_frequencies (frequency_code, frequency_name, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())',
        [freq.frequency_code, freq.frequency_name],
      );
      console.log(`  ✓ Created billing frequency: ${freq.frequency_name}`);
    } else {
      console.log(
        `  - Billing frequency already exists: ${freq.frequency_name}`,
      );
    }
  }
}

async function seedRetailTariffs(dataSource: DataSource) {
  const retailTariffs = [
    {
      retail_tariff_code: 'PEAK',
      retail_tariff_name: 'Peak 1',
      sacl_flag: false,
      active: true,
      distributor_id: 9,
      customer_type_id: 1,
    },
    {
      retail_tariff_code: 'SR_CL',
      retail_tariff_name: 'Single Rate with Controlled Load 1',
      sacl_flag: false,
      active: true,
      distributor_id: 9,
      customer_type_id: 1,
    },
    {
      retail_tariff_code: 'SA_PEAK',
      retail_tariff_name: 'Peak Only',
      sacl_flag: false,
      active: true,
      distributor_id: 6,
      customer_type_id: 1,
    },
    {
      retail_tariff_code: 'SA_PEAK_CL',
      retail_tariff_name: 'Peak with Controlled Load 1',
      sacl_flag: true,
      active: true,
      distributor_id: 6,
      customer_type_id: 1,
    },
  ];

  for (const tariff of retailTariffs) {
    const existing = await dataSource.query(
      'SELECT * FROM retail_tariffs WHERE retail_tariff_name = $1',
      [tariff.retail_tariff_name],
    );

    if (existing.length === 0) {
      await dataSource.query(
        `INSERT INTO retail_tariffs (
          retail_tariff_code, retail_tariff_name, sacl_flag, active, distributor_id, 
          customer_type_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [
          tariff.retail_tariff_code,
          tariff.retail_tariff_name,
          tariff.sacl_flag,
          tariff.active,
          tariff.distributor_id,
          tariff.customer_type_id,
        ],
      );
      console.log(`  ✓ Created retail tariff: ${tariff.retail_tariff_name}`);
    } else {
      console.log(
        `  - Retail tariff already exists: ${tariff.retail_tariff_name}`,
      );
    }
  }
}

async function seedPlans(dataSource: DataSource) {
  const plans = [
    {
      int_plan_code: 'VE_3RD_UN_PDC',
      ext_plan_code: 'TRU566093MR',
      plan_name: 'Balance Plan - Peak Only - Third Party Offer',
      effective_from: '2025-07-01',
      effective_to: null,
      review_date: '2025-01-01',
      restricted: false,
      contingent: false,
      direct_debit_only: false,
      ebilling_only: false,
      solar_cust_only: false,
      ev_only: false,
      intrinsic_green: false,
      intrinsic_gpp: null,
      eligibility_criteria:
        'The details in this fact sheet are for residential customers located in the distribution area outlined with the meter configuration described. Offer only available through selected third party channels.',
      price_variation_details:
        'Prices may be varied in line with your terms and conditions. We will give you notice before any new prices take effect.',
      terms_and_conditions:
        'Please refer to our website www.energyaustralia.com.au for solar feed-in eligibility and full terms and conditions.',
      contract_expiry_details:
        'The Benefit Period for this plan is for 1 year. We will provide you with notice of your options prior to the end of the Benefit Period. Your contract will continue until it is ended by either party.',
      fixed_rates: '0',
      lowest_rps: 1328.92,
      factsheet_url:
        'Victorian_Energy_Fact_Sheet_TRU566093MR_Electricity_CZ_6.pdf',
      zone_id: null,
      plan_type_id: 2,
      customer_type_id: 1,
      distributor_id: 12,
      rate_card_id: 2,
      contract_term_id: 1,
      bill_freq_id: 3,
      retail_tariff_id: null,
    },
    {
      int_plan_code: 'VE_3RD_TR_PKO',
      ext_plan_code: 'TRU566094MR',
      plan_name: 'Balance Plan - Peak Only - Third Party Offer',
      effective_from: '2025-07-01',
      effective_to: null,
      review_date: '2025-01-01',
      restricted: false,
      contingent: false,
      direct_debit_only: false,
      ebilling_only: false,
      solar_cust_only: false,
      ev_only: false,
      intrinsic_green: false,
      intrinsic_gpp: null,
      eligibility_criteria:
        'The details in this fact sheet are for residential customers located in the distribution area outlined with the meter configuration described. Offer only available through selected third party channels.',
      price_variation_details:
        'Prices may be varied in line with your terms and conditions. We will give you notice before any new prices take effect.',
      terms_and_conditions:
        'Please refer to our website www.energyaustralia.com.au for solar feed-in eligibility and full terms and conditions.',
      contract_expiry_details:
        'The Benefit Period for this plan is for 1 year. We will provide you with notice of your options prior to the end of the Benefit Period. Your contract will continue until it is ended by either party.',
      fixed_rates: '0',
      lowest_rps: null,
      factsheet_url: null,
      zone_id: null,
      plan_type_id: 2,
      customer_type_id: 1,
      distributor_id: 13,
      rate_card_id: 3,
      contract_term_id: 1,
      bill_freq_id: 3,
      retail_tariff_id: null,
    },
    {
      int_plan_code: 'VE_TAPRC_CI_T7',
      ext_plan_code: 'TRU556433MR',
      plan_name: 'Balance Plan - Time of Use - Comparator',
      effective_from: '2025-07-01',
      effective_to: null,
      review_date: '2025-01-01',
      restricted: false,
      contingent: false,
      direct_debit_only: false,
      ebilling_only: false,
      solar_cust_only: false,
      ev_only: false,
      intrinsic_green: false,
      intrinsic_gpp: null,
      eligibility_criteria:
        'The details in this fact sheet are for residential customers located in the distribution area outlined with the meter configuration described.',
      price_variation_details:
        'Prices may be varied in line with your terms and conditions. We will give you notice before any new prices take effect.',
      terms_and_conditions:
        'Please refer to our website www.energyaustralia.com.au for solar feed-in eligibility and full terms and conditions.',
      contract_expiry_details:
        'The Benefit Period for this plan is for 1 year. We will provide you with notice of your options prior to the end of the Benefit Period. Your contract will continue until it is ended by either party.',
      fixed_rates: '0',
      lowest_rps: null,
      factsheet_url: null,
      zone_id: null,
      plan_type_id: 2,
      customer_type_id: 1,
      distributor_id: 9,
      rate_card_id: 4,
      contract_term_id: 1,
      bill_freq_id: 3,
      retail_tariff_id: 1,
    },
    {
      int_plan_code: 'VE_RSOT_CI_T71',
      ext_plan_code: 'TRU556443SR',
      plan_name: 'Standing Offer (Home) - Time of Use with Controlled Load',
      effective_from: '2025-07-01',
      effective_to: null,
      review_date: '2025-01-01',
      restricted: false,
      contingent: false,
      direct_debit_only: false,
      ebilling_only: false,
      solar_cust_only: false,
      ev_only: false,
      intrinsic_green: false,
      intrinsic_gpp: null,
      eligibility_criteria:
        'The details in this fact sheet are for residential customers located in the distribution area outlined with the meter configuration described.',
      price_variation_details:
        "The rates for the Victorian Default Offer are regulated by the Essential Services Commission (ESC). The ESC will review these rates annually starting on 1 January each year. We'll notify you before a rate change occurs.",
      terms_and_conditions:
        'Please refer to our website www.energyaustralia.com.au for solar feed-in eligibility and full terms and conditions.',
      contract_expiry_details:
        'This contract continues for as long as you remain on the plan.',
      fixed_rates: '0',
      lowest_rps: null,
      factsheet_url: null,
      zone_id: null,
      plan_type_id: 1,
      customer_type_id: 1,
      distributor_id: 9,
      rate_card_id: 5,
      contract_term_id: 1,
      bill_freq_id: 3,
      retail_tariff_id: 2,
    },
    {
      int_plan_code: 'VG_RSOT_R1',
      ext_plan_code: 'TRU567149SR',
      plan_name: 'Standing Offer (Home) (R1)',
      effective_from: '2025-07-01',
      effective_to: null,
      review_date: '2025-01-01',
      restricted: false,
      contingent: false,
      direct_debit_only: false,
      ebilling_only: false,
      solar_cust_only: false,
      ev_only: false,
      intrinsic_green: false,
      intrinsic_gpp: null,
      eligibility_criteria:
        'The details in this fact sheet are for residential customers located in the distribution area outlined with the meter configuration described.',
      price_variation_details:
        "The rates for Standing Offer (Home) may vary, either when we are directed to change regulated rates, or when we review our rates each year. We'll notify you before any rate change occurs.",
      terms_and_conditions:
        'For full terms and conditions, please refer to our website www.energyaustralia.com.au.',
      contract_expiry_details:
        'This contract continues for as long as you remain on the plan.',
      fixed_rates: '0',
      lowest_rps: null,
      factsheet_url: null,
      zone_id: 1,
      plan_type_id: 1,
      customer_type_id: 1,
      distributor_id: 14,
      rate_card_id: 6,
      contract_term_id: 1,
      bill_freq_id: 2,
      retail_tariff_id: null,
    },
    {
      int_plan_code: 'VG_TAPRC_A2',
      ext_plan_code: 'TRU567144MR',
      plan_name: 'Balance Plan - Comparator (A2)',
      effective_from: '2025-07-01',
      effective_to: null,
      review_date: '2025-01-01',
      restricted: false,
      contingent: false,
      direct_debit_only: false,
      ebilling_only: false,
      solar_cust_only: false,
      ev_only: false,
      intrinsic_green: false,
      intrinsic_gpp: null,
      eligibility_criteria:
        "The details presented in this fact sheet are for a residential customer located in the distribution area outlined with a metering configuration as described. Unless otherwise specified, 'Peak Only' is the default meter type.",
      price_variation_details:
        'Prices may be varied in line with your terms and conditions. We will give you notice before any new prices take effect.',
      terms_and_conditions:
        'For full terms and conditions, please refer to our website www.energyaustralia.com.au.',
      contract_expiry_details:
        'The Benefit Period for this plan is for 1 year. We will provide you with notice of your options prior to the end of the Benefit Period. Your contract will continue until it is ended by either party.',
      fixed_rates: '0',
      lowest_rps: null,
      factsheet_url: null,
      zone_id: 2,
      plan_type_id: 2,
      customer_type_id: 1,
      distributor_id: 15,
      rate_card_id: 7,
      contract_term_id: 1,
      bill_freq_id: 2,
      retail_tariff_id: null,
    },
  ];

  for (const plan of plans) {
    const existing = await dataSource.query(
      'SELECT * FROM plans WHERE int_plan_code = $1',
      [plan.int_plan_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        `INSERT INTO plans (
            int_plan_code, ext_plan_code, plan_name, plan_type_id, customer_type_id,
            distributor_id, zone_id, rate_card_id, contract_term_id, retail_tariff_id,
            bill_freq_id, effective_from, effective_to, review_date, restricted,
            contingent, direct_debit_only, ebilling_only, intrinsic_green, intrinsic_gpp,
            solar_cust_only, ev_only, eligibility_criteria, price_variation_details,
            terms_and_conditions, contract_expiry_details, fixed_rates, lowest_rps,
            factsheet_url, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, NOW(), NOW()
          )`,
        [
          plan.int_plan_code,
          plan.ext_plan_code,
          plan.plan_name,
          plan.plan_type_id,
          plan.customer_type_id,
          plan.distributor_id,
          plan.zone_id,
          plan.rate_card_id,
          plan.contract_term_id,
          plan.retail_tariff_id,
          plan.bill_freq_id,
          plan.effective_from,
          plan.effective_to,
          plan.review_date,
          plan.restricted,
          plan.contingent,
          plan.direct_debit_only,
          plan.ebilling_only,
          plan.intrinsic_green,
          plan.intrinsic_gpp,
          plan.solar_cust_only,
          plan.ev_only,
          plan.eligibility_criteria,
          plan.price_variation_details,
          plan.terms_and_conditions,
          plan.contract_expiry_details,
          plan.fixed_rates,
          plan.lowest_rps,
          plan.factsheet_url,
        ],
      );
      console.log(`  ✓ Created plan: ${plan.plan_name}`);
    } else {
      console.log(`  - Plan already exists: ${plan.plan_name}`);
    }
  }
}

async function seedBillingCodeTypes(dataSource: DataSource) {
  const billingCodeTypes = [
    {
      billing_code_type: 'PRODUCT',
      billing_code_type_name: 'Product Code',
    },
    {
      billing_code_type: 'OFFERING',
      billing_code_type_name: 'Offering Code',
    },
    {
      billing_code_type: 'PRICING',
      billing_code_type_name: 'Pricing Tag',
    },
  ];

  for (const codeType of billingCodeTypes) {
    const existing = await dataSource.query(
      'SELECT * FROM billing_code_types WHERE billing_code_type = $1',
      [codeType.billing_code_type],
    );

    if (existing.length === 0) {
      await dataSource.query(
        `INSERT INTO billing_code_types (
          billing_code_type, billing_code_type_name, created_at, updated_at
        ) VALUES ($1, $2, NOW(), NOW())`,
        [codeType.billing_code_type, codeType.billing_code_type_name],
      );
      console.log(
        `  ✓ Created billing code type: ${codeType.billing_code_type_name}`,
      );
    } else {
      console.log(
        `  - Billing code type already exists: ${codeType.billing_code_type_name}`,
      );
    }
  }
}

async function seedChargeClasses(dataSource: DataSource) {
  const chargeClasses = [
    {
      charge_class_code: 'DISCOUNT',
      charge_class_name: 'Discount',
      multiplier: -1,
    },
    {
      charge_class_code: 'FEE',
      charge_class_name: 'Fee',
      multiplier: 1,
    },
    {
      charge_class_code: 'GREEN',
      charge_class_name: 'Greenpower',
      multiplier: 1,
    },
  ];

  for (const chargeClass of chargeClasses) {
    const existing = await dataSource.query(
      'SELECT * FROM charge_classes WHERE charge_class_code = $1',
      [chargeClass.charge_class_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        `INSERT INTO charge_classes (
          charge_class_code, charge_class_name, multiplier, created_at, updated_at
        ) VALUES ($1, $2, $3, NOW(), NOW())`,
        [
          chargeClass.charge_class_code,
          chargeClass.charge_class_name,
          chargeClass.multiplier,
        ],
      );
      console.log(`  ✓ Created charge class: ${chargeClass.charge_class_name}`);
    } else {
      console.log(
        `  - Charge class already exists: ${chargeClass.charge_class_name}`,
      );
    }
  }
}

async function seedChargeTypes(dataSource: DataSource) {
  const chargeTypes = [
    {
      charge_type_code: 'UNCOND',
      charge_type_name: 'Unconditional',
      charge_class_id: 1,
    },
    {
      charge_type_code: 'COND',
      charge_type_name: 'Conditional',
      charge_class_id: 1,
    },
    {
      charge_type_code: 'CC_FEE',
      charge_type_name: 'Credit Card Payment Processing Fee',
      charge_class_id: 2,
    },
    {
      charge_type_code: 'DISCON_FEE',
      charge_type_name: 'Disconnection Fee',
      charge_class_id: 2,
    },
    {
      charge_type_code: 'RECON_FEE',
      charge_type_name: 'Reconnection Fee',
      charge_class_id: 2,
    },
    {
      charge_type_code: 'OTHER',
      charge_type_name: 'Other Fee',
      charge_class_id: 2,
    },
    {
      charge_type_code: 'GREEN',
      charge_type_name: 'Greenpower',
      charge_class_id: 3,
    },
    {
      charge_type_code: 'CONN_FEE',
      charge_type_name: 'Connection Fee',
      charge_class_id: 2,
    },
    {
      charge_type_code: 'PROCESS_FEE',
      charge_type_name: 'Payment Processing Fee',
      charge_class_id: 2,
    },
    {
      charge_type_code: 'CHEQUE_DISHON',
      charge_type_name: 'Cheque Dishonour Payment Fee',
      charge_class_id: 2,
    },
    {
      charge_type_code: 'DD_DISHON',
      charge_type_name: 'Direct Debit Dishonour Payment Fee',
      charge_class_id: 2,
    },
    {
      charge_type_code: 'ANNUAL_FEE',
      charge_type_name: 'Annual Fee',
      charge_class_id: 2,
    },
  ];

  for (const chargeType of chargeTypes) {
    const existing = await dataSource.query(
      'SELECT * FROM charge_types WHERE charge_type_code = $1',
      [chargeType.charge_type_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        `INSERT INTO charge_types (
          charge_type_code, charge_type_name, charge_class_id, created_at, updated_at
        ) VALUES ($1, $2, $3, NOW(), NOW())`,
        [
          chargeType.charge_type_code,
          chargeType.charge_type_name,
          chargeType.charge_class_id,
        ],
      );
      console.log(`  ✓ Created charge type: ${chargeType.charge_type_name}`);
    } else {
      console.log(
        `  - Charge type already exists: ${chargeType.charge_type_name}`,
      );
    }
  }
}

async function seedChargeCategories(dataSource: DataSource) {
  const chargeCategories = [
    {
      charge_category_code: 'PAY_ON_TIME',
      charge_category_name: 'Pay On Time',
      charge_class_id: 1,
    },
    {
      charge_category_code: 'DIRECT_DEBIT',
      charge_category_name: 'Direct Debit',
      charge_class_id: 1,
    },
    {
      charge_category_code: 'EBILLING',
      charge_category_name: 'E-billing',
      charge_class_id: 1,
    },
    {
      charge_category_code: 'BUNDLED',
      charge_category_name: 'Bundled Services',
      charge_class_id: 1,
    },
    {
      charge_category_code: 'Other',
      charge_category_name: 'Other',
      charge_class_id: 1,
    },
    {
      charge_category_code: 'FEE',
      charge_category_name: 'Fee',
      charge_class_id: 2,
    },
    {
      charge_category_code: 'GREEN',
      charge_category_name: 'Greenpower',
      charge_class_id: 3,
    },
  ];

  for (const chargeCategory of chargeCategories) {
    const existing = await dataSource.query(
      'SELECT * FROM charge_categories WHERE charge_category_code = $1',
      [chargeCategory.charge_category_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        `INSERT INTO charge_categories (
          charge_category_code, charge_category_name, charge_class_id, created_at, updated_at
        ) VALUES ($1, $2, $3, NOW(), NOW())`,
        [
          chargeCategory.charge_category_code,
          chargeCategory.charge_category_name,
          chargeCategory.charge_class_id,
        ],
      );
      console.log(
        `  ✓ Created charge category: ${chargeCategory.charge_category_name}`,
      );
    } else {
      console.log(
        `  - Charge category already exists: ${chargeCategory.charge_category_name}`,
      );
    }
  }
}

async function seedChargeTerms(dataSource: DataSource) {
  const chargeTerms = [
    {
      charge_term_code: 'PERC_BILL_AMT',
    },
    {
      charge_term_code: 'PERC_USG',
    },
    {
      charge_term_code: 'FLAT',
    },
    {
      charge_term_code: 'PERC_USG_FIX',
    },
    {
      charge_term_code: 'YEAR_1',
    },
    {
      charge_term_code: 'YEAR_2',
    },
    {
      charge_term_code: 'YEAR_3',
    },
    {
      charge_term_code: 'YEAR_4',
    },
    {
      charge_term_code: 'YEAR_5',
    },
    {
      charge_term_code: 'AMT_PER_UNIT',
    },
    {
      charge_term_code: 'DAILY',
    },
    {
      charge_term_code: 'WEEKLY',
    },
    {
      charge_term_code: 'MONTHLY',
    },
  ];

  for (const chargeTerm of chargeTerms) {
    const existing = await dataSource.query(
      'SELECT * FROM charge_terms WHERE charge_term_code = $1',
      [chargeTerm.charge_term_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        `INSERT INTO charge_terms (
          charge_term_code, created_at, updated_at
        ) VALUES ($1, NOW(), NOW())`,
        [chargeTerm.charge_term_code],
      );
      console.log(`  ✓ Created charge term: ${chargeTerm.charge_term_code}`);
    } else {
      console.log(
        `  - Charge term already exists: ${chargeTerm.charge_term_code}`,
      );
    }
  }
}

async function seedBillingCodes(dataSource: DataSource) {
  // Get actual plan IDs from the database
  const plans = await dataSource.query(
    'SELECT plan_id, int_plan_code FROM plans ORDER BY plan_id',
  );

  const billingCodes = [
    {
      billing_code: 'EVRMAY2025MR',
      billing_code_type_id: 1,
      plan_code: 'VE_3RD_UN_PDC',
    },
    {
      billing_code: 'ABCD123',
      billing_code_type_id: 2,
      plan_code: 'VE_3RD_UN_PDC',
    },
    {
      billing_code: 'ZZZ334R',
      billing_code_type_id: 3,
      plan_code: 'VE_3RD_UN_PDC',
    },
    {
      billing_code: 'EVRMAY2025MR',
      billing_code_type_id: 1,
      plan_code: 'VE_3RD_TR_PKO',
    },
    {
      billing_code: 'ABCD123',
      billing_code_type_id: 2,
      plan_code: 'VE_3RD_TR_PKO',
    },
    {
      billing_code: 'ZZZ334R',
      billing_code_type_id: 3,
      plan_code: 'VE_3RD_TR_PKO',
    },
  ];

  for (const billingCode of billingCodes) {
    // Find the plan ID by plan code
    const plan = plans.find((p) => p.int_plan_code === billingCode.plan_code);
    if (!plan) {
      console.log(
        `  - Plan not found: ${billingCode.plan_code}, skipping billing code: ${billingCode.billing_code}`,
      );
      continue;
    }

    const existing = await dataSource.query(
      'SELECT * FROM billing_codes WHERE billing_code = $1 AND plan_id = $2',
      [billingCode.billing_code, plan.plan_id],
    );

    if (existing.length === 0) {
      await dataSource.query(
        `INSERT INTO billing_codes (
          billing_code, billing_code_type_id, plan_id, created_at, updated_at
        ) VALUES ($1, $2, $3, NOW(), NOW())`,
        [
          billingCode.billing_code,
          billingCode.billing_code_type_id,
          plan.plan_id,
        ],
      );
      console.log(
        `  ✓ Created billing code: ${billingCode.billing_code} for plan ${billingCode.plan_code} (ID: ${plan.plan_id})`,
      );
    } else {
      console.log(
        `  - Billing code already exists: ${billingCode.billing_code} for plan ${billingCode.plan_code}`,
      );
    }
  }
}

async function seedCharges(dataSource: DataSource) {
  // Get actual plan IDs from the database
  const plans = await dataSource.query(
    'SELECT plan_id, int_plan_code FROM plans ORDER BY plan_id',
  );

  const charges = [
    {
      charge_code: 'VE_RSOT_CI_PDC_DISCON',
      charge_description:
        'Disconnecting electricity to your property or reading your meter where applicable - Business hours',
      charge_amount: 45.52,
      charge_perc: null,
      greenpower_perc: null,
      reference_01: null,
      plan_code: 'VE_RSOT_CI_T71',
      charge_type_id: 4,
      charge_category_id: 6,
      charge_term_id: 3,
    },
    {
      charge_code: 'VE_RSOT_CI_PDC_CCFEE',
      charge_description: 'Credit card payment processing fee',
      charge_amount: null,
      charge_perc: 0.36,
      greenpower_perc: null,
      reference_01: null,
      plan_code: 'VE_RSOT_CI_T71',
      charge_type_id: 3,
      charge_category_id: 6,
      charge_term_id: 1,
    },
    {
      charge_code: 'VE_RSOT_CI_PDC_GP_10',
      charge_description: 'PureEnergy 10% = $0.0495 x (10% x total usage)',
      charge_amount: 0.0495,
      charge_perc: null,
      greenpower_perc: 0.1,
      reference_01: null,
      plan_code: 'VE_RSOT_CI_T71',
      charge_type_id: 7,
      charge_category_id: 7,
      charge_term_id: 10,
    },
    {
      charge_code: 'VE_RSOT_CI_PDC_GP_20',
      charge_description: 'PureEnergy 20% = $0.0495 x (20% x total usage)',
      charge_amount: 0.0495,
      charge_perc: null,
      greenpower_perc: 0.2,
      reference_01: null,
      plan_code: 'VE_RSOT_CI_T71',
      charge_type_id: 7,
      charge_category_id: 7,
      charge_term_id: 10,
    },
    {
      charge_code: 'VE_RSOT_CI_PDC_GP_100',
      charge_description: 'PureEnergy 100% = $0.0495 x (100% x total usage)',
      charge_amount: 0.0495,
      charge_perc: null,
      greenpower_perc: 1,
      reference_01: null,
      plan_code: 'VE_RSOT_CI_T71',
      charge_type_id: 7,
      charge_category_id: 7,
      charge_term_id: 10,
    },
    {
      charge_code: 'VE_3RD_UN_PDC_DISCON',
      charge_description: 'Guaranteed Whole of Bill Discount',
      charge_amount: null,
      charge_perc: 12,
      greenpower_perc: null,
      reference_01:
        'Guaranteed total energy bill discount. Applies to usage and supply charges.',
      plan_code: 'VE_3RD_UN_PDC',
      charge_type_id: 1,
      charge_category_id: 5,
      charge_term_id: 1,
    },
    {
      charge_code: 'VE_3RD_TR_PKO_DISCON',
      charge_description: 'Disconnection Fee',
      charge_amount: 45.52,
      charge_perc: null,
      greenpower_perc: null,
      reference_01: null,
      plan_code: 'VE_3RD_TR_PKO',
      charge_type_id: 4,
      charge_category_id: 6,
      charge_term_id: 3,
    },
    {
      charge_code: 'VE_TAPRC_CI_T7_CCFEE',
      charge_description: 'Credit card payment processing fee',
      charge_amount: null,
      charge_perc: 0.36,
      greenpower_perc: null,
      reference_01: null,
      plan_code: 'VE_TAPRC_CI_T7',
      charge_type_id: 3,
      charge_category_id: 6,
      charge_term_id: 1,
    },
    {
      charge_code: 'VG_RSOT_R1_GP_10',
      charge_description: 'PureEnergy 10% = $0.0495 x (10% x total usage)',
      charge_amount: 0.0495,
      charge_perc: null,
      greenpower_perc: 0.1,
      reference_01: null,
      plan_code: 'VG_RSOT_R1',
      charge_type_id: 7,
      charge_category_id: 7,
      charge_term_id: 10,
    },
    {
      charge_code: 'VG_TAPRC_A2_ANNUAL',
      charge_description: 'Annual Service Fee',
      charge_amount: 25.0,
      charge_perc: null,
      greenpower_perc: null,
      reference_01: null,
      plan_code: 'VG_TAPRC_A2',
      charge_type_id: 12,
      charge_category_id: 6,
      charge_term_id: 3,
    },
  ];

  for (const charge of charges) {
    // Find the plan ID by plan code
    const plan = plans.find((p) => p.int_plan_code === charge.plan_code);
    if (!plan) {
      console.log(
        `  - Plan not found: ${charge.plan_code}, skipping charge: ${charge.charge_code}`,
      );
      continue;
    }

    const existing = await dataSource.query(
      'SELECT * FROM charges WHERE charge_code = $1 AND plan_id = $2',
      [charge.charge_code, plan.plan_id],
    );

    if (existing.length === 0) {
      await dataSource.query(
        `INSERT INTO charges (
          charge_code, charge_description, charge_amount, charge_perc, greenpower_perc,
          reference_01, plan_id, charge_type_id, charge_category_id, charge_term_id,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
        [
          charge.charge_code,
          charge.charge_description,
          charge.charge_amount,
          charge.charge_perc,
          charge.greenpower_perc,
          charge.reference_01,
          plan.plan_id,
          charge.charge_type_id,
          charge.charge_category_id,
          charge.charge_term_id,
        ],
      );
      console.log(
        `  ✓ Created charge: ${charge.charge_description} for plan ${charge.plan_code} (ID: ${plan.plan_id})`,
      );
    } else {
      console.log(
        `  - Charge already exists: ${charge.charge_description} for plan ${charge.plan_code}`,
      );
    }
  }
}

async function seedRateSeasons(dataSource: DataSource) {
  // First, create a basic rate record if none exists
  let rates = await dataSource.query('SELECT rate_id FROM rates LIMIT 1');
  let rateId = rates.length > 0 ? rates[0].rate_id : null;

  if (!rateId) {
    // Get rate category and rate card IDs
    const rateCategories = await dataSource.query(
      'SELECT rate_category_id FROM rate_categories LIMIT 1',
    );
    const rateCards = await dataSource.query(
      'SELECT rate_card_id FROM rate_cards LIMIT 1',
    );

    if (rateCategories.length > 0 && rateCards.length > 0) {
      await dataSource.query(
        'INSERT INTO rates (rate_code, rate_name, rate_category_id, rate_card_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [
          'DEFAULT_RATE',
          'Default Rate',
          rateCategories[0].rate_category_id,
          rateCards[0].rate_card_id,
        ],
      );

      // Get the newly created rate ID
      rates = await dataSource.query(
        'SELECT rate_id FROM rates WHERE rate_code = $1',
        ['DEFAULT_RATE'],
      );
      rateId = rates[0].rate_id;
    } else {
      console.log(
        '  - No rate categories or rate cards found, skipping rate seasons',
      );
      return;
    }
  }

  const rateSeasons = [
    {
      season_code: 'SUMMER',
      season_name: 'Summer',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      daily_charge: 0.0,
      rate_id: rateId,
    },
    {
      season_code: 'WINTER',
      season_name: 'Winter',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      daily_charge: 0.0,
      rate_id: rateId,
    },
    {
      season_code: 'SPRING',
      season_name: 'Spring',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      daily_charge: 0.0,
      rate_id: rateId,
    },
    {
      season_code: 'AUTUMN',
      season_name: 'Autumn',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      daily_charge: 0.0,
      rate_id: rateId,
    },
    {
      season_code: 'ALL_YEAR',
      season_name: 'All Year',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      daily_charge: 0.0,
      rate_id: rateId,
    },
  ];

  for (const season of rateSeasons) {
    const existing = await dataSource.query(
      'SELECT * FROM rate_seasons WHERE season_code = $1',
      [season.season_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO rate_seasons (season_code, season_name, effective_from, effective_to, daily_charge, rate_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
        [
          season.season_code,
          season.season_name,
          season.effective_from,
          season.effective_to,
          season.daily_charge,
          season.rate_id,
        ],
      );
      console.log(`  ✓ Created rate season: ${season.season_name}`);
    } else {
      console.log(`  - Rate season already exists: ${season.season_name}`);
    }
  }
}

async function seedRateClasses(dataSource: DataSource) {
  const rateClasses = [
    {
      rate_class_code: 'USAGE',
      rate_class_name: 'Usage',
      validate_24_hour_timing: true,
      multiplier: 1,
    },
    {
      rate_class_code: 'DEMAND',
      rate_class_name: 'Demand',
      validate_24_hour_timing: false,
      multiplier: 1,
    },
    {
      rate_class_code: 'EXPORT',
      rate_class_name: 'Solar',
      validate_24_hour_timing: false,
      multiplier: -1,
    },
  ];

  for (const rateClass of rateClasses) {
    const existing = await dataSource.query(
      'SELECT * FROM rate_classes WHERE rate_class_code = $1',
      [rateClass.rate_class_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO rate_classes (rate_class_code, rate_class_name, validate_24_hour_timing, multiplier, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [
          rateClass.rate_class_code,
          rateClass.rate_class_name,
          rateClass.validate_24_hour_timing,
          rateClass.multiplier,
        ],
      );
      console.log(`  ✓ Created rate class: ${rateClass.rate_class_name}`);
    } else {
      console.log(
        `  - Rate class already exists: ${rateClass.rate_class_name}`,
      );
    }
  }
}

async function seedRateTypes(dataSource: DataSource) {
  const rateTypes = [
    {
      rate_type_code: 'SINGLE',
      rate_type_name: 'Single Rate',
      has_timings: false,
      rate_class_id: 1,
    },
    {
      rate_type_code: 'PEAK',
      rate_type_name: 'Peak',
      has_timings: true,
      rate_class_id: 1,
    },
    {
      rate_type_code: 'OFF_PEAK',
      rate_type_name: 'Off-peak',
      has_timings: true,
      rate_class_id: 1,
    },
    {
      rate_type_code: 'SHOULDER',
      rate_type_name: 'Shoulder',
      has_timings: true,
      rate_class_id: 1,
    },
    {
      rate_type_code: 'DEMAND',
      rate_type_name: 'Demand',
      has_timings: true,
      rate_class_id: 2,
    },
    {
      rate_type_code: 'EXPORT1',
      rate_type_name: 'Solar',
      has_timings: false,
      rate_class_id: 3,
    },
    {
      rate_type_code: 'EXPORT2_PK',
      rate_type_name: 'Peak',
      has_timings: false,
      rate_class_id: 3,
    },
    {
      rate_type_code: 'EXPORT2_OP',
      rate_type_name: 'Off-Peak',
      has_timings: false,
      rate_class_id: 3,
    },
    {
      rate_type_code: 'EXPORT2_SH',
      rate_type_name: 'Shoulder',
      has_timings: false,
      rate_class_id: 3,
    },
    {
      rate_type_code: 'EXPORT2_ON',
      rate_type_name: 'Overnight',
      has_timings: false,
      rate_class_id: 3,
    },
    {
      rate_type_code: 'EXPORT2_DY',
      rate_type_name: 'Day',
      has_timings: false,
      rate_class_id: 3,
    },
    {
      rate_type_code: 'EXPORT2_EE',
      rate_type_name: 'Early Evening',
      has_timings: false,
      rate_class_id: 3,
    },
  ];

  for (const rateType of rateTypes) {
    const existing = await dataSource.query(
      'SELECT * FROM rate_types WHERE rate_type_code = $1',
      [rateType.rate_type_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO rate_types (rate_type_code, rate_type_name, has_timings, rate_class_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [
          rateType.rate_type_code,
          rateType.rate_type_name,
          rateType.has_timings,
          rateType.rate_class_id,
        ],
      );
      console.log(`  ✓ Created rate type: ${rateType.rate_type_name}`);
    } else {
      console.log(`  - Rate type already exists: ${rateType.rate_type_name}`);
    }
  }
}

async function seedRatePeriods(dataSource: DataSource) {
  const ratePeriods = [
    { rate_period_code: 'NA', rate_period_name: 'Not applicable' },
    { rate_period_code: 'DAY', rate_period_name: 'Day' },
    { rate_period_code: 'WEEK', rate_period_name: 'Week' },
    { rate_period_code: '1_MONTH', rate_period_name: 'Month' },
    { rate_period_code: '2_MONTH', rate_period_name: '2 months' },
    { rate_period_code: 'QUARTER', rate_period_name: 'Quarter' },
    { rate_period_code: '6_MONTH', rate_period_name: '6 months' },
    { rate_period_code: 'YEAR', rate_period_name: 'Year' },
    { rate_period_code: 'SEASON', rate_period_name: 'Season' },
  ];

  for (const period of ratePeriods) {
    const existing = await dataSource.query(
      'SELECT * FROM rate_periods WHERE rate_period_code = $1',
      [period.rate_period_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO rate_periods (rate_period_code, rate_period_name, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())',
        [period.rate_period_code, period.rate_period_name],
      );
      console.log(`  ✓ Created rate period: ${period.rate_period_name}`);
    } else {
      console.log(`  - Rate period already exists: ${period.rate_period_name}`);
    }
  }
}

async function seedRateItems(dataSource: DataSource) {
  const rateItems = [
    {
      rate_item_name: 'Peak Energy Rate',
      rate_item_details: 'Peak time energy consumption rate',
      rate_season_id: 1, // Summer
      rate_type_id: 1, // Peak
      rate_period_id: 1, // Monthly
    },
    {
      rate_item_name: 'Off-Peak Energy Rate',
      rate_item_details: 'Off-peak time energy consumption rate',
      rate_season_id: 1, // Summer
      rate_type_id: 2, // Off-Peak
      rate_period_id: 1, // Monthly
    },
    {
      rate_item_name: 'Shoulder Energy Rate',
      rate_item_details: 'Shoulder time energy consumption rate',
      rate_season_id: 1, // Summer
      rate_type_id: 3, // Shoulder
      rate_period_id: 1, // Monthly
    },
    {
      rate_item_name: 'Winter Peak Rate',
      rate_item_details: 'Winter peak time energy consumption rate',
      rate_season_id: 2, // Winter
      rate_type_id: 1, // Peak
      rate_period_id: 1, // Monthly
    },
    {
      rate_item_name: 'Solar Feed-in Rate',
      rate_item_details: 'Solar energy feed-in tariff rate',
      rate_season_id: 5, // All Year
      rate_type_id: 6, // Solar FIT
      rate_period_id: 1, // Monthly
    },
  ];

  for (const item of rateItems) {
    const existing = await dataSource.query(
      'SELECT * FROM rate_items WHERE rate_item_name = $1',
      [item.rate_item_name],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO rate_items (rate_item_name, rate_item_details, rate_season_id, rate_type_id, rate_period_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [
          item.rate_item_name,
          item.rate_item_details,
          item.rate_season_id,
          item.rate_type_id,
          item.rate_period_id,
        ],
      );
      console.log(`  ✓ Created rate item: ${item.rate_item_name}`);
    } else {
      console.log(`  - Rate item already exists: ${item.rate_item_name}`);
    }
  }
}

async function seedRateItemTimings(dataSource: DataSource) {
  // Get rate items
  const rateItems = await dataSource.query(
    'SELECT rate_item_id, rate_item_name FROM rate_items ORDER BY rate_item_id',
  );

  const timings = [
    {
      rate_item_name: 'Peak Energy Rate',
      time_band_start: '07:00:00',
      time_band_end: '22:00:00',
      weekdays: true,
      weekend_sat: false,
      weekend_sun: false,
    },
    {
      rate_item_name: 'Off-Peak Energy Rate',
      time_band_start: '22:00:00',
      time_band_end: '07:00:00',
      weekdays: true,
      weekend_sat: true,
      weekend_sun: true,
    },
    {
      rate_item_name: 'Shoulder Energy Rate',
      time_band_start: '07:00:00',
      time_band_end: '10:00:00',
      weekdays: true,
      weekend_sat: false,
      weekend_sun: false,
    },
    {
      rate_item_name: 'Winter Peak Rate',
      time_band_start: '06:00:00',
      time_band_end: '23:00:00',
      weekdays: true,
      weekend_sat: false,
      weekend_sun: false,
    },
    {
      rate_item_name: 'Solar Feed-in Rate',
      time_band_start: '00:00:00',
      time_band_end: '23:59:59',
      weekdays: true,
      weekend_sat: true,
      weekend_sun: true,
    },
  ];

  for (const timing of timings) {
    const rateItem = rateItems.find(
      (item) => item.rate_item_name === timing.rate_item_name,
    );
    if (!rateItem) {
      console.log(
        `  - Rate item not found: ${timing.rate_item_name}, skipping timing`,
      );
      continue;
    }

    const existing = await dataSource.query(
      'SELECT * FROM rate_item_timings WHERE rate_item_id = $1 AND time_band_start = $2',
      [rateItem.rate_item_id, timing.time_band_start],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO rate_item_timings (rate_item_id, time_band_start, time_band_end, weekdays, weekend_sat, weekend_sun, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
        [
          rateItem.rate_item_id,
          timing.time_band_start,
          timing.time_band_end,
          timing.weekdays,
          timing.weekend_sat,
          timing.weekend_sun,
        ],
      );
      console.log(`  ✓ Created timing for: ${timing.rate_item_name}`);
    } else {
      console.log(`  - Timing already exists for: ${timing.rate_item_name}`);
    }
  }
}

async function seedRateItemBlocks(dataSource: DataSource) {
  // Get rate items
  const rateItems = await dataSource.query(
    'SELECT rate_item_id, rate_item_name FROM rate_items ORDER BY rate_item_id',
  );

  const blocks = [
    {
      rate_item_name: 'Peak Energy Rate',
      block_number: 1,
      block_consumption: 100.0,
      block_rate: 0.25,
    },
    {
      rate_item_name: 'Peak Energy Rate',
      block_number: 2,
      block_consumption: 200.0,
      block_rate: 0.3,
    },
    {
      rate_item_name: 'Off-Peak Energy Rate',
      block_number: 1,
      block_consumption: 100.0,
      block_rate: 0.15,
    },
    {
      rate_item_name: 'Off-Peak Energy Rate',
      block_number: 2,
      block_consumption: 200.0,
      block_rate: 0.18,
    },
    {
      rate_item_name: 'Shoulder Energy Rate',
      block_number: 1,
      block_consumption: 100.0,
      block_rate: 0.2,
    },
    {
      rate_item_name: 'Winter Peak Rate',
      block_number: 1,
      block_consumption: 100.0,
      block_rate: 0.28,
    },
    {
      rate_item_name: 'Solar Feed-in Rate',
      block_number: 1,
      block_consumption: 1000.0,
      block_rate: 0.12,
    },
  ];

  for (const block of blocks) {
    const rateItem = rateItems.find(
      (item) => item.rate_item_name === block.rate_item_name,
    );
    if (!rateItem) {
      console.log(
        `  - Rate item not found: ${block.rate_item_name}, skipping block`,
      );
      continue;
    }

    const existing = await dataSource.query(
      'SELECT * FROM rate_item_blocks WHERE rate_item_id = $1 AND block_number = $2',
      [rateItem.rate_item_id, block.block_number],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO rate_item_blocks (rate_item_id, block_number, block_consumption, block_rate, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [
          rateItem.rate_item_id,
          block.block_number,
          block.block_consumption,
          block.block_rate,
        ],
      );
      console.log(
        `  ✓ Created block ${block.block_number} for: ${block.rate_item_name}`,
      );
    } else {
      console.log(`  - Block already exists for: ${block.rate_item_name}`);
    }
  }
}

async function seedRateItemDemands(dataSource: DataSource) {
  // Get rate items
  const rateItems = await dataSource.query(
    'SELECT rate_item_id, rate_item_name FROM rate_items ORDER BY rate_item_id',
  );

  const demands = [
    {
      rate_item_name: 'Peak Energy Rate',
      min_kw: 0.0,
      max_kw: 100.0,
      charge: 0.05,
      measurement_period_id: 1, // Monthly
    },
    {
      rate_item_name: 'Peak Energy Rate',
      min_kw: 100.0,
      max_kw: 500.0,
      charge: 0.08,
      measurement_period_id: 1, // Monthly
    },
    {
      rate_item_name: 'Off-Peak Energy Rate',
      min_kw: 0.0,
      max_kw: 200.0,
      charge: 0.03,
      measurement_period_id: 1, // Monthly
    },
  ];

  for (const demand of demands) {
    const rateItem = rateItems.find(
      (item) => item.rate_item_name === demand.rate_item_name,
    );
    if (!rateItem) {
      console.log(
        `  - Rate item not found: ${demand.rate_item_name}, skipping demand`,
      );
      continue;
    }

    const existing = await dataSource.query(
      'SELECT * FROM rate_item_demands WHERE rate_item_id = $1 AND min_kw = $2',
      [rateItem.rate_item_id, demand.min_kw],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO rate_item_demands (rate_item_id, min_kw, max_kw, charge, measurement_period_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [
          rateItem.rate_item_id,
          demand.min_kw,
          demand.max_kw,
          demand.charge,
          demand.measurement_period_id,
        ],
      );
      console.log(`  ✓ Created demand charge for: ${demand.rate_item_name}`);
    } else {
      console.log(
        `  - Demand charge already exists for: ${demand.rate_item_name}`,
      );
    }
  }
}

async function seedRateBlocks(dataSource: DataSource) {
  // Get plans
  const plans = await dataSource.query(
    'SELECT plan_id, int_plan_code FROM plans ORDER BY plan_id',
  );

  const rateBlocks = [
    {
      plan_code: 'RES001',
      rate_block_name: 'Peak Rate Block',
      description: 'Peak time energy consumption',
      start_time: '07:00',
      end_time: '22:00',
      days_of_week: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      rate_per_kwh: 0.25,
      supply_charge_per_day: 1.2,
      rate_type: 'PEAK',
      season: 'SUMMER',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      priority: 1,
    },
    {
      plan_code: 'RES001',
      rate_block_name: 'Off-Peak Rate Block',
      description: 'Off-peak time energy consumption',
      start_time: '22:00',
      end_time: '07:00',
      days_of_week: [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ],
      rate_per_kwh: 0.15,
      supply_charge_per_day: 1.2,
      rate_type: 'OFF_PEAK',
      season: 'SUMMER',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      priority: 2,
    },
    {
      plan_code: 'RES002',
      rate_block_name: 'Premium Peak Rate Block',
      description: 'Premium peak time energy consumption',
      start_time: '07:00',
      end_time: '22:00',
      days_of_week: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      rate_per_kwh: 0.22,
      supply_charge_per_day: 1.0,
      rate_type: 'PEAK',
      season: 'SUMMER',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      priority: 1,
    },
    {
      plan_code: 'SOLAR001',
      rate_block_name: 'Solar Feed-in Block',
      description: 'Solar energy feed-in tariff',
      start_time: '00:00',
      end_time: '23:59',
      days_of_week: [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ],
      rate_per_kwh: 0.12,
      supply_charge_per_day: 0.0,
      rate_type: 'SOLAR_FIT',
      season: 'ALL_YEAR',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      priority: 1,
    },
  ];

  for (const block of rateBlocks) {
    const plan = plans.find((p) => p.int_plan_code === block.plan_code);
    if (!plan) {
      console.log(
        `  - Plan not found: ${block.plan_code}, skipping rate block`,
      );
      continue;
    }

    const existing = await dataSource.query(
      'SELECT * FROM rate_blocks WHERE plan_id = $1 AND rate_block_name = $2',
      [plan.plan_id, block.rate_block_name],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO rate_blocks (plan_id, rate_block_name, description, start_time, end_time, days_of_week, rate_per_kwh, supply_charge_per_day, rate_type, season, effective_from, effective_to, priority, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())',
        [
          plan.plan_id,
          block.rate_block_name,
          block.description,
          block.start_time,
          block.end_time,
          JSON.stringify(block.days_of_week),
          block.rate_per_kwh,
          block.supply_charge_per_day,
          block.rate_type,
          block.season,
          block.effective_from,
          block.effective_to,
          block.priority,
          true,
        ],
      );
      console.log(
        `  ✓ Created rate block: ${block.rate_block_name} for plan ${block.plan_code}`,
      );
    } else {
      console.log(
        `  - Rate block already exists: ${block.rate_block_name} for plan ${block.plan_code}`,
      );
    }
  }
}

async function seedRateTimings(dataSource: DataSource) {
  // Get plans
  const plans = await dataSource.query(
    'SELECT plan_id, int_plan_code FROM plans ORDER BY plan_id',
  );

  const rateTimings = [
    {
      plan_code: 'RES001',
      timing_name: 'Peak Hours',
      description: 'Peak time hours for energy consumption',
      start_time: '07:00',
      end_time: '22:00',
      days_of_week: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      season: 'SUMMER',
    },
    {
      plan_code: 'RES001',
      timing_name: 'Off-Peak Hours',
      description: 'Off-peak time hours for energy consumption',
      start_time: '22:00',
      end_time: '07:00',
      days_of_week: [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ],
      season: 'SUMMER',
    },
    {
      plan_code: 'RES002',
      timing_name: 'Premium Peak Hours',
      description: 'Premium peak time hours for energy consumption',
      start_time: '07:00',
      end_time: '22:00',
      days_of_week: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      season: 'SUMMER',
    },
    {
      plan_code: 'SOLAR001',
      timing_name: 'Solar Generation Hours',
      description: 'Hours when solar generation is active',
      start_time: '06:00',
      end_time: '18:00',
      days_of_week: [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ],
      season: 'ALL_YEAR',
    },
  ];

  for (const timing of rateTimings) {
    const plan = plans.find((p) => p.int_plan_code === timing.plan_code);
    if (!plan) {
      console.log(
        `  - Plan not found: ${timing.plan_code}, skipping rate timing`,
      );
      continue;
    }

    const existing = await dataSource.query(
      'SELECT * FROM rate_timings WHERE plan_id = $1 AND timing_name = $2',
      [plan.plan_id, timing.timing_name],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO rate_timings (plan_id, timing_name, description, start_time, end_time, days_of_week, season, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())',
        [
          plan.plan_id,
          timing.timing_name,
          timing.description,
          timing.start_time,
          timing.end_time,
          JSON.stringify(timing.days_of_week),
          timing.season,
          true,
        ],
      );
      console.log(
        `  ✓ Created rate timing: ${timing.timing_name} for plan ${timing.plan_code}`,
      );
    } else {
      console.log(
        `  - Rate timing already exists: ${timing.timing_name} for plan ${timing.plan_code}`,
      );
    }
  }
}

// Run the seeds
runSeeds().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
