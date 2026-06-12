import { EntityNames } from "common/enums/entity.enum";
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateCourseTables1779391028759 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. CREATE COURSE TABLE
    if (!(await queryRunner.hasTable(EntityNames.Course))) {
      await queryRunner.createTable(
        new Table({
          name: EntityNames.Course,
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            { name: "title", type: "varchar" },
            { name: "description", type: "varchar", length: "450" },
            { name: "content", type: "varchar", isNullable: true },
            { name: "price", type: "decimal", default: 0 },
            { name: "isFree", type: "boolean", default: false },
            {
              name: "shortLink",
              type: "varchar",
              isNullable: true,
              isUnique: true,
            },
            { name: "cover", type: "varchar", isNullable: true },
            { name: "isCompleted", type: "boolean", default: false },
            { name: "isPublished", type: "boolean", default: false },
            { name: "rating", type: "float", default: 0 },
            { name: "hasCertificate", type: "boolean", default: false },
            { name: "views", type: "int", default: 0 },
            { name: "teacherId", type: "int", isNullable: true },
            { name: "createdAt", type: "timestamp", default: "now()" },
            { name: "updatedAt", type: "timestamp", default: "now()" },
          ],
        }),
      );
    }

    const courseTable = await queryRunner.getTable(EntityNames.Course);
    if (
      courseTable &&
      !courseTable.foreignKeys.find((fk) =>
        fk.columnNames.includes("teacherId"),
      )
    ) {
      await queryRunner.createForeignKey(
        EntityNames.Course,
        new TableForeignKey({
          columnNames: ["teacherId"],
          referencedTableName: EntityNames.User,
          referencedColumnNames: ["id"],
          onDelete: "SET NULL",
        }),
      );
    }

    // 2. CREATE COURSE CATEGORY TABLE
    if (!(await queryRunner.hasTable(EntityNames.CourseCategory))) {
      await queryRunner.createTable(
        new Table({
          name: EntityNames.CourseCategory,
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            { name: "courseId", type: "int" },
            { name: "categoryId", type: "int" },
            { name: "createdAt", type: "timestamp", default: "now()" },
            { name: "updatedAt", type: "timestamp", default: "now()" },
          ],
        }),
      );
    }

    const categoryTable = await queryRunner.getTable(
      EntityNames.CourseCategory,
    );
    if (categoryTable && categoryTable.foreignKeys.length === 0) {
      await queryRunner.createForeignKeys(EntityNames.CourseCategory, [
        new TableForeignKey({
          columnNames: ["courseId"],
          referencedTableName: EntityNames.Course,
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        }),
        new TableForeignKey({
          columnNames: ["categoryId"],
          referencedTableName: EntityNames.Category,
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        }),
      ]);
    }

    const commentTable = await queryRunner.getTable(EntityNames.CourseComment);
    if (commentTable && commentTable.foreignKeys.length === 0) {
      await queryRunner.createForeignKeys(EntityNames.CourseComment, [
        new TableForeignKey({
          columnNames: ["courseId"],
          referencedTableName: EntityNames.Course,
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        }),
        new TableForeignKey({
          columnNames: ["userId"],
          referencedTableName: EntityNames.User,
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        }),
        new TableForeignKey({
          columnNames: ["parentId"],
          referencedTableName: EntityNames.CourseComment,
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        }),
      ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      EntityNames.CourseCategory,
      EntityNames.Course,
    ];

    for (const tableName of tables) {
      const table = await queryRunner.getTable(tableName);
      if (table) {
        await queryRunner.dropForeignKeys(tableName, table.foreignKeys);
        await queryRunner.dropTable(tableName);
      }
    }
  }
}
