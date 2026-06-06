import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";

export class CreateChapterTable1779455734612 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. CREATE CHAPTER TABLE
    if (!(await queryRunner.hasTable(EntityNames.Chapter))) {
      await queryRunner.createTable(
        new Table({
          name: EntityNames.Chapter,
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            { name: "title", type: "varchar", length: "255" },
            { name: "description", type: "text", isNullable: true },
            { name: "order", type: "int", default: 1 },
            { name: "courseId", type: "int" },
            { name: "createdAt", type: "timestamp", default: "now()" },
            { name: "updatedAt", type: "timestamp", default: "now()" },
          ],
        }),
      );
    }

    // 2. CREATE FOREIGN KEY
    const chapterTable = await queryRunner.getTable(EntityNames.Chapter);
    if (
      chapterTable &&
      !chapterTable.foreignKeys.find((fk) =>
        fk.columnNames.includes("courseId"),
      )
    ) {
      await queryRunner.createForeignKey(
        EntityNames.Chapter,
        new TableForeignKey({
          columnNames: ["courseId"],
          referencedTableName: EntityNames.Course,
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(EntityNames.Chapter);
    if (table) {
      // حذف کلید خارجی قبل از حذف جدول
      await queryRunner.dropForeignKeys(EntityNames.Chapter, table.foreignKeys);
      await queryRunner.dropTable(EntityNames.Chapter);
    }
  }
}
