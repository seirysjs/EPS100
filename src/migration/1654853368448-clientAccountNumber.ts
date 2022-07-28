import {MigrationInterface, QueryRunner} from "typeorm";

export class clientAccountNumber1654853368448 implements MigrationInterface {
    name = 'clientAccountNumber1654853368448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`account_number\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`account_number\``);
    }

}
