import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCampaignTables1757535054162 implements MigrationInterface {
  name = 'AddCampaignTables1757535054162';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create campaign_status table
    await queryRunner.query(
      `CREATE TABLE "campaign_status" (
        "campaign_status_id" SERIAL NOT NULL,
        "campaign_status_code" character varying(50) NOT NULL,
        "campaign_status_name" character varying(100) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_campaign_status" PRIMARY KEY ("campaign_status_id")
      )`,
    );

    // Create channel table
    await queryRunner.query(
      `CREATE TABLE "channel" (
        "channel_id" SERIAL NOT NULL,
        "channel_code" character varying(50) NOT NULL,
        "channel_name" character varying(100) NOT NULL,
        "active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_channel" PRIMARY KEY ("channel_id")
      )`,
    );

    // Create campaign table
    await queryRunner.query(
      `CREATE TABLE "campaign" (
        "campaign_id" SERIAL NOT NULL,
        "campaign_code" character varying(50) NOT NULL,
        "campaign_name" character varying(255) NOT NULL,
        "campaign_desc" text,
        "effective_from" date NOT NULL,
        "effective_to" date,
        "campaign_status_id" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_campaign" PRIMARY KEY ("campaign_id")
      )`,
    );

    // Create campaign_channel_reln table
    await queryRunner.query(
      `CREATE TABLE "campaign_channel_reln" (
        "campaign_channel_reln_id" SERIAL NOT NULL,
        "campaign_id" integer NOT NULL,
        "channel_id" integer NOT NULL,
        "effective_from" date NOT NULL,
        "effective_to" date,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_campaign_channel_reln" PRIMARY KEY ("campaign_channel_reln_id")
      )`,
    );

    // Create campaign_plan_reln table
    await queryRunner.query(
      `CREATE TABLE "campaign_plan_reln" (
        "campaign_plan_id" SERIAL NOT NULL,
        "campaign_id" integer NOT NULL,
        "plan_id" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_campaign_plan_reln" PRIMARY KEY ("campaign_plan_id")
      )`,
    );

    // Add foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "campaign" ADD CONSTRAINT "FK_campaign_status" FOREIGN KEY ("campaign_status_id") REFERENCES "campaign_status"("campaign_status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" ADD CONSTRAINT "FK_campaign_channel_campaign" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("campaign_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" ADD CONSTRAINT "FK_campaign_channel_channel" FOREIGN KEY ("channel_id") REFERENCES "channel"("channel_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" ADD CONSTRAINT "FK_campaign_plan_campaign" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("campaign_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" ADD CONSTRAINT "FK_campaign_plan_plan" FOREIGN KEY ("plan_id") REFERENCES "plans"("plan_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Insert default campaign statuses
    await queryRunner.query(
      `INSERT INTO "campaign_status" ("campaign_status_code", "campaign_status_name") VALUES 
        ('DRAFT', 'Draft'),
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled')`,
    );

    // Insert default channels
    await queryRunner.query(
      `INSERT INTO "channel" ("channel_code", "channel_name", "active") VALUES 
        ('EMAIL', 'Email', true),
        ('SMS', 'SMS', true),
        ('PHONE', 'Phone', true),
        ('WEB', 'Web', true),
        ('SOCIAL', 'Social Media', true)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" DROP CONSTRAINT "FK_campaign_plan_plan"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_plan_reln" DROP CONSTRAINT "FK_campaign_plan_campaign"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" DROP CONSTRAINT "FK_campaign_channel_channel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_channel_reln" DROP CONSTRAINT "FK_campaign_channel_campaign"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign" DROP CONSTRAINT "FK_campaign_status"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "campaign_plan_reln"`);
    await queryRunner.query(`DROP TABLE "campaign_channel_reln"`);
    await queryRunner.query(`DROP TABLE "campaign"`);
    await queryRunner.query(`DROP TABLE "channel"`);
    await queryRunner.query(`DROP TABLE "campaign_status"`);
  }
}
