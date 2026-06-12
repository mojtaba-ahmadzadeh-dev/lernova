// import { EntityNames } from "common/enums/entity.enum";
// import {
//   MigrationInterface,
//   QueryRunner,
//   Table,
//   TableForeignKey,
// } from "typeorm";

// export class CreateSesstionTable1779457584750 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // 1. CREATE SESSTION TABLE
//     if (!(await queryRunner.hasTable(EntityNames.Sesstion))) {
//       await queryRunner.createTable(
//         new Table({
//           name: EntityNames.Sesstion,
//           columns: [
//             {
//               name: "id",
//               type: "int",
//               isPrimary: true,
//               isGenerated: true,
//               generationStrategy: "increment",
//             },
//             { name: "title", type: "varchar", length: "255" },
//             { name: "videoUrl", type: "varchar" },
//             { name: "order", type: "int" },
//             { name: "isFree", type: "boolean", default: false },
//             { name: "duration", type: "varchar" },
//             { name: "chapterId", type: "int" },
//             { name: "createdAt", type: "timestamp", default: "now()" },
//             { name: "updatedAt", type: "timestamp", default: "now()" },
//           ],
//         }),
//       );
//     }

//     // 2. CREATE FOREIGN KEY
//     const sesstionTable = await queryRunner.getTable(EntityNames.Sesstion);
//     if (
//       sesstionTable &&
//       !sesstionTable.foreignKeys.find((fk) =>
//         fk.columnNames.includes("chapterId"),
//       )
//     ) {
//       await queryRunner.createForeignKey(
//         EntityNames.Sesstion,
//         new TableForeignKey({
//           columnNames: ["chapterId"],
//           referencedTableName: EntityNames.Chapter,
//           referencedColumnNames: ["id"],
//           onDelete: "CASCADE",
//         }),
//       );
//     }
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     const table = await queryRunner.getTable(EntityNames.Sesstion);
//     if (table) {
//       // حذف کلید خارجی قبل از حذف جدول
//       await queryRunner.dropForeignKeys(EntityNames.Sesstion, table.foreignKeys);
//       await queryRunner.dropTable(EntityNames.Sesstion);
//     }
//   }
// }
