import { MigrationInterface, QueryRunner } from 'typeorm';

export class billPaymentNote1657113786793 implements MigrationInterface {
  name = 'billPaymentNote1657113786793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bill_payments\` ADD \`note\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bill_payments\` DROP COLUMN \`note\``,
    );
  }
}
