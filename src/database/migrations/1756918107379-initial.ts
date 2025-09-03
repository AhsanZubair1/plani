import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1756918107379 implements MigrationInterface {
    name = 'Initial1756918107379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gc_cms_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" text NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone_number" character varying(20), "last_login" TIMESTAMP, "account_status" character varying(50) NOT NULL DEFAULT 'Active', "status" character varying(50), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "profile_picture" character varying, "is_active" boolean NOT NULL DEFAULT true, "sort_order" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_0bfcfd82e7868e6e3fae9c47503" UNIQUE ("email"), CONSTRAINT "PK_463731af6b3bf3e1c6954c8c75d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "state" ("state_id" SERIAL NOT NULL, "state_code" character varying(10) NOT NULL, "state_name" character varying(100) NOT NULL, CONSTRAINT "PK_c6c635621335b860a10c0763e78" PRIMARY KEY ("state_id"))`);
        await queryRunner.query(`CREATE TABLE "network_tariff_keys" ("network_tariff_key_id" SERIAL NOT NULL, "network_tariff_key_code" character varying(50) NOT NULL, CONSTRAINT "PK_12c7a0791b3fad3fd1adebddd0b" PRIMARY KEY ("network_tariff_key_id"))`);
        await queryRunner.query(`CREATE TABLE "ntc_relns" ("ntc_reln_id" SERIAL NOT NULL, "network_tariff_id" integer NOT NULL, "network_tariff_key_id" integer NOT NULL, CONSTRAINT "PK_2d2fbeb595072c0c60c4bee07fe" PRIMARY KEY ("ntc_reln_id"))`);
        await queryRunner.query(`CREATE TABLE "network_tariffs" ("network_tariff_id" SERIAL NOT NULL, "network_tariff_code" character varying(50) NOT NULL, "usage" boolean NOT NULL DEFAULT false, "demand" boolean NOT NULL DEFAULT false, "controlled_load" boolean NOT NULL DEFAULT false, "solar" boolean NOT NULL DEFAULT false, "distributor_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6ed65993611a71d2ce3f92a1edd" PRIMARY KEY ("network_tariff_id"))`);
        await queryRunner.query(`CREATE TABLE "distributors" ("distributor_id" SERIAL NOT NULL, "distributor_code" character varying(50) NOT NULL, "distributor_name" character varying(255) NOT NULL, "mirn_prefix" character varying(10) NOT NULL, "state_id" integer NOT NULL, CONSTRAINT "PK_593e567ed501d21c9c297f4dc7f" PRIMARY KEY ("distributor_id"))`);
        await queryRunner.query(`CREATE TABLE "customer_types" ("customer_type_id" SERIAL NOT NULL, "customer_type_code" character varying(50) NOT NULL, "customer_type_name" character varying(255) NOT NULL, CONSTRAINT "PK_23d467ed391efb085b339347d7e" PRIMARY KEY ("customer_type_id"))`);
        await queryRunner.query(`CREATE TABLE "retail_tariffs" ("retail_tariff_id" SERIAL NOT NULL, "retail_tariff_code" character varying(50) NOT NULL, "retail_tariff_name" character varying(255) NOT NULL, "sacl_flag" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT true, "distributor_id" integer NOT NULL, "customer_type_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9abb7c5ad24ce9578525dde8eb0" PRIMARY KEY ("retail_tariff_id"))`);
        await queryRunner.query(`CREATE TABLE "retail_ntc_key_relns" ("retail_ntc_reln_id" SERIAL NOT NULL, "retail_tariff_id" integer NOT NULL, "network_tariff_key_id" integer NOT NULL, CONSTRAINT "PK_d2187bcbc1a555edfdc28054a47" PRIMARY KEY ("retail_ntc_reln_id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_30e98e8746699fb9af235410af" ON "session" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "fuel_types" ("fuel_type_id" SERIAL NOT NULL, "fuel_type_code" character varying(10) NOT NULL, "fuel_type_name" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a581df1be158adf73c4427abcc0" UNIQUE ("fuel_type_code"), CONSTRAINT "PK_fda4367c7d61155d7a3b33988b9" PRIMARY KEY ("fuel_type_id"))`);
        await queryRunner.query(`CREATE TABLE "tariff_types" ("tariff_type_id" SERIAL NOT NULL, "tariff_type_code" character varying(20) NOT NULL, "tariff_type_name" character varying(100) NOT NULL, "time_definition" character varying(100) NOT NULL, "fuel_type_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_433cd37c7a9a1628538d258470b" UNIQUE ("tariff_type_code"), CONSTRAINT "PK_d8d1de892e7e01516fb7b2ca4e1" PRIMARY KEY ("tariff_type_id"))`);
        await queryRunner.query(`CREATE TABLE "rate_cards" ("rate_card_id" SERIAL NOT NULL, "rate_card_name" character varying(255) NOT NULL, "underlying_nt_type" character varying(50) NOT NULL, "tariff_type_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9d8ad628a473c865364ee336e3b" PRIMARY KEY ("rate_card_id"))`);
        await queryRunner.query(`CREATE TABLE "rate_categories" ("rate_category_id" SERIAL NOT NULL, "rate_category_code" character varying(20) NOT NULL, "rate_category_name" character varying(100) NOT NULL, "allow_multi_seasons" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_45b43a51dc434dddf59cfb2b66d" UNIQUE ("rate_category_code"), CONSTRAINT "PK_f31c4079f1748cba20f354f809b" PRIMARY KEY ("rate_category_id"))`);
        await queryRunner.query(`CREATE TABLE "rates" ("rate_id" SERIAL NOT NULL, "rate_code" character varying(20) NOT NULL, "rate_name" character varying(100) NOT NULL, "rate_category_id" integer NOT NULL, "rate_card_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ea6e5d9d96f87e58131462b030f" UNIQUE ("rate_code"), CONSTRAINT "PK_d7364083d5182bb16da1ca51a87" PRIMARY KEY ("rate_id"))`);
        await queryRunner.query(`CREATE TABLE "rate_classes" ("rate_class_id" SERIAL NOT NULL, "rate_class_code" character varying(20) NOT NULL, "rate_class_name" character varying(100) NOT NULL, "validate_24_hour_timing" boolean NOT NULL DEFAULT false, "multiplier" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_85ea7d9dd3139fc6f37d7685005" UNIQUE ("rate_class_code"), CONSTRAINT "PK_7a72412200c035badf005b54541" PRIMARY KEY ("rate_class_id"))`);
        await queryRunner.query(`CREATE TABLE "rate_types" ("rate_type_id" SERIAL NOT NULL, "rate_type_code" character varying(20) NOT NULL, "rate_type_name" character varying(100) NOT NULL, "has_timings" boolean NOT NULL DEFAULT false, "rate_class_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_edd267ae01ae364de4f04355cd5" UNIQUE ("rate_type_code"), CONSTRAINT "PK_1f342e2ef9431881e5d7c44fc48" PRIMARY KEY ("rate_type_id"))`);
        await queryRunner.query(`CREATE TABLE "rate_seasons" ("rate_season_id" SERIAL NOT NULL, "season_code" character varying(20) NOT NULL, "season_name" character varying(100) NOT NULL, "effective_from" date NOT NULL, "effective_to" date NOT NULL, "daily_charge" numeric(10,6) NOT NULL, "rate_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4905d05920b2cc332c18d38740c" PRIMARY KEY ("rate_season_id"))`);
        await queryRunner.query(`CREATE TABLE "plans" ("plan_id" SERIAL NOT NULL, "int_plan_code" character varying(50) NOT NULL, "ext_plan_code" character varying(50) NOT NULL, "plan_name" character varying(255) NOT NULL, "effective_from" date NOT NULL, "effective_to" date NOT NULL, "review_date" date NOT NULL, "restricted" boolean NOT NULL DEFAULT false, "contingent" boolean NOT NULL DEFAULT false, "direct_debit_only" boolean NOT NULL DEFAULT false, "ebilling_only" boolean NOT NULL DEFAULT false, "solar_cust_only" boolean NOT NULL DEFAULT false, "ev_only" boolean NOT NULL DEFAULT false, "instrinct_green" boolean NOT NULL DEFAULT false, "eligibility_criteria" character varying(500) NOT NULL, "price_variation_details" character varying(500) NOT NULL, "terms_and_conditions" text NOT NULL, "contract_expiry_details" character varying(500) NOT NULL, "fixed_rates" character varying(500) NOT NULL, "lowest_rps" numeric(10,2) NOT NULL, "zone_id" integer NOT NULL, "plan_type_id" integer NOT NULL, "customer_type_id" integer NOT NULL, "distributor_id" integer NOT NULL, "rate_card_id" integer NOT NULL, "contract_term_id" integer NOT NULL, "bill_freq_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_084714de33798c5b96f12725f7e" PRIMARY KEY ("plan_id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, "type" character varying NOT NULL, "user_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ntc_relns" ADD CONSTRAINT "FK_98b8be76df3322f6bf93a9417c5" FOREIGN KEY ("network_tariff_id") REFERENCES "network_tariffs"("network_tariff_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ntc_relns" ADD CONSTRAINT "FK_db7da37c4ca0d0d18ad991ae915" FOREIGN KEY ("network_tariff_key_id") REFERENCES "network_tariff_keys"("network_tariff_key_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "network_tariffs" ADD CONSTRAINT "FK_dac485d5da4251cc15aa7d0d4ad" FOREIGN KEY ("distributor_id") REFERENCES "distributors"("distributor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "distributors" ADD CONSTRAINT "FK_86f1e4a42fa1a3840f004529e63" FOREIGN KEY ("state_id") REFERENCES "state"("state_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "retail_tariffs" ADD CONSTRAINT "FK_28268ce38ae7d936e7626318e52" FOREIGN KEY ("distributor_id") REFERENCES "distributors"("distributor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "retail_tariffs" ADD CONSTRAINT "FK_4d0fb0dab3cbfd161efa612230e" FOREIGN KEY ("customer_type_id") REFERENCES "customer_types"("customer_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "retail_ntc_key_relns" ADD CONSTRAINT "FK_8d99c43b3c55d8acd230aa768c6" FOREIGN KEY ("retail_tariff_id") REFERENCES "retail_tariffs"("retail_tariff_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "retail_ntc_key_relns" ADD CONSTRAINT "FK_4344b1ffb74e4878d8ca26c6886" FOREIGN KEY ("network_tariff_key_id") REFERENCES "network_tariff_keys"("network_tariff_key_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "gc_cms_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tariff_types" ADD CONSTRAINT "FK_7362c18d296c332e4b0cb886384" FOREIGN KEY ("fuel_type_id") REFERENCES "fuel_types"("fuel_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rate_cards" ADD CONSTRAINT "FK_69b56d7783fc93db601d7f43832" FOREIGN KEY ("tariff_type_id") REFERENCES "tariff_types"("tariff_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rates" ADD CONSTRAINT "FK_ae702d9e018d5546c38d83169a3" FOREIGN KEY ("rate_category_id") REFERENCES "rate_categories"("rate_category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rates" ADD CONSTRAINT "FK_fd903bc023ba6fa1de55502e706" FOREIGN KEY ("rate_card_id") REFERENCES "rate_cards"("rate_card_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rate_types" ADD CONSTRAINT "FK_bcbb31c9d0a916e28e7fc4bdca1" FOREIGN KEY ("rate_class_id") REFERENCES "rate_classes"("rate_class_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rate_seasons" ADD CONSTRAINT "FK_92618de0d2968268eb1bd11474d" FOREIGN KEY ("rate_id") REFERENCES "rates"("rate_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plans" ADD CONSTRAINT "FK_4d32323c3cf93c4290ca5d051d0" FOREIGN KEY ("rate_card_id") REFERENCES "rate_cards"("rate_card_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_516f1cf15166fd07b732b4b6ab0" FOREIGN KEY ("user_id") REFERENCES "gc_cms_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_516f1cf15166fd07b732b4b6ab0"`);
        await queryRunner.query(`ALTER TABLE "plans" DROP CONSTRAINT "FK_4d32323c3cf93c4290ca5d051d0"`);
        await queryRunner.query(`ALTER TABLE "rate_seasons" DROP CONSTRAINT "FK_92618de0d2968268eb1bd11474d"`);
        await queryRunner.query(`ALTER TABLE "rate_types" DROP CONSTRAINT "FK_bcbb31c9d0a916e28e7fc4bdca1"`);
        await queryRunner.query(`ALTER TABLE "rates" DROP CONSTRAINT "FK_fd903bc023ba6fa1de55502e706"`);
        await queryRunner.query(`ALTER TABLE "rates" DROP CONSTRAINT "FK_ae702d9e018d5546c38d83169a3"`);
        await queryRunner.query(`ALTER TABLE "rate_cards" DROP CONSTRAINT "FK_69b56d7783fc93db601d7f43832"`);
        await queryRunner.query(`ALTER TABLE "tariff_types" DROP CONSTRAINT "FK_7362c18d296c332e4b0cb886384"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`);
        await queryRunner.query(`ALTER TABLE "retail_ntc_key_relns" DROP CONSTRAINT "FK_4344b1ffb74e4878d8ca26c6886"`);
        await queryRunner.query(`ALTER TABLE "retail_ntc_key_relns" DROP CONSTRAINT "FK_8d99c43b3c55d8acd230aa768c6"`);
        await queryRunner.query(`ALTER TABLE "retail_tariffs" DROP CONSTRAINT "FK_4d0fb0dab3cbfd161efa612230e"`);
        await queryRunner.query(`ALTER TABLE "retail_tariffs" DROP CONSTRAINT "FK_28268ce38ae7d936e7626318e52"`);
        await queryRunner.query(`ALTER TABLE "distributors" DROP CONSTRAINT "FK_86f1e4a42fa1a3840f004529e63"`);
        await queryRunner.query(`ALTER TABLE "network_tariffs" DROP CONSTRAINT "FK_dac485d5da4251cc15aa7d0d4ad"`);
        await queryRunner.query(`ALTER TABLE "ntc_relns" DROP CONSTRAINT "FK_db7da37c4ca0d0d18ad991ae915"`);
        await queryRunner.query(`ALTER TABLE "ntc_relns" DROP CONSTRAINT "FK_98b8be76df3322f6bf93a9417c5"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "plans"`);
        await queryRunner.query(`DROP TABLE "rate_seasons"`);
        await queryRunner.query(`DROP TABLE "rate_types"`);
        await queryRunner.query(`DROP TABLE "rate_classes"`);
        await queryRunner.query(`DROP TABLE "rates"`);
        await queryRunner.query(`DROP TABLE "rate_categories"`);
        await queryRunner.query(`DROP TABLE "rate_cards"`);
        await queryRunner.query(`DROP TABLE "tariff_types"`);
        await queryRunner.query(`DROP TABLE "fuel_types"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_30e98e8746699fb9af235410af"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "retail_ntc_key_relns"`);
        await queryRunner.query(`DROP TABLE "retail_tariffs"`);
        await queryRunner.query(`DROP TABLE "customer_types"`);
        await queryRunner.query(`DROP TABLE "distributors"`);
        await queryRunner.query(`DROP TABLE "network_tariffs"`);
        await queryRunner.query(`DROP TABLE "ntc_relns"`);
        await queryRunner.query(`DROP TABLE "network_tariff_keys"`);
        await queryRunner.query(`DROP TABLE "state"`);
        await queryRunner.query(`DROP TABLE "gc_cms_users"`);
    }

}
