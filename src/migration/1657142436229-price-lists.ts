import {MigrationInterface, QueryRunner} from "typeorm";

export class priceLists1657142436229 implements MigrationInterface {
    name = 'priceLists1657142436229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`prices\` (\`price_id\` int NOT NULL AUTO_INCREMENT, \`price_list_id\` int NOT NULL, \`product_class_id\` int NOT NULL, \`amount\` decimal(6,2) NOT NULL DEFAULT '0.00', PRIMARY KEY (\`price_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`priceLists\` (\`price_list_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL DEFAULT '', \`note\` varchar(255) NOT NULL DEFAULT '', \`price_list_date\` datetime NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`price_list_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`bills\` ADD \`price_list_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`price_list_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`prices\` ADD CONSTRAINT \`FK_87faf29b530d69a8bd72b9a17d5\` FOREIGN KEY (\`product_class_id\`) REFERENCES \`product_classes\`(\`product_class_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`prices\` ADD CONSTRAINT \`FK_10d8270434ac59f42c414efff0c\` FOREIGN KEY (\`price_list_id\`) REFERENCES \`priceLists\`(\`price_list_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bills\` ADD CONSTRAINT \`FK_9fc94fff62e98d4420d91c4261e\` FOREIGN KEY (\`price_list_id\`) REFERENCES \`priceLists\`(\`price_list_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_af095f9f0d4d394980cb5fcd032\` FOREIGN KEY (\`price_list_id\`) REFERENCES \`priceLists\`(\`price_list_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_af095f9f0d4d394980cb5fcd032\``);
        await queryRunner.query(`ALTER TABLE \`bills\` DROP FOREIGN KEY \`FK_9fc94fff62e98d4420d91c4261e\``);
        await queryRunner.query(`ALTER TABLE \`prices\` DROP FOREIGN KEY \`FK_10d8270434ac59f42c414efff0c\``);
        await queryRunner.query(`ALTER TABLE \`prices\` DROP FOREIGN KEY \`FK_87faf29b530d69a8bd72b9a17d5\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`price_list_id\``);
        await queryRunner.query(`ALTER TABLE \`bills\` DROP COLUMN \`price_list_id\``);
        await queryRunner.query(`DROP TABLE \`priceLists\``);
        await queryRunner.query(`DROP TABLE \`prices\``);
    }

}
