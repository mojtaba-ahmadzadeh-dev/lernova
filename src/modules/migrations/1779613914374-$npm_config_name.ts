import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";

export class CreateBasketTable1779613914374 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: EntityNames.Basket,
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "courseId", type: "int" },
          { name: "userId", type: "int" },
          { name: "discountId", type: "int", isNullable: true },
          { name: "type", type: "varchar", isNullable: true },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
      }),
      true,
    );
    const table = await queryRunner.getTable(EntityNames.Basket);

    const columnExists = table?.findColumnByName("quantity");

    if (!columnExists) {
      await queryRunner.addColumn(
        EntityNames.Basket,
        new TableColumn({
          name: "quantity",
          type: "int",
          isNullable: false,
          default: 1,
        }),
      );
    }

    const foreignKeyExists = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes("courseId"),
    );

    if (!foreignKeyExists) {
      await queryRunner.createForeignKey(
        EntityNames.Basket,
        new TableForeignKey({
          columnNames: ["courseId"],
          referencedTableName: EntityNames.Course,
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        }),
      );
    }

    await queryRunner.createForeignKey(
      EntityNames.Basket,
      new TableForeignKey({
        columnNames: ["userId"],
        referencedTableName: EntityNames.User,
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      EntityNames.Basket,
      new TableForeignKey({
        columnNames: ["discountId"],
        referencedTableName: EntityNames.Discount,
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(EntityNames.Basket, true, true, true);
  }
}
