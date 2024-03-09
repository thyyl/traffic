import {MigrationInterface, QueryRunner} from "typeorm";

export class locationSepartion1709970419882 implements MigrationInterface {
    name = 'locationSepartion1709970419882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "longitude" double precision`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "latitude" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "latitude" integer`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "longitude" integer`);
    }

}
