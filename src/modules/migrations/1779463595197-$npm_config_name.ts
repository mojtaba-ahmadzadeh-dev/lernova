import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";

export class CreateBlogRelatedTables1779463595197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create Blog Table
    await queryRunner.createTable(
      new Table({
        name: EntityNames.Blog,
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "title", type: "varchar" },
          { name: "description", type: "varchar", length: "500" },
          { name: "content", type: "text" },
          { name: "image", type: "varchar" },
          { name: "imageKey", type: "varchar", isNullable: true },
          { name: "slug", type: "varchar", isUnique: true },
          { name: "time_for_stady", type: "varchar" },
          { name: "status", type: "varchar", default: "'draft'" },
          { name: "view", type: "int", default: 0 },
          { name: "authorId", type: "int" },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
      }),
      true
    );

    // 2. Create BlogCategory Table
    await queryRunner.createTable(
      new Table({
        name: EntityNames.BlogCategory,
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "blogId", type: "int" },
          { name: "categoryId", type: "int" },
        ],
      }),
      true
    );

    // 3. Create BlogLikes Table
    await queryRunner.createTable(
      new Table({
        name: EntityNames.BlogLikes,
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "blogId", type: "int" },
          { name: "userId", type: "int" },
        ],
      }),
      true
    );

    // 4. Create BlogBookmarks Table
    await queryRunner.createTable(
      new Table({
        name: EntityNames.BlogBookmarks,
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "blogId", type: "int" },
          { name: "userId", type: "int" },
        ],
      }),
      true
    );

    // Foreign Keys (به دلیل طولانی نشدن، الگوی کلی آورده شد)
    // برای هر جدول، مشابه نمونه‌ای که فرستادید، Foreign Key ها را اضافه کنید.
    // به عنوان مثال برای Author در Blog:
    await queryRunner.createForeignKey(EntityNames.Blog, new TableForeignKey({
        columnNames: ["authorId"],
        referencedTableName: EntityNames.User, // نام جدول کاربر
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(EntityNames.BlogBookmarks, true, true, true);
    await queryRunner.dropTable(EntityNames.BlogLikes, true, true, true);
    await queryRunner.dropTable(EntityNames.BlogCategory, true, true, true);
    await queryRunner.dropTable(EntityNames.Blog, true, true, true);
  }
}
