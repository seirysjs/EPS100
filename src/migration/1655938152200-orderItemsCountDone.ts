import { MigrationInterface, QueryRunner } from 'typeorm';

export class orderItemsCountDone1655938152200 implements MigrationInterface {
  name = 'orderItemsCountDone1655938152200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_items\` ADD \`count_done\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_items\` DROP COLUMN \`count_done\``,
    );
  }
}
