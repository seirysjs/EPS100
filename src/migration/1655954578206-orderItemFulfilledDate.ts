import { MigrationInterface, QueryRunner } from 'typeorm';

export class orderItemFulfilledDate1655954578206 implements MigrationInterface {
  name = 'orderItemFulfilledDate1655954578206';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_item_fulfills\` ADD \`fulfilled_date\` datetime NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_item_fulfills\` DROP COLUMN \`fulfilled_date\``,
    );
  }
}
