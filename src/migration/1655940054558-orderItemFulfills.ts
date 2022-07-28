import {MigrationInterface, QueryRunner} from "typeorm";

export class orderItemFulfills1655940054558 implements MigrationInterface {
    name = 'orderItemFulfills1655940054558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order_item_fulfills\` (\`order_item_fulfill_id\` int NOT NULL AUTO_INCREMENT, \`order_id\` int NOT NULL, \`blueprint_id\` int NOT NULL, \`count\` int NOT NULL, PRIMARY KEY (\`order_item_fulfill_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP COLUMN \`count_done\``);
        await queryRunner.query(`ALTER TABLE \`order_item_fulfills\` ADD CONSTRAINT \`FK_17d4d4ca00e6dbdb39b2c62b9e7\` FOREIGN KEY (\`blueprint_id\`) REFERENCES \`blueprints\`(\`blueprint_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item_fulfills\` ADD CONSTRAINT \`FK_7066171a88c5f63d602887a1863\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`order_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_item_fulfills\` DROP FOREIGN KEY \`FK_7066171a88c5f63d602887a1863\``);
        await queryRunner.query(`ALTER TABLE \`order_item_fulfills\` DROP FOREIGN KEY \`FK_17d4d4ca00e6dbdb39b2c62b9e7\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD \`count_done\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE \`order_item_fulfills\``);
    }

}
