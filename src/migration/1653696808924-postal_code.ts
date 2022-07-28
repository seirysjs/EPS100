import {MigrationInterface, QueryRunner} from "typeorm";

export class postalCode1653696808924 implements MigrationInterface {
    name = 'postalCode1653696808924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`postal_code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`company_code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`vat_code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`banks_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`address\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`city\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`country\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`postal_code\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`postal_code\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`country\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`city\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`address\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`banks_name\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`vat_code\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`company_code\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`postal_code\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`email\``);
    }

}
