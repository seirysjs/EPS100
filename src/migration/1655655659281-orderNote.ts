import {MigrationInterface, QueryRunner} from "typeorm";

export class orderNote1655655659281 implements MigrationInterface {
    name = 'orderNote1655655659281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`note\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`note\``);
    }

}
