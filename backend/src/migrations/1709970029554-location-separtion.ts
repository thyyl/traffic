import {MigrationInterface, QueryRunner} from "typeorm";

export class locationSepartion1709970029554 implements MigrationInterface {
    name = 'locationSepartion1709970029554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "longitude" integer`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "latitude" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "longitude"`);
    }

}
