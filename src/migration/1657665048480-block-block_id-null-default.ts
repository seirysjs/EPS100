import {MigrationInterface, QueryRunner} from "typeorm";

export class blockBlockIdNullDefault1657665048480 implements MigrationInterface {
    name = 'blockBlockIdNullDefault1657665048480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`block_cuts\` DROP FOREIGN KEY \`FK_740488bab44f5fd1ae6907cd7e7\``);
        await queryRunner.query(`ALTER TABLE \`block_cuts\` CHANGE \`block_id\` \`block_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`block_cuts\` ADD CONSTRAINT \`FK_740488bab44f5fd1ae6907cd7e7\` FOREIGN KEY (\`block_id\`) REFERENCES \`blocks\`(\`block_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`block_cuts\` DROP FOREIGN KEY \`FK_740488bab44f5fd1ae6907cd7e7\``);
        await queryRunner.query(`ALTER TABLE \`block_cuts\` CHANGE \`block_id\` \`block_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`block_cuts\` ADD CONSTRAINT \`FK_740488bab44f5fd1ae6907cd7e7\` FOREIGN KEY (\`block_id\`) REFERENCES \`blocks\`(\`block_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
