import { MigrationInterface, QueryRunner } from 'typeorm';

export class fullBlueprintsList1655954598206 implements MigrationInterface {
  name = 'fullBlueprintsList1655954598206';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO `blueprints` (`blueprint_id`, `product_class_id`, `product_size_id`) VALUES (29, 1, 8), (30, 1, 9), (31, 1, 10), (32, 1, 11), (33, 1, 12), (34, 1, 13), (35, 1, 14), (36, 1, 15), (37, 2, 5), (38, 2, 6), (39, 2, 7), (40, 2, 8), (41, 2, 9), (42, 2, 10), (43, 2, 11), (44, 2, 12), (45, 2, 13), (46, 2, 14), (47, 2, 15), (48, 3, 1), (49, 3, 2), (50, 3, 3), (51, 3, 4), (52, 3, 5), (53, 3, 6), (54, 3, 7), (55, 3, 13), (56, 3, 14), (57, 3, 15), (58, 4, 1), (59, 4, 2), (60, 4, 3), (61, 4, 4), (62, 4, 5), (63, 4, 6), (64, 4, 7), (65, 4, 8), (66, 4, 9), (67, 4, 10), (68, 4, 11), (69, 5, 1), (70, 5, 2), (71, 5, 3), (72, 5, 4), (73, 5, 5), (74, 5, 6), (75, 5, 7), (26, 5, 8), (21, 5, 9), (11, 5, 10), (6, 5, 11)',
    );
  }

  public async down(): Promise<void> {}
}
