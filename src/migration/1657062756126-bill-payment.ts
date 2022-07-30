import { MigrationInterface, QueryRunner } from 'typeorm';

export class billPayment1657062756126 implements MigrationInterface {
  name = 'billPayment1657062756126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bill_payments\` (\`bill_payment_id\` int NOT NULL AUTO_INCREMENT, \`bill_id\` int NOT NULL, \`amount\` decimal(8,2) NOT NULL DEFAULT '0.00', \`payment_date\` datetime NULL, PRIMARY KEY (\`bill_payment_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bill_payments\` ADD CONSTRAINT \`FK_3aee6283af1675b93df5b4b35f8\` FOREIGN KEY (\`bill_id\`) REFERENCES \`bills\`(\`bill_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bill_payments\` DROP FOREIGN KEY \`FK_3aee6283af1675b93df5b4b35f8\``,
    );
    await queryRunner.query(`DROP TABLE \`bill_payments\``);
  }
}
