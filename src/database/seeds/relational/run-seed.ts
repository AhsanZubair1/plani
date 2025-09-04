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
    // await seedBillingFrequencies(dataSource);

    // Seed Retail Tariffs
    console.log('📊 Seeding Retail Tariffs...');
    await seedRetailTariffs(dataSource);

    // Seed Plans
    console.log('📊 Seeding Plans...');
    await seedPlans(dataSource);

    // Seed Billing Code Types
    console.log('📊 Seeding Billing Code Types...');
    await seedBillingCodeTypes(dataSource);

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
    await seedBillingCodes(dataSource);

    // Seed Charges
    console.log('📊 Seeding Charges...');
    await seedCharges(dataSource);

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
    { fuel_type_code: 'GAS', fuel_type_name: 'Natural Gas' },
    { fuel_type_code: 'SOLAR', fuel_type_name: 'Solar' },
    { fuel_type_code: 'WIND', fuel_type_name: 'Wind' },
    { fuel_type_code: 'HYDRO', fuel_type_name: 'Hydroelectric' },
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
      tariff_type_code: 'PEAK',
      tariff_type_name: 'Peak Rate',
      time_definition: '7:00 AM - 10:00 PM, Monday to Friday',
      fuel_type_id: 1,
    },
    {
      tariff_type_code: 'OFF_PEAK',
      tariff_type_name: 'Off-Peak Rate',
      time_definition: '10:00 PM - 7:00 AM, Monday to Friday',
      fuel_type_id: 1,
    },
    {
      tariff_type_code: 'WEEKEND',
      tariff_type_name: 'Weekend Rate',
      time_definition: 'All day Saturday and Sunday',
      fuel_type_id: 1,
    },
    {
      tariff_type_code: 'SHOULDER',
      tariff_type_name: 'Shoulder Rate',
      time_definition: '7:00 AM - 10:00 AM, 2:00 PM - 7:00 PM',
      fuel_type_id: 1,
    },
    {
      tariff_type_code: 'CONTROLLED',
      tariff_type_name: 'Controlled Load',
      time_definition: '11:00 PM - 7:00 AM',
      fuel_type_id: 1,
    },
    {
      tariff_type_code: 'SOLAR_FIT',
      tariff_type_name: 'Solar Feed-in Tariff',
      time_definition: 'All day',
      fuel_type_id: 3,
    },
    {
      tariff_type_code: 'GAS_STANDARD',
      tariff_type_name: 'Standard Gas Rate',
      time_definition: 'All day',
      fuel_type_id: 2,
    },
    {
      tariff_type_code: 'GAS_HEATING',
      tariff_type_name: 'Gas Heating Rate',
      time_definition: 'Winter months only',
      fuel_type_id: 2,
    },
  ];

  for (const tariffType of tariffTypes) {
    const existing = await dataSource.query(
      'SELECT * FROM tariff_types WHERE tariff_type_code = $1',
      [tariffType.tariff_type_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO tariff_types (tariff_type_code, tariff_type_name, time_definition, fuel_type_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [
          tariffType.tariff_type_code,
          tariffType.tariff_type_name,
          tariffType.time_definition,
          tariffType.fuel_type_id,
        ],
      );
      console.log(`  ✓ Created tariff type: ${tariffType.tariff_type_name}`);
    } else {
      console.log(
        `  - Tariff type already exists: ${tariffType.tariff_type_name}`,
      );
    }
  }
}

