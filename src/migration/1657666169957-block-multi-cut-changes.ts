import {MigrationInterface, QueryRunner} from "typeorm";

export class blockMultiCutChanges1657666169957 implements MigrationInterface {
    name = 'blockMultiCutChanges1657666169957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` ADD \`block_multi_cut_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` DROP FOREIGN KEY \`FK_d68e852244a2d97e24e3896255a\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` CHANGE \`block_id\` \`block_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` ADD CONSTRAINT \`FK_d68e852244a2d97e24e3896255a\` FOREIGN KEY (\`block_id\`) REFERENCES \`blocks\`(\`block_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` ADD CONSTRAINT \`FK_54128050c7429937d95625a2c30\` FOREIGN KEY (\`block_multi_cut_id\`) REFERENCES \`block_multi_cuts\`(\`block_multi_cut_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` DROP FOREIGN KEY \`FK_54128050c7429937d95625a2c30\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` DROP FOREIGN KEY \`FK_d68e852244a2d97e24e3896255a\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` CHANGE \`block_id\` \`block_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` ADD CONSTRAINT \`FK_d68e852244a2d97e24e3896255a\` FOREIGN KEY (\`block_id\`) REFERENCES \`blocks\`(\`block_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_items\` DROP COLUMN \`block_multi_cut_id\``);
    }

}
