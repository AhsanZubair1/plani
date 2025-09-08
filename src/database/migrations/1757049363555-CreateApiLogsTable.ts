import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApiLogsTable1757049363555 implements MigrationInterface {
    name = 'CreateApiLogsTable1757049363555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_logs" ("id" SERIAL NOT NULL, "method" character varying(10) NOT NULL, "url" character varying(500) NOT NULL, "user_id" character varying(50), "ip_address" character varying(45), "user_agent" character varying(500), "status_code" integer NOT NULL, "response_time_ms" integer NOT NULL, "request_body" text, "response_body" text, "error_message" text, "controller" character varying(100), "action" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ea3f2ad34a2921407593ff4425b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_14968beefa90d7382bfcde82ad" ON "api_logs" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_4eb0f23e0693ad4fec007956db" ON "api_logs" ("status_code") `);
        await queryRunner.query(`CREATE INDEX "IDX_728a0edcc49219ad69e8d0312b" ON "api_logs" ("method", "url") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_728a0edcc49219ad69e8d0312b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4eb0f23e0693ad4fec007956db"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_14968beefa90d7382bfcde82ad"`);
        await queryRunner.query(`DROP TABLE "api_logs"`);
    }

}
