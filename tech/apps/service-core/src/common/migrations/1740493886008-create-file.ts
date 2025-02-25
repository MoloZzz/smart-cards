import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFile1740493886008 implements MigrationInterface {
    name = 'CreateFile1740493886008';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "files" ("card_id" SERIAL NOT NULL, "file_key" character varying NOT NULL, "original_name" character varying NOT NULL, "original_full_name" character varying NOT NULL, "mimetype" character varying, "extension" character varying, "size" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_user_id" integer, CONSTRAINT "UQ_9a02ba48ab7537f785bdc47b7b6" UNIQUE ("file_key"), CONSTRAINT "PK_e59bf73b0b387ece3209a6ac013" PRIMARY KEY ("card_id")); COMMENT ON COLUMN "files"."card_id" IS 'Ідентифікатор в СУББ'; COMMENT ON COLUMN "files"."file_key" IS 'Ключ файлу'; COMMENT ON COLUMN "files"."original_name" IS 'Оригінальна назва'; COMMENT ON COLUMN "files"."original_full_name" IS 'Повна оригінальна назва'; COMMENT ON COLUMN "files"."mimetype" IS 'Формат файлу'; COMMENT ON COLUMN "files"."extension" IS 'Розширення файлу'; COMMENT ON COLUMN "files"."size" IS 'Розмір файлу'; COMMENT ON COLUMN "files"."created_at" IS 'Дата створення'; COMMENT ON COLUMN "files"."created_user_id" IS 'Користувач який створив'`,
        );
        await queryRunner.query(`COMMENT ON TABLE "files" IS 'Мета дані файлів'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON TABLE "files" IS NULL`);
        await queryRunner.query(`DROP TABLE "files"`);
    }
}
