import {MigrationInterface, QueryRunner} from "typeorm";

export class init1650630030540 implements MigrationInterface {
    name = 'init1650630030540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_sizes\` (\`product_size_id\` int NOT NULL AUTO_INCREMENT, \`x_mm\` int NOT NULL, \`y_mm\` int NOT NULL, \`z_mm\` int NOT NULL, PRIMARY KEY (\`product_size_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`workers\` (\`worker_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`enabled\` tinyint NOT NULL, PRIMARY KEY (\`worker_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`warehouse_items\` (\`warehouse_item_id\` int NOT NULL AUTO_INCREMENT, \`blueprint_id\` int NOT NULL, \`block_id\` int NOT NULL, \`worker_id\` int NOT NULL, \`count\` int NOT NULL, \`created_at\` datetime NOT NULL, PRIMARY KEY (\`warehouse_item_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clients\` (\`client_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`country\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, PRIMARY KEY (\`client_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transports\` (\`transport_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`inventory_size_m3\` int NOT NULL, PRIMARY KEY (\`transport_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`order_id\` int NOT NULL AUTO_INCREMENT, \`number\` varchar(255) NOT NULL, \`transport_id\` int NOT NULL, \`status\` enum ('open', 'wip', 'done') NOT NULL, \`client_id\` int NOT NULL, \`delivery_date\` datetime NOT NULL, PRIMARY KEY (\`order_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_items\` (\`order_item_id\` int NOT NULL AUTO_INCREMENT, \`order_id\` int NOT NULL, \`blueprint_id\` int NOT NULL, \`count\` int NOT NULL, PRIMARY KEY (\`order_item_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blueprints\` (\`blueprint_id\` int NOT NULL AUTO_INCREMENT, \`product_class_id\` int NOT NULL, \`product_size_id\` int NOT NULL, PRIMARY KEY (\`blueprint_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_classes\` (\`product_class_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`days_to_dry\` int NOT NULL, PRIMARY KEY (\`product_class_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blocks\` (\`block_id\` int NOT NULL AUTO_INCREMENT, \`worker_id\` int NOT NULL, \`product_class_id\` int NOT NULL, \`drying_started_at\` datetime NOT NULL, \`drying_ends_at\` datetime NOT NULL, \`status\` enum ('drying', 'queue', 'wip', 'done', 'void') NOT NULL, PRIMARY KEY (\`block_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` ADD CONSTRAINT \`FK_fae77eacd74496a9dfaac0171ad\` FOREIGN KEY (\`worker_id\`) REFERENCES \`workers\`(\`worker_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` ADD CONSTRAINT \`FK_d68e852244a2d97e24e3896255a\` FOREIGN KEY (\`block_id\`) REFERENCES \`blocks\`(\`block_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` ADD CONSTRAINT \`FK_ff57ff69edcb4f5b231fa1d473c\` FOREIGN KEY (\`blueprint_id\`) REFERENCES \`blueprints\`(\`blueprint_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_505ba3689ef2763acd6c4fc93a4\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`client_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_d35db42097dcb29456d685dabeb\` FOREIGN KEY (\`transport_id\`) REFERENCES \`transports\`(\`transport_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_24a79b5e89b9380e77eb0b3d9c3\` FOREIGN KEY (\`blueprint_id\`) REFERENCES \`blueprints\`(\`blueprint_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_145532db85752b29c57d2b7b1f1\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`order_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blueprints\` ADD CONSTRAINT \`FK_5842f15b4d0f2a78ec6f2e4323f\` FOREIGN KEY (\`product_class_id\`) REFERENCES \`product_classes\`(\`product_class_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blueprints\` ADD CONSTRAINT \`FK_0efdbd7839bd4e8bc4d9e0bde46\` FOREIGN KEY (\`product_size_id\`) REFERENCES \`product_sizes\`(\`product_size_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blocks\` ADD CONSTRAINT \`FK_9ab6764f87c72a7c4113f204245\` FOREIGN KEY (\`product_class_id\`) REFERENCES \`product_classes\`(\`product_class_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blocks\` ADD CONSTRAINT \`FK_7ba515923682ee8d5d3f2c8a711\` FOREIGN KEY (\`worker_id\`) REFERENCES \`workers\`(\`worker_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query("INSERT INTO `product_sizes` (`product_size_id`, `x_mm`, `y_mm`, `z_mm`) VALUES (1, 1000, 1000, 100), (2, 1000, 1000, 150), (3, 1000, 1000, 200), (4, 1000, 1000, 250), (5, 1000, 1000, 30), (6, 1000, 1000, 300), (7, 1000, 1000, 50), (8, 1000, 2000, 100), (9, 1000, 500, 100), (10, 1000, 500, 150), (11, 1000, 500, 200), (12, 1000, 500, 250), (13, 1000, 500, 300), (14, 1000, 500, 350), (15, 1000, 500, 50)");
        await queryRunner.query("INSERT INTO `product_classes` (`product_class_id`, `name`, `days_to_dry`) VALUES (1, 'EPS70', 7), (2, 'EPS80', 7), (3, 'EPS100', 7), (4, 'NEO EPS70', 10), (5, 'NEO EPS80', 10)");
        await queryRunner.query("INSERT INTO `blueprints` (`blueprint_id`, `product_class_id`, `product_size_id`) VALUES (1, 1, 1), (2, 1, 2), (3, 1, 3), (4, 1, 4), (5, 1, 5), (7, 1, 6), (8, 1, 7), (9, 2, 1), (10, 2, 2), (12, 2, 3), (13, 2, 4), (14, 3, 10), (15, 3, 11), (16, 3, 9), (17, 3, 8), (18, 3, 12), (19, 4, 12), (20, 4, 13), (22, 4, 14), (23, 4, 15), (24, 5, 12), (25, 5, 13), (27, 5, 14), (28, 5, 15)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blocks\` DROP FOREIGN KEY \`FK_7ba515923682ee8d5d3f2c8a711\``);
        await queryRunner.query(`ALTER TABLE \`blocks\` DROP FOREIGN KEY \`FK_9ab6764f87c72a7c4113f204245\``);
        await queryRunner.query(`ALTER TABLE \`blueprints\` DROP FOREIGN KEY \`FK_0efdbd7839bd4e8bc4d9e0bde46\``);
        await queryRunner.query(`ALTER TABLE \`blueprints\` DROP FOREIGN KEY \`FK_5842f15b4d0f2a78ec6f2e4323f\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_145532db85752b29c57d2b7b1f1\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_24a79b5e89b9380e77eb0b3d9c3\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_d35db42097dcb29456d685dabeb\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_505ba3689ef2763acd6c4fc93a4\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` DROP FOREIGN KEY \`FK_ff57ff69edcb4f5b231fa1d473c\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` DROP FOREIGN KEY \`FK_d68e852244a2d97e24e3896255a\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` DROP FOREIGN KEY \`FK_fae77eacd74496a9dfaac0171ad\``);
        await queryRunner.query(`DROP TABLE \`blocks\``);
        await queryRunner.query(`DROP TABLE \`product_classes\``);
        await queryRunner.query(`DROP TABLE \`blueprints\``);
        await queryRunner.query(`DROP TABLE \`order_items\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`transports\``);
        await queryRunner.query(`DROP TABLE \`clients\``);
        await queryRunner.query(`DROP TABLE \`warehouse_items\``);
        await queryRunner.query(`DROP TABLE \`workers\``);
        await queryRunner.query(`DROP TABLE \`product_sizes\``);
    }

}
