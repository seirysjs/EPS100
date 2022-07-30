import { MigrationInterface, QueryRunner } from 'typeorm';

export class orderLoadingAdress1654906391295 implements MigrationInterface {
  name = 'orderLoadingAdress1654906391295';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_aacf121582899d9e6c6842d011\` ON \`warehouse_items\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`laddress\` varchar(255) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`lcity\` varchar(255) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`lcountry\` varchar(255) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`lpostal_code\` varchar(255) NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP COLUMN \`lpostal_code\``,
    );
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`lcountry\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`lcity\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`laddress\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_aacf121582899d9e6c6842d011\` ON \`warehouse_items\` (\`block_cut_id\`)`,
    );
  }
}
