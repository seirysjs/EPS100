import {MigrationInterface, QueryRunner} from "typeorm";

export class blockMultiCut1657559587289 implements MigrationInterface {
    name = 'blockMultiCut1657559587289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`block_multi_cuts\` (\`block_multi_cut_id\` int NOT NULL AUTO_INCREMENT, \`worker_id\` int NOT NULL, \`product_class_id\` int NOT NULL, \`created_at\` datetime NOT NULL, PRIMARY KEY (\`block_multi_cut_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`block_cuts\` ADD \`block_multi_cut_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`blocks\` ADD \`block_multi_cut_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`block_multi_cuts\` ADD CONSTRAINT \`FK_88929d8ad162da7a2a48fcb96e4\` FOREIGN KEY (\`worker_id\`) REFERENCES \`workers\`(\`worker_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`block_cuts\` ADD CONSTRAINT \`FK_837872e9c86c32368815710486c\` FOREIGN KEY (\`block_multi_cut_id\`) REFERENCES \`block_multi_cuts\`(\`block_multi_cut_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blocks\` ADD CONSTRAINT \`FK_1dfaa9e767e97f6b78c1c0d0142\` FOREIGN KEY (\`block_multi_cut_id\`) REFERENCES \`block_multi_cuts\`(\`block_multi_cut_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blocks\` DROP FOREIGN KEY \`FK_1dfaa9e767e97f6b78c1c0d0142\``);
        await queryRunner.query(`ALTER TABLE \`block_cuts\` DROP FOREIGN KEY \`FK_837872e9c86c32368815710486c\``);
        await queryRunner.query(`ALTER TABLE \`block_multi_cuts\` DROP FOREIGN KEY \`FK_88929d8ad162da7a2a48fcb96e4\``);
        await queryRunner.query(`ALTER TABLE \`blocks\` DROP COLUMN \`block_multi_cut_id\``);
        await queryRunner.query(`ALTER TABLE \`block_cuts\` DROP COLUMN \`block_multi_cut_id\``);
        await queryRunner.query(`DROP TABLE \`block_multi_cuts\``);
    }

}
