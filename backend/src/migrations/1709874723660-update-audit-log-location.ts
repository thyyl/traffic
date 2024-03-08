import {MigrationInterface, QueryRunner} from "typeorm";

export class updateAuditLogLocation1709874723660 implements MigrationInterface {
    name = 'updateAuditLogLocation1709874723660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" ALTER COLUMN "location" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" ALTER COLUMN "location" SET NOT NULL`);
    }

}