async function seedRateCards(dataSource: DataSource) {
  const rateCards = [
    {
      rate_card_name: 'Residential Standard Rate Card',
      underlying_nt_type: 'RES_STD',
      tariff_type_id: 1,
    },
    {
      rate_card_name: 'Residential Time of Use Rate Card',
      underlying_nt_type: 'RES_TOU',
      tariff_type_id: 2,
    },
    {
      rate_card_name: 'Residential Solar Rate Card',
      underlying_nt_type: 'RES_SOLAR',
      tariff_type_id: 6,
    },
    {
      rate_card_name: 'Commercial Standard Rate Card',
      underlying_nt_type: 'COM_STD',
      tariff_type_id: 1,
    },
    {
      rate_card_name: 'Commercial Time of Use Rate Card',
      underlying_nt_type: 'COM_TOU',
      tariff_type_id: 4,
    },
    {
      rate_card_name: 'Industrial Peak Rate Card',
      underlying_nt_type: 'IND_PEAK',
      tariff_type_id: 1,
    },
    {
      rate_card_name: 'Industrial Off-Peak Rate Card',
      underlying_nt_type: 'IND_OFF',
      tariff_type_id: 2,
    },
    {
      rate_card_name: 'Controlled Load Rate Card',
      underlying_nt_type: 'CTRL_LOAD',
      tariff_type_id: 5,
    },
    {
      rate_card_name: 'Gas Standard Rate Card',
      underlying_nt_type: 'GAS_STD',
      tariff_type_id: 7,
    },
    {
      rate_card_name: 'Gas Heating Rate Card',
      underlying_nt_type: 'GAS_HEAT',
      tariff_type_id: 8,
    },
  ];

  for (const rateCard of rateCards) {
    const existing = await dataSource.query(
      'SELECT * FROM rate_cards WHERE rate_card_name = $1',
      [rateCard.rate_card_name],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO rate_cards (rate_card_name, underlying_nt_type, tariff_type_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
        [
          rateCard.rate_card_name,
          rateCard.underlying_nt_type,
          rateCard.tariff_type_id,
        ],
      );
      console.log(`  ✓ Created rate card: ${rateCard.rate_card_name}`);
    } else {
      console.log(`  - Rate card already exists: ${rateCard.rate_card_name}`);
    }
  }
}

