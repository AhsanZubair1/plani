import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePlanType1756918945748 implements MigrationInterface {
  name = 'UpdatePlanType1756918945748';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "plan_types" ("plan_type_id" SERIAL NOT NULL, "plan_type_code" character varying(50) NOT NULL, "plan_type_name" character varying(100) NOT NULL, CONSTRAINT "UQ_722a3857d7736a1d65157f02f0a" UNIQUE ("plan_type_code"), CONSTRAINT "PK_efa08be4d37d5bab42b2da3ceaa" PRIMARY KEY ("plan_type_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "zones" ("zone_id" SERIAL NOT NULL, "zone_code" character varying(50) NOT NULL, "zone_name" character varying(100) NOT NULL, "supply_areas" text, "included_postcodes" text, "excluded_postcodes" text, CONSTRAINT "UQ_24b13294e53bbcbcd6d6eb68003" UNIQUE ("zone_code"), CONSTRAINT "PK_b536906901e675e2e30fe819542" PRIMARY KEY ("zone_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD CONSTRAINT "FK_b5ac348ffd0099f35bb527c2ad1" FOREIGN KEY ("plan_type_id") REFERENCES "plan_types"("plan_type_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD CONSTRAINT "FK_51af64e74bc4924f926133b0dbf" FOREIGN KEY ("zone_id") REFERENCES "zones"("zone_id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" DROP CONSTRAINT "FK_51af64e74bc4924f926133b0dbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" DROP CONSTRAINT "FK_b5ac348ffd0099f35bb527c2ad1"`,
    );
    await queryRunner.query(`DROP TABLE "zones"`);
    await queryRunner.query(`DROP TABLE "plan_types"`);
  }
}
