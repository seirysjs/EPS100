import {MigrationInterface, QueryRunner} from "typeorm";

export class vatDefaults1653740327724 implements MigrationInterface {
    name = 'vatDefaults1653740327724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`postal_code\` \`postal_code\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`phone\` \`phone\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`company_code\` \`company_code\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`vat_code\` \`vat_code\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`banks_name\` \`banks_name\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`address\` \`address\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`city\` \`city\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`country\` \`country\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`postal_code\` \`postal_code\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`postal_code\` \`postal_code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`country\` \`country\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`city\` \`city\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`address\` \`address\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`banks_name\` \`banks_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`vat_code\` \`vat_code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`company_code\` \`company_code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`phone\` \`phone\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`postal_code\` \`postal_code\` varchar(255) NOT NULL`);
    }

}
