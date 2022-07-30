import { MigrationInterface, QueryRunner } from 'typeorm';

export class orders1651666985236 implements MigrationInterface {
  name = 'orders1651666985236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_d35db42097dcb29456d685dabeb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`transport_id\` \`transport_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_d35db42097dcb29456d685dabeb\` FOREIGN KEY (\`transport_id\`) REFERENCES \`transports\`(\`transport_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_d35db42097dcb29456d685dabeb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`transport_id\` \`transport_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_d35db42097dcb29456d685dabeb\` FOREIGN KEY (\`transport_id\`) REFERENCES \`transports\`(\`transport_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
