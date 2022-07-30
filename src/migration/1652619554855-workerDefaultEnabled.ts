import { MigrationInterface, QueryRunner } from 'typeorm';

export class workerDefaultEnabled1652619554855 implements MigrationInterface {
  name = 'workerDefaultEnabled1652619554855';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`workers\` CHANGE \`enabled\` \`enabled\` tinyint NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`workers\` CHANGE \`enabled\` \`enabled\` tinyint NOT NULL`,
    );
  }
}
