import { EntityNames } from "common/enums/entity.enum";
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateOrderTables1779633861885 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========================
    // CREATE ORDER TABLE
    // ========================
    await queryRunner.createTable(
      new Table({
        name: EntityNames.Order,
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "userId", type: "int", isNullable: false },
          { name: "payment_amount", type: "numeric", precision: 12, scale: 2 },
          {
            name: "discount_amount",
            type: "numeric",
            precision: 12,
            scale: 2,
            default: 0,
          },
          { name: "total_amount", type: "numeric", precision: 12, scale: 2 },
          { name: "status", type: "varchar", default: "'Pending'" },
          { name: "description", type: "varchar", isNullable: true },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" },
        ],
      }),
      true,
    );

    // ========================
    // ADD PAYMENT COLUMN (SAFE MIGRATION)
    // ========================
    await queryRunner.addColumn(
      EntityNames.Order,
      new TableColumn({
        name: "payment_id",
        type: "int",
        isNullable: true, // چون order ممکنه هنوز payment نداشته باشه
      }),
    );

    // ========================
    // ADD FOREIGN KEY FOR PAYMENT
    // ========================
    await queryRunner.createForeignKey(
      EntityNames.Order,
      new TableForeignKey({
        columnNames: ["payment_id"],
        referencedTableName: EntityNames.Payment,
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );

    // ========================
    // CREATE ORDER ITEM TABLE
    // ========================
    await queryRunner.createTable(
      new Table({
        name: EntityNames.OrderItem,
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "courseId", type: "int", isNullable: false },
          { name: "orderId", type: "int", isNullable: false },
          { name: "status", type: "varchar", default: "'Pending'" },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" },
        ],
      }),
      true,
    );

    // ========================
    // ADD FOREIGN KEYS
    // ========================

    // FK for Order -> User
    await queryRunner.createForeignKey(
      EntityNames.Order,
      new TableForeignKey({
        name: "FK_order_user",
        columnNames: ["userId"],
        referencedTableName: EntityNames.User,
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // FK for OrderItem -> Order
    await queryRunner.createForeignKey(
      EntityNames.OrderItem,
      new TableForeignKey({
        name: "FK_order_item_order",
        columnNames: ["orderId"],
        referencedTableName: EntityNames.Order,
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // FK for OrderItem -> Course
    await queryRunner.createForeignKey(
      EntityNames.OrderItem,
      new TableForeignKey({
        name: "FK_order_item_course",
        columnNames: ["courseId"],
        referencedTableName: EntityNames.Course,
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // DROP ORDER ITEM (ابتدا به دلیل وابستگی به Order)
    const orderItemTable = await queryRunner.getTable(EntityNames.OrderItem);
    if (orderItemTable) {
      await queryRunner.dropTable(EntityNames.OrderItem, true);
    }

    // DROP ORDER
    const orderTable = await queryRunner.getTable(EntityNames.Order);
    if (orderTable) {
      await queryRunner.dropTable(EntityNames.Order, true);
    }
  }
}
