import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditLog1758131182133 implements MigrationInterface {
  name = 'AuditLog1758131182133';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("id" SERIAL NOT NULL, "userId" character varying(50), "userName" character varying(100), "userEmail" character varying(255), "sessionId" character varying(100), "action" character varying(50) NOT NULL, "resource" character varying(100) NOT NULL, "resourceId" character varying(100), "oldValues" jsonb, "newValues" jsonb, "changes" jsonb, "ipAddress" character varying(45), "userAgent" character varying(500), "requestId" character varying(100), "method" character varying(10), "url" character varying(500), "statusCode" integer, "responseTime" integer, "level" character varying(20) NOT NULL, "message" text NOT NULL, "metadata" jsonb, "tags" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a3efbfd507134492f264a19b9c" ON "audit_logs" ("requestId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dd2b6e43c767b6b5b2bb227ace" ON "audit_logs" ("sessionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5fdb26e48c574b60fe41002519" ON "audit_logs" ("level", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5db7a2b9e2bd2563b2377c293c" ON "audit_logs" ("resource", "resourceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_235341a5f629c56a9f6e0f61c1" ON "audit_logs" ("action", "resource") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2254c368e04a5fbfe583f73638" ON "audit_logs" ("userId", "created_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2254c368e04a5fbfe583f73638"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_235341a5f629c56a9f6e0f61c1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5db7a2b9e2bd2563b2377c293c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5fdb26e48c574b60fe41002519"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dd2b6e43c767b6b5b2bb227ace"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a3efbfd507134492f264a19b9c"`,
    );
    await queryRunner.query(`DROP TABLE "audit_logs"`);
  }
}
