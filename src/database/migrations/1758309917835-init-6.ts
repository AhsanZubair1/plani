import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init61758309917835 implements MigrationInterface {
  name = 'Init61758309917835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD "responseData" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP COLUMN "responseData"`,
    );
  }
}
