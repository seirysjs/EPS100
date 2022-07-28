import {MigrationInterface, QueryRunner} from "typeorm";

export class priceMarkup1657225697994 implements MigrationInterface {
    name = 'priceMarkup1657225697994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`prices\` ADD \`markup\` decimal(6,2) NOT NULL DEFAULT '20.00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`prices\` DROP COLUMN \`markup\``);
    }

}
