import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init31757525912589 implements MigrationInterface {
  name = 'Init31757525912589';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plan_types" DROP CONSTRAINT "UQ_722a3857d7736a1d65157f02f0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "zones" DROP CONSTRAINT "UQ_24b13294e53bbcbcd6d6eb68003"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fuel_types" DROP CONSTRAINT "UQ_a581df1be158adf73c4427abcc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tariff_types" DROP CONSTRAINT "UQ_433cd37c7a9a1628538d258470b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_categories" DROP CONSTRAINT "UQ_45b43a51dc434dddf59cfb2b66d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rates" DROP CONSTRAINT "UQ_ea6e5d9d96f87e58131462b030f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_classes" DROP CONSTRAINT "UQ_85ea7d9dd3139fc6f37d7685005"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_types" DROP CONSTRAINT "UQ_edd267ae01ae364de4f04355cd5"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rate_types" ADD CONSTRAINT "UQ_edd267ae01ae364de4f04355cd5" UNIQUE ("rate_type_code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_classes" ADD CONSTRAINT "UQ_85ea7d9dd3139fc6f37d7685005" UNIQUE ("rate_class_code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rates" ADD CONSTRAINT "UQ_ea6e5d9d96f87e58131462b030f" UNIQUE ("rate_code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rate_categories" ADD CONSTRAINT "UQ_45b43a51dc434dddf59cfb2b66d" UNIQUE ("rate_category_code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tariff_types" ADD CONSTRAINT "UQ_433cd37c7a9a1628538d258470b" UNIQUE ("tariff_type_code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fuel_types" ADD CONSTRAINT "UQ_a581df1be158adf73c4427abcc0" UNIQUE ("fuel_type_code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "zones" ADD CONSTRAINT "UQ_24b13294e53bbcbcd6d6eb68003" UNIQUE ("zone_code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_types" ADD CONSTRAINT "UQ_722a3857d7736a1d65157f02f0a" UNIQUE ("plan_type_code")`,
    );
  }
}
