import { MigrationInterface, QueryRunner } from 'typeorm';

export class priceListsFix1657142436239 implements MigrationInterface {
  name = 'priceListsFix1657142436239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`RENAME TABLE \`priceLists\` TO \`price_lists\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`RENAME TABLE \`price_lists\` TO \`priceLists\``);
  }
}
