// import { EntityNames } from "common/enums/entity.enum";
// import {
//   MigrationInterface,
//   QueryRunner,
//   Table,
//   TableForeignKey,
// } from "typeorm";

// export class CreateCommentTable1779526634994 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // 1. CREATE COMMENT TABLE
//     if (!(await queryRunner.hasTable(EntityNames.Comment))) {
//       await queryRunner.createTable(
//         new Table({
//           name: EntityNames.Comment,
//           columns: [
//             {
//               name: "id",
//               type: "int",
//               isPrimary: true,
//               isGenerated: true,
//               generationStrategy: "increment",
//             },
//             { name: "text", type: "text" },
//             { name: "parentId", type: "int", isNullable: true },
//             { name: "targetId", type: "int" },
//             { name: "targetType", type: "varchar" },
//             { name: "authorId", type: "int" },
//             {
//               name: "accepted",
//               type: "boolean",
//               default: false,
//             },
//           ],
//         }),
//       );
//     }

//     // 2. CREATE FOREIGN KEY (User -> Comment)
//     const table = await queryRunner.getTable(EntityNames.Comment);
//     if (
//       table &&
//       !table.foreignKeys.find((fk) => fk.columnNames.includes("authorId"))
//     ) {
//       // در قسمت CREATE FOREIGN KEY
//       await queryRunner.createForeignKey(
//         EntityNames.Comment,
//         new TableForeignKey({
//           name: "FK_comment_author", // نام اختصاصی برای جلوگیری از تداخل
//           columnNames: ["authorId"],
//           referencedTableName: EntityNames.User,
//           referencedColumnNames: ["id"],
//           onDelete: "CASCADE",
//         }),
//       );
//     }
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     const table = await queryRunner.getTable(EntityNames.Comment);
//     if (table) {
//       // حذف کلید خارجی قبل از حذف جدول
//       await queryRunner.dropForeignKeys(EntityNames.Comment, table.foreignKeys);
//       await queryRunner.dropTable(EntityNames.Comment);
//     }
//   }
// }
