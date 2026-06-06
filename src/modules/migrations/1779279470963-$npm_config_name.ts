import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
} from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";

export class CreateCategoryTable1779279470963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========================
    // CREATE CATEGORY TABLE
    // ========================
    const hasTable = await queryRunner.hasTable(EntityNames.Category);

    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: EntityNames.Category,
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            {
              name: "title",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "slug",
              type: "varchar",
              isNullable: false,
            },
            {
              name: "isActive",
              type: "boolean",
              default: true,
            },
            {
              name: "parentId",
              type: "int",
              isNullable: true,
            },
            {
              name: "createdAt",
              type: "timestamp",
              default: "now()",
            },
            {
              name: "updatedAt",
              type: "timestamp",
              default: "now()",
            },
          ],
        }),
        true,
      );
    }

    // ========================
    // ADD SELF FOREIGN KEY
    // ========================
    const table = await queryRunner.getTable(EntityNames.Category);

    const hasFK = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes("parentId"),
    );

    if (!hasFK) {
      await queryRunner.createForeignKey(
        EntityNames.Category,
        new TableForeignKey({
          columnNames: ["parentId"],
          referencedTableName: EntityNames.Category,
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(EntityNames.Category);

    // DROP FK
    if (table) {
      const fk = table.foreignKeys.find((f) =>
        f.columnNames.includes("parentId"),
      );
      if (fk) {
        await queryRunner.dropForeignKey(EntityNames.Category, fk);
      }
    }

    // DROP TABLE
    await queryRunner.dropTable(EntityNames.Category, true);
  }
}
