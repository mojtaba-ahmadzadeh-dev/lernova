import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateRbacTables1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // =========================
    // 1. ROLES TABLE
    // =========================
    const roleTableExists = await queryRunner.hasTable("roles");

    if (!roleTableExists) {
      await queryRunner.createTable(
        new Table({
          name: "roles",
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            {
              name: "name",
              type: "varchar",
              isUnique: true,
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
      );
    }

    // =========================
    // 2. PERMISSIONS TABLE
    // =========================
    const permissionTableExists = await queryRunner.hasTable("permissions");

    if (!permissionTableExists) {
      await queryRunner.createTable(
        new Table({
          name: "permissions",
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            {
              name: "name",
              type: "varchar",
              isUnique: true,
            },
            {
              name: "description",
              type: "varchar",
              isNullable: true,
              default: "''",
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
      );
    }

    // =========================
    // 3. ROLE_PERMISSIONS PIVOT TABLE
    // =========================
    const pivotExists = await queryRunner.hasTable("role_permissions");

    if (!pivotExists) {
      await queryRunner.createTable(
        new Table({
          name: "role_permissions",
          columns: [
            {
              name: "roleId",
              type: "int",
              isPrimary: true,
            },
            {
              name: "permissionId",
              type: "int",
              isPrimary: true,
            },
          ],
        }),
      );
    }

    // FK: role_permissions -> roles
    const pivotTable = await queryRunner.getTable("role_permissions");

    if (pivotTable) {
      const hasRoleFK = pivotTable.foreignKeys.find((fk) =>
        fk.columnNames.includes("roleId"),
      );

      if (!hasRoleFK) {
        await queryRunner.createForeignKey(
          "role_permissions",
          new TableForeignKey({
            columnNames: ["roleId"],
            referencedTableName: "roles",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          }),
        );
      }

      const hasPermissionFK = pivotTable.foreignKeys.find((fk) =>
        fk.columnNames.includes("permissionId"),
      );

      if (!hasPermissionFK) {
        await queryRunner.createForeignKey(
          "role_permissions",
          new TableForeignKey({
            columnNames: ["permissionId"],
            referencedTableName: "permissions",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = ["role_permissions", "permissions", "roles"];

    for (const tableName of tables) {
      const table = await queryRunner.getTable(tableName);

      if (table) {
        await queryRunner.dropForeignKeys(tableName, table.foreignKeys);

        await queryRunner.dropTable(tableName);
      }
    }
  }
}