async function seedStates(dataSource: DataSource) {
  const states = [
    { state_code: 'NSW', state_name: 'New South Wales' },
    { state_code: 'VIC', state_name: 'Victoria' },
    { state_code: 'QLD', state_name: 'Queensland' },
    { state_code: 'WA', state_name: 'Western Australia' },
    { state_code: 'SA', state_name: 'South Australia' },
    { state_code: 'TAS', state_name: 'Tasmania' },
    { state_code: 'ACT', state_name: 'Australian Capital Territory' },
    { state_code: 'NT', state_name: 'Northern Territory' },
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
      distributor_code: 'AUSGRID',
      distributor_name: 'Ausgrid',
      mirn_prefix: 'NSW',
      state_id: 1,
    },
    {
      distributor_code: 'ENDEAVOUR',
      distributor_name: 'Endeavour Energy',
      mirn_prefix: 'NSW',
      state_id: 1,
    },
    {
      distributor_code: 'ESSENTIAL',
      distributor_name: 'Essential Energy',
      mirn_prefix: 'NSW',
      state_id: 1,
    },
    {
      distributor_code: 'CITIPOWER',
      distributor_name: 'CitiPower',
      mirn_prefix: 'VIC',
      state_id: 2,
    },
    {
      distributor_code: 'POWERCOR',
      distributor_name: 'Powercor Australia',
      mirn_prefix: 'VIC',
      state_id: 2,
    },
    {
      distributor_code: 'UNITED',
      distributor_name: 'United Energy',
      mirn_prefix: 'VIC',
      state_id: 2,
    },
    {
      distributor_code: 'ENERGEX',
      distributor_name: 'Energex',
      mirn_prefix: 'QLD',
      state_id: 3,
    },
    {
      distributor_code: 'ERGON',
      distributor_name: 'Ergon Energy',
      mirn_prefix: 'QLD',
      state_id: 3,
    },
    {
      distributor_code: 'WESTERN_POWER',
      distributor_name: 'Western Power',
      mirn_prefix: 'WA',
      state_id: 4,
    },
    {
      distributor_code: 'SA_POWER',
      distributor_name: 'SA Power Networks',
      mirn_prefix: 'SA',
      state_id: 5,
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
    { customer_type_code: 'RES', customer_type_name: 'Residential' },
    {
      customer_type_code: 'SME',
      customer_type_name: 'Small to Medium Enterprise',
    },
    { customer_type_code: 'LGE', customer_type_name: 'Large Enterprise' },
    { customer_type_code: 'IND', customer_type_name: 'Industrial' },
    { customer_type_code: 'GOV', customer_type_name: 'Government' },
    { customer_type_code: 'EDU', customer_type_name: 'Educational' },
    { customer_type_code: 'HOS', customer_type_name: 'Hospitality' },
    { customer_type_code: 'RET', customer_type_name: 'Retail' },
    { customer_type_code: 'MAN', customer_type_name: 'Manufacturing' },
    { customer_type_code: 'AGR', customer_type_name: 'Agricultural' },
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
    { plan_type_code: 'RES_BASIC', plan_type_name: 'Residential Basic' },
    { plan_type_code: 'RES_PREMIUM', plan_type_name: 'Residential Premium' },
    { plan_type_code: 'RES_GREEN', plan_type_name: 'Residential Green' },
    { plan_type_code: 'COM_SMALL', plan_type_name: 'Commercial Small' },
    { plan_type_code: 'COM_MEDIUM', plan_type_name: 'Commercial Medium' },
    { plan_type_code: 'COM_LARGE', plan_type_name: 'Commercial Large' },
    { plan_type_code: 'IND_HEAVY', plan_type_name: 'Industrial Heavy' },
    { plan_type_code: 'SOLAR_FIT', plan_type_name: 'Solar Feed-in Tariff' },
    { plan_type_code: 'EV_CHARGING', plan_type_name: 'EV Charging' },
    { plan_type_code: 'TIME_OF_USE', plan_type_name: 'Time of Use' },
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
      zone_code: 'NSW_SYD',
      zone_name: 'New South Wales - Sydney',
      supply_areas: 'Sydney Metropolitan Area, Blue Mountains, Central Coast',
      included_postcodes: '1000-2999, 3000-3999',
      excluded_postcodes: '4000-4999',
    },
    {
      zone_code: 'NSW_REG',
      zone_name: 'New South Wales - Regional',
      supply_areas: 'Regional NSW, Hunter Valley, Illawarra',
      included_postcodes: '2000-2999, 3000-3999',
      excluded_postcodes: '1000-1999',
    },
    {
      zone_code: 'VIC_MEL',
      zone_name: 'Victoria - Melbourne',
      supply_areas: 'Melbourne Metropolitan Area, Mornington Peninsula',
      included_postcodes: '3000-3999',
      excluded_postcodes: '4000-4999',
    },
    {
      zone_code: 'VIC_REG',
      zone_name: 'Victoria - Regional',
      supply_areas: 'Regional Victoria, Geelong, Ballarat',
      included_postcodes: '3000-3999, 4000-4999',
      excluded_postcodes: '5000-5999',
    },
    {
      zone_code: 'QLD_BNE',
      zone_name: 'Queensland - Brisbane',
      supply_areas: 'Brisbane Metropolitan Area, Gold Coast, Sunshine Coast',
      included_postcodes: '4000-4999',
      excluded_postcodes: '5000-5999',
    },
    {
      zone_code: 'QLD_REG',
      zone_name: 'Queensland - Regional',
      supply_areas: 'Regional Queensland, Cairns, Townsville',
      included_postcodes: '4000-4999, 5000-5999',
      excluded_postcodes: '6000-6999',
    },
    {
      zone_code: 'WA_PER',
      zone_name: 'Western Australia - Perth',
      supply_areas: 'Perth Metropolitan Area, Fremantle',
      included_postcodes: '6000-6999',
      excluded_postcodes: '7000-7999',
    },
    {
      zone_code: 'WA_REG',
      zone_name: 'Western Australia - Regional',
      supply_areas: 'Regional WA, Kalgoorlie, Broome',
      included_postcodes: '6000-6999, 7000-7999',
      excluded_postcodes: '8000-8999',
    },
    {
      zone_code: 'SA_ADL',
      zone_name: 'South Australia - Adelaide',
      supply_areas: 'Adelaide Metropolitan Area, Adelaide Hills',
      included_postcodes: '5000-5999',
      excluded_postcodes: '6000-6999',
    },
    {
      zone_code: 'TAS_HOB',
      zone_name: 'Tasmania - Hobart',
      supply_areas: 'Hobart Metropolitan Area, Southern Tasmania',
      included_postcodes: '7000-7999',
      excluded_postcodes: '8000-8999',
    },
  ];

  for (const zone of zones) {
    const existing = await dataSource.query(
      'SELECT * FROM zones WHERE zone_code = $1',
      [zone.zone_code],
    );

    if (existing.length === 0) {
      await dataSource.query(
        'INSERT INTO zones (zone_code, zone_name, supply_areas, included_postcodes, excluded_postcodes) VALUES ($1, $2, $3, $4, $5)',
        [
          zone.zone_code,
          zone.zone_name,
          zone.supply_areas,
          zone.included_postcodes,
          zone.excluded_postcodes,
        ],
      );
      console.log(`  ✓ Created zone: ${zone.zone_name}`);
    } else {
      console.log(`  - Zone already exists: ${zone.zone_name}`);
    }
  }
}

