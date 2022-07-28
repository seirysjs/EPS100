import {MigrationInterface, QueryRunner} from "typeorm";

export class OrderVoidEnum1652973620186 implements MigrationInterface {
    name = 'OrderVoidEnum1652973620186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('open', 'wip', 'done', 'void') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('open', 'wip', 'done') NOT NULL`);
    }

}
