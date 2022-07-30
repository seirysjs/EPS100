import { MigrationInterface, QueryRunner } from 'typeorm';

export class billyBoy1657038406634 implements MigrationInterface {
  name = 'billyBoy1657038406634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bill_items\` (\`bill_item_id\` int NOT NULL AUTO_INCREMENT, \`bill_id\` int NOT NULL, \`blueprint_id\` int NOT NULL, \`count\` int NOT NULL, PRIMARY KEY (\`bill_item_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bills\` (\`bill_id\` int NOT NULL AUTO_INCREMENT, \`order_id\` int NOT NULL, \`note\` varchar(255) NOT NULL DEFAULT '', \`days_postponed\` int NOT NULL DEFAULT '7', \`bill_date\` datetime NULL, PRIMARY KEY (\`bill_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bill_items\` ADD CONSTRAINT \`FK_7bb76f4df435bc4608ec09b0582\` FOREIGN KEY (\`blueprint_id\`) REFERENCES \`blueprints\`(\`blueprint_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bill_items\` ADD CONSTRAINT \`FK_b424156152a3230b034bdb51db4\` FOREIGN KEY (\`bill_id\`) REFERENCES \`bills\`(\`bill_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bills\` ADD CONSTRAINT \`FK_9b63ae5b3b33ba4eaacf30cbc48\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`order_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bills\` DROP FOREIGN KEY \`FK_9b63ae5b3b33ba4eaacf30cbc48\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bill_items\` DROP FOREIGN KEY \`FK_b424156152a3230b034bdb51db4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bill_items\` DROP FOREIGN KEY \`FK_7bb76f4df435bc4608ec09b0582\``,
    );
    await queryRunner.query(`DROP TABLE \`bills\``);
    await queryRunner.query(`DROP TABLE \`bill_items\``);
  }
}
