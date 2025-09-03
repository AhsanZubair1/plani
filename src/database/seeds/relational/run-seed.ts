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

    // Seed Plans
    console.log('📊 Seeding Plans...');
    await seedPlans(dataSource);

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
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, NOW(), NOW()
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
        ],
      );
      console.log(`  ✓ Created plan: ${plan.plan_name}`);
    } else {
      console.log(`  - Plan already exists: ${plan.plan_name}`);
    }
  }
}

// Run the seeds
runSeeds().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
