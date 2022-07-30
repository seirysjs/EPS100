import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlockCut1654899065203 implements MigrationInterface {
  name = 'BlockCut1654899065203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`block_cuts\` (\`block_cut_id\` int NOT NULL AUTO_INCREMENT, \`block_id\` int NOT NULL, \`worker_id\` int NOT NULL, \`blueprint_id\` int NOT NULL, \`count\` int NOT NULL, \`created_at\` datetime NOT NULL, PRIMARY KEY (\`block_cut_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse_items\` ADD \`block_cut_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse_items\` ADD UNIQUE INDEX \`IDX_aacf121582899d9e6c6842d011\` (\`block_cut_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_aacf121582899d9e6c6842d011\` ON \`warehouse_items\` (\`block_cut_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`block_cuts\` ADD CONSTRAINT \`FK_b39a2af430c9c86b5c57a2b0166\` FOREIGN KEY (\`blueprint_id\`) REFERENCES \`blueprints\`(\`blueprint_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`block_cuts\` ADD CONSTRAINT \`FK_e702cef10593f1fe4a29672cf8e\` FOREIGN KEY (\`worker_id\`) REFERENCES \`workers\`(\`worker_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`block_cuts\` ADD CONSTRAINT \`FK_740488bab44f5fd1ae6907cd7e7\` FOREIGN KEY (\`block_id\`) REFERENCES \`blocks\`(\`block_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse_items\` ADD CONSTRAINT \`FK_aacf121582899d9e6c6842d0112\` FOREIGN KEY (\`block_cut_id\`) REFERENCES \`block_cuts\`(\`block_cut_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`warehouse_items\` DROP FOREIGN KEY \`FK_aacf121582899d9e6c6842d0112\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`block_cuts\` DROP FOREIGN KEY \`FK_740488bab44f5fd1ae6907cd7e7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`block_cuts\` DROP FOREIGN KEY \`FK_e702cef10593f1fe4a29672cf8e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`block_cuts\` DROP FOREIGN KEY \`FK_b39a2af430c9c86b5c57a2b0166\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_aacf121582899d9e6c6842d011\` ON \`warehouse_items\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse_items\` DROP INDEX \`IDX_aacf121582899d9e6c6842d011\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse_items\` DROP COLUMN \`block_cut_id\``,
    );
    await queryRunner.query(`DROP TABLE \`block_cuts\``);
  }
}
