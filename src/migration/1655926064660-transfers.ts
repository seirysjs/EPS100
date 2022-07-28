import {MigrationInterface, QueryRunner} from "typeorm";

export class transfers1655926064660 implements MigrationInterface {
    name = 'transfers1655926064660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`transfer_items\` (\`transfer_item_id\` int NOT NULL AUTO_INCREMENT, \`transfer_id\` int NOT NULL, \`blueprint_id\` int NOT NULL, \`count\` int NOT NULL, \`packs\` varchar(255) NOT NULL DEFAULT '', PRIMARY KEY (\`transfer_item_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transfers\` (\`transfer_id\` int NOT NULL AUTO_INCREMENT, \`order_id\` int NOT NULL, \`vaz_number\` varchar(255) NOT NULL DEFAULT '', \`invoice_number\` varchar(255) NOT NULL DEFAULT '', \`status\` enum ('open', 'wip', 'done', 'void') NOT NULL, \`invoice_date\` datetime NULL, \`transport_id\` int NULL, \`worker_id\` int NULL, \`loading_address\` varchar(255) NOT NULL DEFAULT '', \`loading_city\` varchar(255) NOT NULL DEFAULT '', \`loading_country\` varchar(255) NOT NULL DEFAULT '', \`loading_postal_code\` varchar(255) NOT NULL DEFAULT '', \`loading_date\` datetime NULL, \`unloading_address\` varchar(255) NOT NULL DEFAULT '', \`unloading_city\` varchar(255) NOT NULL DEFAULT '', \`unloading_country\` varchar(255) NOT NULL DEFAULT '', \`unloading_postal_code\` varchar(255) NOT NULL DEFAULT '', \`unloading_date\` datetime NULL, \`unloading_phone_number\` varchar(255) NOT NULL DEFAULT '', PRIMARY KEY (\`transfer_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`transfer_items\` ADD CONSTRAINT \`FK_971ac0d9455d6019ca7d67ed68a\` FOREIGN KEY (\`blueprint_id\`) REFERENCES \`blueprints\`(\`blueprint_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transfer_items\` ADD CONSTRAINT \`FK_fc49d37b7156137bffe903a8199\` FOREIGN KEY (\`transfer_id\`) REFERENCES \`transfers\`(\`transfer_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transfers\` ADD CONSTRAINT \`FK_9a0039678e5949e9ac02fddf0c2\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`order_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transfers\` ADD CONSTRAINT \`FK_7dc7b23c75f26a25d323b169e07\` FOREIGN KEY (\`transport_id\`) REFERENCES \`transports\`(\`transport_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transfers\` ADD CONSTRAINT \`FK_d36cefe57c11d1a4540fe50a16f\` FOREIGN KEY (\`worker_id\`) REFERENCES \`workers\`(\`worker_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transfers\` DROP FOREIGN KEY \`FK_d36cefe57c11d1a4540fe50a16f\``);
        await queryRunner.query(`ALTER TABLE \`transfers\` DROP FOREIGN KEY \`FK_7dc7b23c75f26a25d323b169e07\``);
        await queryRunner.query(`ALTER TABLE \`transfers\` DROP FOREIGN KEY \`FK_9a0039678e5949e9ac02fddf0c2\``);
        await queryRunner.query(`ALTER TABLE \`transfer_items\` DROP FOREIGN KEY \`FK_fc49d37b7156137bffe903a8199\``);
        await queryRunner.query(`ALTER TABLE \`transfer_items\` DROP FOREIGN KEY \`FK_971ac0d9455d6019ca7d67ed68a\``);
        await queryRunner.query(`DROP TABLE \`transfers\``);
        await queryRunner.query(`DROP TABLE \`transfer_items\``);
    }

}
