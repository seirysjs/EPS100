import {MigrationInterface, QueryRunner} from "typeorm";

export class update1653498493660 implements MigrationInterface {
    name = 'update1653498493660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transports\` ADD \`number\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`transports\` CHANGE \`name\` \`name\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`transports\` CHANGE \`inventory_size_m3\` \`inventory_size_m3\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`number\` \`number\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`number\` \`number\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transports\` CHANGE \`inventory_size_m3\` \`inventory_size_m3\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transports\` CHANGE \`name\` \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transports\` DROP COLUMN \`number\``);
    }

}
