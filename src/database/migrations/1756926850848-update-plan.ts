import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePlan1756926850848 implements MigrationInterface {
  name = 'UpdatePlan1756926850848';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" ADD CONSTRAINT "FK_5ec47f34a4a49dd15cea40392fd" FOREIGN KEY ("distributor_id") REFERENCES "distributors"("distributor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD CONSTRAINT "FK_36fa24d547470d2533471ad0880" FOREIGN KEY ("customer_type_id") REFERENCES "customer_types"("customer_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" DROP CONSTRAINT "FK_36fa24d547470d2533471ad0880"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" DROP CONSTRAINT "FK_5ec47f34a4a49dd15cea40392fd"`,
    );
  }
}
