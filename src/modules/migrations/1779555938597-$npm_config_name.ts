import {
  MigrationInterface,
  QueryRunner,
  Table,
} from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";

export class CreateDiscountTable1779555938597 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable(EntityNames.Discount))) {
      await queryRunner.createTable(
        new Table({
          name: EntityNames.Discount,
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            { name: "code", type: "varchar", isUnique: true },
            { name: "percent", type: "numeric", isNullable: true },
            { name: "amount", type: "numeric", isNullable: true },
            { name: "expires_in", type: "timestamp", isNullable: true },
            { name: "limit", type: "int", isNullable: true },
            { name: "usege", type: "int", isNullable: true, default: 0 },
            { name: "active", type: "boolean", default: true },
            { name: "courseId", type: "int", isNullable: true },
            { name: "created_at", type: "timestamp", default: "now()" },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(EntityNames.Discount);
  }
}
