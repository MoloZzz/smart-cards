import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitEntities1740487707907 implements MigrationInterface {
    name = 'InitEntities1740487707907';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cards_rarity_enum" AS ENUM('common', 'rare', 'epic', 'legendary')`);
        await queryRunner.query(`CREATE TYPE "public"."cards_status_enum" AS ENUM('available', 'in_auction', 'sold')`);
        await queryRunner.query(
            `CREATE TABLE "cards" ("card_id" SERIAL NOT NULL, "name" character varying NOT NULL, "rarity" "public"."cards_rarity_enum" NOT NULL DEFAULT 'common', "image_path" character varying NOT NULL, "owner_id" integer NOT NULL, "status" "public"."cards_status_enum" NOT NULL DEFAULT 'available', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "owner_id_id" integer, CONSTRAINT "PK_0feb2239f0c3b16c38cb62129c7" PRIMARY KEY ("card_id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "bids" ("bid_id" SERIAL NOT NULL, "auction_id" integer NOT NULL, "bidder_id" integer NOT NULL, "bid_amount" numeric(15,2) NOT NULL, "bid_time" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7729bc1896e2c415e5e4a5091a7" PRIMARY KEY ("bid_id"))`,
        );
        await queryRunner.query(`CREATE TYPE "public"."auctions_status_enum" AS ENUM('active', 'closed', 'cancelled')`);
        await queryRunner.query(
            `CREATE TABLE "auctions" ("auction_id" SERIAL NOT NULL, "card_id" integer NOT NULL, "seller_id" integer NOT NULL, "start_price" numeric(15,2) NOT NULL, "current_price" numeric(15,2), "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "status" "public"."auctions_status_enum" NOT NULL DEFAULT 'active', "winner_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_33432201c6864242fa980ab4a35" UNIQUE ("card_id"), CONSTRAINT "PK_18188c6a9d4178a772ef7e4b8c5" PRIMARY KEY ("auction_id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."wallet_transactions_type_enum" AS ENUM('purchase', 'sale', 'lottery', 'transfer')`,
        );
        await queryRunner.query(
            `CREATE TABLE "wallet_transactions" ("transaction_id" SERIAL NOT NULL, "sender_id" integer, "receiver_id" integer, "amount" numeric(15,2) NOT NULL, "type" "public"."wallet_transactions_type_enum" NOT NULL DEFAULT 'transfer', "related_auction_id" integer, "related_card_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_abc0cee75960435ca92bbdc8ff6" PRIMARY KEY ("transaction_id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("user_id" SERIAL NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "wallet_address" character varying NOT NULL, "balance" numeric(15,2) NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "failed_login_attempts" smallint NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "locked_date" TIMESTAMP, "last_login_date" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "cards" ADD CONSTRAINT "FK_f4cadf94cea7a8ed4e9083b7de0" FOREIGN KEY ("owner_id_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "cards" ADD CONSTRAINT "FK_af6aad89f759b9efecbb7e2e593" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "bids" ADD CONSTRAINT "FK_7d24f04e55838b694acc9d35bfe" FOREIGN KEY ("auction_id") REFERENCES "auctions"("auction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "bids" ADD CONSTRAINT "FK_bc7e4d3d2bdc4c8d9695938d8e4" FOREIGN KEY ("bidder_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "auctions" ADD CONSTRAINT "FK_33432201c6864242fa980ab4a35" FOREIGN KEY ("card_id") REFERENCES "cards"("card_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "auctions" ADD CONSTRAINT "FK_0cc14a58a02d6cf816e906d2c6b" FOREIGN KEY ("seller_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "auctions" ADD CONSTRAINT "FK_01f10a0683ea2e257d66b086b9f" FOREIGN KEY ("winner_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_fe71d9d868a527f2f25cb928601" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_17cfacdbf6c3519cf2d39b870f2" FOREIGN KEY ("receiver_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_8cfefe20e40fb37eb4519ffffa5" FOREIGN KEY ("related_auction_id") REFERENCES "auctions"("auction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_8ff8c2ca83d172d3fe20a0109e3" FOREIGN KEY ("related_card_id") REFERENCES "cards"("card_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_8ff8c2ca83d172d3fe20a0109e3"`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_8cfefe20e40fb37eb4519ffffa5"`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_17cfacdbf6c3519cf2d39b870f2"`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_fe71d9d868a527f2f25cb928601"`);
        await queryRunner.query(`ALTER TABLE "auctions" DROP CONSTRAINT "FK_01f10a0683ea2e257d66b086b9f"`);
        await queryRunner.query(`ALTER TABLE "auctions" DROP CONSTRAINT "FK_0cc14a58a02d6cf816e906d2c6b"`);
        await queryRunner.query(`ALTER TABLE "auctions" DROP CONSTRAINT "FK_33432201c6864242fa980ab4a35"`);
        await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_bc7e4d3d2bdc4c8d9695938d8e4"`);
        await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_7d24f04e55838b694acc9d35bfe"`);
        await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_af6aad89f759b9efecbb7e2e593"`);
        await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_f4cadf94cea7a8ed4e9083b7de0"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "wallet_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "auctions"`);
        await queryRunner.query(`DROP TYPE "public"."auctions_status_enum"`);
        await queryRunner.query(`DROP TABLE "bids"`);
        await queryRunner.query(`DROP TABLE "cards"`);
        await queryRunner.query(`DROP TYPE "public"."cards_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cards_rarity_enum"`);
    }
}
