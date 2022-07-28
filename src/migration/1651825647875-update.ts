import {MigrationInterface, QueryRunner} from "typeorm";

export class update1651825647875 implements MigrationInterface {
    name = 'update1651825647875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`delivery_date\` \`delivery_date\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`delivery_date\` \`delivery_date\` datetime NOT NULL`);
    }

}
