// import { EntityNames } from "common/enums/entity.enum";
// import {
//   MigrationInterface,
//   QueryRunner,
//   Table,
//   TableColumn,
//   TableForeignKey,
// } from "typeorm";


// export class CreatePaymentTable1779698924883 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // ========================
//     // CREATE PAYMENT TABLE
//     // ========================
//     await queryRunner.createTable(
//       new Table({
//         name: EntityNames.Payment,
//         columns: [
//           {
//             name: "id",
//             type: "int",
//             isPrimary: true,
//             isGenerated: true,
//             generationStrategy: "increment",
//           },
//           { name: "status", type: "boolean", default: false },
//           { name: "amount", type: "int", isNullable: false },
//           { name: "invoice_number", type: "varchar", isNullable: false },
//           { 
//             name: "refId", 
//             type: "varchar", 
//             isNullable: true // شماره پیگیری نهایی (بعد از تایید)
//           },
//           { name: "userId", type: "int", isNullable: false },
//           { name: "orderId", type: "int", isNullable: false },
//           { name: "createdAt", type: "timestamp", default: "now()" },
//         ],
//       }),
//       true,
//     );

//      await queryRunner.addColumn(
//       EntityNames.Payment,
//       new TableColumn({
//         name: "authority",
//         type: "varchar",
//         isNullable: true, // برای اینکه دیتای قبلی به مشکل نخورد، ابتدا نال‌پذیر باشد
//       })
//     );

//     // ========================
//     // ADD FOREIGN KEYS
//     // ========================

//     // FK for Payment -> User (ManyToOne)
//     await queryRunner.createForeignKey(
//       EntityNames.Payment,
//       new TableForeignKey({
//         name: "FK_payment_user",
//         columnNames: ["userId"],
//         referencedTableName: EntityNames.User,
//         referencedColumnNames: ["id"],
//         onDelete: "CASCADE",
//       }),
//     );

//     // FK for Payment -> Order (OneToOne)
//     await queryRunner.createForeignKey(
//       EntityNames.Payment,
//       new TableForeignKey({
//         name: "FK_payment_order",
//         columnNames: ["orderId"],
//         referencedTableName: EntityNames.Order,
//         referencedColumnNames: ["id"],
//         onDelete: "CASCADE",
//       }),
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // DROP PAYMENT TABLE
//     const paymentTable = await queryRunner.getTable(EntityNames.Payment);
//     if (paymentTable) {
//       await queryRunner.dropTable(EntityNames.Payment, true);
//     }
//   }
// }
