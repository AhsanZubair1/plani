import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init41757703364705 implements MigrationInterface {
  name = 'Init41757703364705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" DROP CONSTRAINT "FK_campaign_channel_channel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" DROP CONSTRAINT "FK_campaign_channel_campaign"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign" DROP CONSTRAINT "FK_campaign_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" DROP CONSTRAINT "FK_campaign_plan_plan"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" DROP CONSTRAINT "FK_campaign_plan_campaign"`,
    );
    await queryRunner.query(
      `CREATE TABLE "billing_code_type" ("billing_code_type_id" SERIAL NOT NULL, "billing_code_type" character varying(255) NOT NULL, "billing_code_type_name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3820589defac674907fd3c04cde" PRIMARY KEY ("billing_code_type_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "billing_code" ("billing_code_id" SERIAL NOT NULL, "billing_code" character varying(255) NOT NULL, "billing_code_type_id" integer, "plan_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1abfc399f6ac6495bec607a309" PRIMARY KEY ("billing_code_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" ADD CONSTRAINT "FK_39f1414847e6d4920227a9ad123" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("campaign_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" ADD CONSTRAINT "FK_c8afc321ebce7978aed2542d05f" FOREIGN KEY ("channel_id") REFERENCES "channel"("channel_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign" ADD CONSTRAINT "FK_e362e45d79cbd24546aac62b927" FOREIGN KEY ("campaign_status_id") REFERENCES "campaign_status"("campaign_status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" ADD CONSTRAINT "FK_6d6427c9e25146536c047cc7129" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("campaign_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" ADD CONSTRAINT "FK_a86a31f6149305eee68fd6f999d" FOREIGN KEY ("plan_id") REFERENCES "plans"("plan_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_code" ADD CONSTRAINT "FK_5c945d357d53ab4b798d49e3921" FOREIGN KEY ("billing_code_type_id") REFERENCES "billing_code_type"("billing_code_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_code" ADD CONSTRAINT "FK_6e04d958551c434288d77dc1ca0" FOREIGN KEY ("plan_id") REFERENCES "plans"("plan_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "billing_code" DROP CONSTRAINT "FK_6e04d958551c434288d77dc1ca0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_code" DROP CONSTRAINT "FK_5c945d357d53ab4b798d49e3921"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" DROP CONSTRAINT "FK_a86a31f6149305eee68fd6f999d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" DROP CONSTRAINT "FK_6d6427c9e25146536c047cc7129"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign" DROP CONSTRAINT "FK_e362e45d79cbd24546aac62b927"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" DROP CONSTRAINT "FK_c8afc321ebce7978aed2542d05f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" DROP CONSTRAINT "FK_39f1414847e6d4920227a9ad123"`,
    );
    await queryRunner.query(`DROP TABLE "billing_code"`);
    await queryRunner.query(`DROP TABLE "billing_code_type"`);
    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" ADD CONSTRAINT "FK_campaign_plan_campaign" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("campaign_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" ADD CONSTRAINT "FK_campaign_plan_plan" FOREIGN KEY ("plan_id") REFERENCES "plans"("plan_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign" ADD CONSTRAINT "FK_campaign_status" FOREIGN KEY ("campaign_status_id") REFERENCES "campaign_status"("campaign_status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" ADD CONSTRAINT "FK_campaign_channel_campaign" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("campaign_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" ADD CONSTRAINT "FK_campaign_channel_channel" FOREIGN KEY ("channel_id") REFERENCES "channel"("channel_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
