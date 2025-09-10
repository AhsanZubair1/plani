import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init21757525170923 implements MigrationInterface {
  name = 'Init21757525170923';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tariff_types" DROP COLUMN "time_definition"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" DROP COLUMN "billing_cycle_days"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" DROP COLUMN "due_date_offset_days"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" DROP COLUMN "has_time_based_rates"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" DROP COLUMN "default_rate_per_kwh"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" DROP COLUMN "default_supply_charge_per_day"`,
    );
    await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "billing_code"`);
    await queryRunner.query(
      `ALTER TABLE "plans" DROP COLUMN "billing_code_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" DROP COLUMN "billing_frequency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" DROP COLUMN "rate_structure_description"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "rate_structure_description" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "billing_frequency" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "billing_code_type" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "billing_code" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "default_supply_charge_per_day" numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "default_rate_per_kwh" numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "has_time_based_rates" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "due_date_offset_days" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "billing_cycle_days" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "tariff_types" ADD "time_definition" character varying(100) NOT NULL`,
    );
  }
}