// async function seedBillingFrequencies(dataSource: DataSource) {
//   const billingFrequencies = [
//     { frequency_code: 'MONTHLY', frequency_name: 'Monthly Billing' },
//     { frequency_code: 'QUARTERLY', frequency_name: 'Quarterly Billing' },
//     { frequency_code: 'ANNUAL', frequency_name: 'Annual Billing' },
//     { frequency_code: 'BI_MONTHLY', frequency_name: 'Bi-Monthly Billing' },
//   ];

//   // for (const freq of billingFrequencies) {
//   //   const existing = await dataSource.query(
//   //     'SELECT * FROM billing_frequencies WHERE frequency_code = $1',
//   //     [freq.frequency_code],
//   //   );

//   //   if (existing.length === 0) {
//   //     await dataSource.query(
//   //       'INSERT INTO billing_frequencies (frequency_code, frequency_name) VALUES ($1, $2)',
//   //       [freq.frequency_code, freq.frequency_name],
//   //     );
//   //     console.log(`  ✓ Created billing frequency: ${freq.frequency_name}`);
//   //   } else {
//   //     console.log(
//   //       `  - Billing frequency already exists: ${freq.frequency_name}`,
//   //     );
//   //   }
//   // }
// }

async function seedRetailTariffs(dataSource: DataSource) {
  const retailTariffs = [
    {
      retail_tariff_code: 'RES_STD',
      retail_tariff_name: 'Standard Residential Tariff',
      distributor_id: 1,
      customer_type_id: 1,
    },
    {
      retail_tariff_code: 'RES_TOU',
      retail_tariff_name: 'Time of Use Tariff',
      distributor_id: 1,
      customer_type_id: 1,
    },
    {
      retail_tariff_code: 'SOLAR_FIT',
      retail_tariff_name: 'Solar Feed-in Tariff',
      distributor_id: 1,
      customer_type_id: 1,
    },
    {
      retail_tariff_code: 'COM_STD',
      retail_tariff_name: 'Commercial Standard Tariff',
      distributor_id: 1,
      customer_type_id: 2,
    },
    {
      retail_tariff_code: 'IND_PEAK',
      retail_tariff_name: 'Industrial Peak Tariff',
      distributor_id: 1,
      customer_type_id: 4,
    },
    {
      retail_tariff_code: 'EV_CHARGE',
      retail_tariff_name: 'EV Charging Tariff',
      distributor_id: 1,
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
          retail_tariff_code, retail_tariff_name, distributor_id, 
          customer_type_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [
          tariff.retail_tariff_code,
          tariff.retail_tariff_name,
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
      int_plan_code: 'RES001',
      ext_plan_code: 'EXT_RES001',
      plan_name: 'Residential Basic Plan',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      review_date: '2024-06-01',
      restricted: false,
      contingent: false,
      direct_debit_only: false,
      ebilling_only: false,
      solar_cust_only: false,
      ev_only: false,
      instrinct_green: false,
      eligibility_criteria: 'Residential customers only',
      price_variation_details: 'Price may vary based on market conditions',
      terms_and_conditions: 'Standard residential terms and conditions apply',
      contract_expiry_details: 'Contract expires after 12 months',
      fixed_rates: 'Fixed rates for 12 months',
      lowest_rps: 0.25,
      zone_id: 1,
      plan_type_id: 1,
      customer_type_id: 1,
      distributor_id: 1,
      rate_card_id: 1,
      contract_term_id: 1,
      bill_freq_id: 1,
      retail_tariff_id: 1,
    },
    {
      int_plan_code: 'RES002',
      ext_plan_code: 'EXT_RES002',
      plan_name: 'Residential Premium Plan',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      review_date: '2024-06-01',
      restricted: false,
      contingent: false,
      direct_debit_only: true,
      ebilling_only: true,
      solar_cust_only: false,
      ev_only: false,
      instrinct_green: true,
      eligibility_criteria:
        'Residential customers with direct debit and e-billing',
      price_variation_details: 'Premium pricing with green energy benefits',
      terms_and_conditions:
        'Premium residential terms with green energy benefits',
      contract_expiry_details: 'Contract expires after 24 months',
      fixed_rates: 'Fixed rates for 24 months',
      lowest_rps: 0.22,
      zone_id: 1,
      plan_type_id: 2,
      customer_type_id: 1,
      distributor_id: 1,
      rate_card_id: 2,
      contract_term_id: 2,
      bill_freq_id: 1,
      retail_tariff_id: 2,
    },
    {
      int_plan_code: 'SOLAR001',
      ext_plan_code: 'EXT_SOLAR001',
      plan_name: 'Solar Feed-in Tariff Plan',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      review_date: '2024-06-01',
      restricted: false,
      contingent: false,
      direct_debit_only: false,
      ebilling_only: false,
      solar_cust_only: true,
      ev_only: false,
      instrinct_green: true,
      eligibility_criteria: 'Customers with solar panel installations',
      price_variation_details: 'Feed-in tariff rates apply',
      terms_and_conditions: 'Solar feed-in tariff terms and conditions',
      contract_expiry_details: 'Contract expires after 12 months',
      fixed_rates: 'Feed-in tariff rates for 12 months',
      lowest_rps: 0.15,
      zone_id: 1,
      plan_type_id: 8,
      customer_type_id: 1,
      distributor_id: 1,
      rate_card_id: 3,
      contract_term_id: 1,
      bill_freq_id: 1,
      retail_tariff_id: 3,
    },
    {
      int_plan_code: 'COM001',
      ext_plan_code: 'EXT_COM001',
      plan_name: 'Commercial Small Business Plan',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      review_date: '2024-06-01',
      restricted: false,
      contingent: false,
      direct_debit_only: true,
      ebilling_only: true,
      solar_cust_only: false,
      ev_only: false,
      instrinct_green: false,
      eligibility_criteria: 'Small to medium commercial customers',
      price_variation_details: 'Commercial pricing structure',
      terms_and_conditions: 'Commercial terms and conditions',
      contract_expiry_details: 'Contract expires after 12 months',
      fixed_rates: 'Fixed rates for 12 months',
      lowest_rps: 0.2,
      zone_id: 1,
      plan_type_id: 4,
      customer_type_id: 2,
      distributor_id: 1,
      rate_card_id: 4,
      contract_term_id: 1,
      bill_freq_id: 1,
      retail_tariff_id: 4,
    },
    {
      int_plan_code: 'IND001',
      ext_plan_code: 'EXT_IND001',
      plan_name: 'Industrial Heavy Usage Plan',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      review_date: '2024-06-01',
      restricted: false,
      contingent: false,
      direct_debit_only: true,
      ebilling_only: true,
      solar_cust_only: false,
      ev_only: false,
      instrinct_green: false,
      eligibility_criteria: 'Industrial customers with high energy consumption',
      price_variation_details: 'Industrial pricing with volume discounts',
      terms_and_conditions: 'Industrial terms and conditions',
      contract_expiry_details: 'Contract expires after 24 months',
      fixed_rates: 'Fixed rates for 24 months with volume discounts',
      lowest_rps: 0.18,
      zone_id: 1,
      plan_type_id: 7,
      customer_type_id: 4,
      distributor_id: 1,
      rate_card_id: 6,
      contract_term_id: 2,
      bill_freq_id: 1,
      retail_tariff_id: 5,
    },
    {
      int_plan_code: 'EV001',
      ext_plan_code: 'EXT_EV001',
      plan_name: 'EV Charging Plan',
      effective_from: '2024-01-01',
      effective_to: '2024-12-31',
      review_date: '2024-06-01',
      restricted: false,
      contingent: false,
      direct_debit_only: false,
      ebilling_only: false,
      solar_cust_only: false,
      ev_only: true,
      instrinct_green: true,
      eligibility_criteria: 'Customers with electric vehicles',
      price_variation_details: 'EV charging rates with off-peak benefits',
      terms_and_conditions: 'EV charging terms and conditions',
      contract_expiry_details: 'Contract expires after 12 months',
      fixed_rates: 'EV charging rates for 12 months',
      lowest_rps: 0.12,
      zone_id: 1,
      plan_type_id: 9,
      customer_type_id: 1,
      distributor_id: 1,
      rate_card_id: 2,
      contract_term_id: 1,
      bill_freq_id: 1,
      retail_tariff_id: 6,
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
          int_plan_code, ext_plan_code, plan_name, effective_from, effective_to, 
          review_date, restricted, contingent, direct_debit_only, ebilling_only, 
          solar_cust_only, ev_only, instrinct_green, eligibility_criteria, 
          price_variation_details, terms_and_conditions, contract_expiry_details, 
          fixed_rates, lowest_rps, zone_id, plan_type_id, customer_type_id, 
          distributor_id, rate_card_id, contract_term_id, bill_freq_id, 
          retail_tariff_id, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, NOW(), NOW()
        )`,
        [
          plan.int_plan_code,
          plan.ext_plan_code,
          plan.plan_name,
          plan.effective_from,
          plan.effective_to,
          plan.review_date,
          plan.restricted,
          plan.contingent,
          plan.direct_debit_only,
          plan.ebilling_only,
          plan.solar_cust_only,
          plan.ev_only,
          plan.instrinct_green,
          plan.eligibility_criteria,
          plan.price_variation_details,
          plan.terms_and_conditions,
          plan.contract_expiry_details,
          plan.fixed_rates,
          plan.lowest_rps,
          plan.zone_id,
          plan.plan_type_id,
          plan.customer_type_id,
          plan.distributor_id,
          plan.rate_card_id,
          plan.contract_term_id,
          plan.bill_freq_id,
          plan.retail_tariff_id,
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
      billing_code_type: 'ENERGY',
      billing_code_type_name: 'Energy Consumption',
    },
    {
      billing_code_type: 'SERVICE',
      billing_code_type_name: 'Service Charges',
    },
    {
      billing_code_type: 'GREEN',
      billing_code_type_name: 'Green Energy',
    },
    {
      billing_code_type: 'NETWORK',
      billing_code_type_name: 'Network Charges',
    },
    {
      billing_code_type: 'RETAIL',
      billing_code_type_name: 'Retail Charges',
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
      charge_class_code: 'ENERGY',
      charge_class_name: 'Energy Charges',
      multiplier: 1,
    },
    {
      charge_class_code: 'SERVICE',
      charge_class_name: 'Service Charges',
      multiplier: 1,
    },
    {
      charge_class_code: 'NETWORK',
      charge_class_name: 'Network Charges',
      multiplier: 1,
    },
    {
      charge_class_code: 'RETAIL',
      charge_class_name: 'Retail Charges',
      multiplier: 1,
    },
    {
      charge_class_code: 'GREEN',
      charge_class_name: 'Green Energy Charges',
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
      charge_type_code: 'ENERGY_PEAK',
      charge_type_name: 'Peak Energy Rate',
      charge_class_id: 1,
    },
    {
      charge_type_code: 'ENERGY_OFF_PEAK',
      charge_type_name: 'Off-Peak Energy Rate',
      charge_class_id: 1,
    },
    {
      charge_type_code: 'ENERGY_SHOULDER',
      charge_type_name: 'Shoulder Energy Rate',
      charge_class_id: 1,
    },
    {
      charge_type_code: 'SERVICE_FIXED',
      charge_type_name: 'Fixed Service Charge',
      charge_class_id: 2,
    },
    {
      charge_type_code: 'SERVICE_DAILY',
      charge_type_name: 'Daily Service Charge',
      charge_class_id: 2,
    },
    {
      charge_type_code: 'NETWORK_DISTRIBUTION',
      charge_type_name: 'Distribution Network Charge',
      charge_class_id: 3,
    },
    {
      charge_type_code: 'NETWORK_TRANSMISSION',
      charge_type_name: 'Transmission Network Charge',
      charge_class_id: 3,
    },
    {
      charge_type_code: 'RETAIL_MARKETING',
      charge_type_name: 'Retail Marketing Charge',
      charge_class_id: 4,
    },
    {
      charge_type_code: 'GREEN_FEED_IN',
      charge_type_name: 'Green Energy Feed-in Tariff',
      charge_class_id: 5,
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
      charge_category_code: 'ENERGY_CONSUMPTION',
      charge_category_name: 'Energy Consumption',
      charge_class_id: 1,
    },
    {
      charge_category_code: 'SERVICE_DELIVERY',
      charge_category_name: 'Service Delivery',
      charge_class_id: 2,
    },
    {
      charge_category_code: 'NETWORK_ACCESS',
      charge_category_name: 'Network Access',
      charge_class_id: 3,
    },
    {
      charge_category_code: 'RETAIL_OPERATIONS',
      charge_category_name: 'Retail Operations',
      charge_class_id: 4,
    },
    {
      charge_category_code: 'GREEN_ENERGY',
      charge_category_name: 'Green Energy',
      charge_class_id: 5,
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
      charge_term_code: 'DAILY',
    },
    {
      charge_term_code: 'MONTHLY',
    },
    {
      charge_term_code: 'QUARTERLY',
    },
    {
      charge_term_code: 'ANNUAL',
    },
    {
      charge_term_code: 'PER_KWH',
    },
    {
      charge_term_code: 'PER_KVA',
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
      billing_code: 'ENERGY_001',
      billing_code_type_id: 1,
      plan_code: 'RES001',
    },
    {
      billing_code: 'SERVICE_001',
      billing_code_type_id: 2,
      plan_code: 'RES001',
    },
    {
      billing_code: 'ENERGY_002',
      billing_code_type_id: 1,
      plan_code: 'RES002',
    },
    {
      billing_code: 'GREEN_001',
      billing_code_type_id: 3,
      plan_code: 'RES002',
    },
    {
      billing_code: 'ENERGY_003',
      billing_code_type_id: 1,
      plan_code: 'SOLAR001',
    },
    {
      billing_code: 'GREEN_002',
      billing_code_type_id: 3,
      plan_code: 'SOLAR001',
    },
    {
      billing_code: 'ENERGY_004',
      billing_code_type_id: 1,
      plan_code: 'COM001',
    },
    {
      billing_code: 'SERVICE_002',
      billing_code_type_id: 2,
      plan_code: 'COM001',
    },
    {
      billing_code: 'ENERGY_005',
      billing_code_type_id: 1,
      plan_code: 'IND001',
    },
    {
      billing_code: 'NETWORK_001',
      billing_code_type_id: 4,
      plan_code: 'IND001',
    },
    {
      billing_code: 'ENERGY_006',
      billing_code_type_id: 1,
      plan_code: 'EV001',
    },
    {
      billing_code: 'GREEN_003',
      billing_code_type_id: 3,
      plan_code: 'EV001',
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
      charge_code: 'CHG_001',
      charge_description: 'Peak Energy Rate',
      charge_amount: 0.25,
      charge_perc: 0.0,
      greenpower_perc: 0.0,
      reference_01: 'PEAK_RATE',
      plan_code: 'RES001',
      charge_type_id: 1,
      charge_category_id: 1,
      charge_term_id: 5,
    },
    {
      charge_code: 'CHG_002',
      charge_description: 'Daily Service Charge',
      charge_amount: 1.2,
      charge_perc: 0.0,
      greenpower_perc: 0.0,
      reference_01: 'DAILY_SERVICE',
      plan_code: 'RES001',
      charge_type_id: 5,
      charge_category_id: 2,
      charge_term_id: 1,
    },
    {
      charge_code: 'CHG_003',
      charge_description: 'Off-Peak Energy Rate',
      charge_amount: 0.15,
      charge_perc: 0.0,
      greenpower_perc: 0.0,
      reference_01: 'OFF_PEAK_RATE',
      plan_code: 'RES002',
      charge_type_id: 2,
      charge_category_id: 1,
      charge_term_id: 5,
    },
    {
      charge_code: 'CHG_004',
      charge_description: 'Green Energy Premium',
      charge_amount: 0.05,
      charge_perc: 0.0,
      greenpower_perc: 100.0,
      reference_01: 'GREEN_PREMIUM',
      plan_code: 'RES002',
      charge_type_id: 9,
      charge_category_id: 5,
      charge_term_id: 5,
    },
    {
      charge_code: 'CHG_005',
      charge_description: 'Solar Feed-in Rate',
      charge_amount: 0.12,
      charge_perc: 0.0,
      greenpower_perc: 100.0,
      reference_01: 'SOLAR_FIT',
      plan_code: 'SOLAR001',
      charge_type_id: 9,
      charge_category_id: 5,
      charge_term_id: 5,
    },
    {
      charge_code: 'CHG_006',
      charge_description: 'Commercial Energy Rate',
      charge_amount: 0.2,
      charge_perc: 0.0,
      greenpower_perc: 0.0,
      reference_01: 'COM_RATE',
      plan_code: 'COM001',
      charge_type_id: 1,
      charge_category_id: 1,
      charge_term_id: 5,
    },
    {
      charge_code: 'CHG_007',
      charge_description: 'Commercial Service Charge',
      charge_amount: 2.5,
      charge_perc: 0.0,
      greenpower_perc: 0.0,
      reference_01: 'COM_SERVICE',
      plan_code: 'COM001',
      charge_type_id: 4,
      charge_category_id: 2,
      charge_term_id: 1,
    },
    {
      charge_code: 'CHG_008',
      charge_description: 'Industrial Peak Rate',
      charge_amount: 0.18,
      charge_perc: 0.0,
      greenpower_perc: 0.0,
      reference_01: 'IND_PEAK',
      plan_code: 'IND001',
      charge_type_id: 1,
      charge_category_id: 1,
      charge_term_id: 5,
    },
    {
      charge_code: 'CHG_009',
      charge_description: 'Network Distribution Charge',
      charge_amount: 0.08,
      charge_perc: 0.0,
      greenpower_perc: 0.0,
      reference_01: 'NET_DIST',
      plan_code: 'IND001',
      charge_type_id: 6,
      charge_category_id: 3,
      charge_term_id: 5,
    },
    {
      charge_code: 'CHG_010',
      charge_description: 'EV Charging Rate',
      charge_amount: 0.12,
      charge_perc: 0.0,
      greenpower_perc: 50.0,
      reference_01: 'EV_CHARGE',
      plan_code: 'EV001',
      charge_type_id: 1,
      charge_category_id: 1,
      charge_term_id: 5,
    },
    {
      charge_code: 'CHG_011',
      charge_description: 'Green Energy Component',
      charge_amount: 0.03,
      charge_perc: 0.0,
      greenpower_perc: 100.0,
      reference_01: 'GREEN_COMP',
      plan_code: 'EV001',
      charge_type_id: 9,
      charge_category_id: 5,
      charge_term_id: 5,
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

// Run the seeds
runSeeds().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
