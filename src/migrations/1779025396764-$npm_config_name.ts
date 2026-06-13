import { EntityNames } from "common/enums/entity.enum";
import { Role } from "common/enums/role.enum";
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
} from "typeorm";

export class InitDatabase1779025396764 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========================
    // USER TABLE
    // ========================
    const hasUserTable = await queryRunner.hasTable(EntityNames.User);

    if (!hasUserTable) {
      await queryRunner.createTable(
        new Table({
          name: EntityNames.User,
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            { name: "mobile", type: "varchar", length: "20", isNullable: true, isUnique: true },
            { name: "email", type: "varchar", length: "100", isNullable: true, isUnique: true },
            { name: "fullName", type: "varchar", length: "100", isNullable: true },
            { name: "password", type: "varchar", isNullable: true },

            {
              name: "role",
              type: "enum",
              enum: [Role.User, Role.Admin],
              enumName: "user_roles_enum",
              default: `'${Role.User}'`,
              isNullable: true,
            },

            { name: "avatar", type: "varchar", isNullable: true },
            { name: "isVerified", type: "boolean", default: false },
            { name: "createdAt", type: "timestamp", default: "now()" },
            { name: "updatedAt", type: "timestamp", default: "now()" },
          ],
        }),
        true,
      );
    }

    // ========================
    // isBanned
    // ========================
    if (!(await queryRunner.hasColumn(EntityNames.User, "isBanned"))) {
      await queryRunner.addColumn(
        EntityNames.User,
        new TableColumn({
          name: "isBanned",
          type: "boolean",
          default: false,
        }),
      );
    }

    // ========================
    // role_id
    // ========================
    if (!(await queryRunner.hasColumn(EntityNames.User, "role_id"))) {
      await queryRunner.addColumn(
        EntityNames.User,
        new TableColumn({
          name: "role_id",
          type: "int",
          isNullable: true,
        }),
      );
    }

    // ========================
    // FIX: MIGRATION DATA (SAFE)
    // ========================
    let users: any[] = [];

    try {
      users = await queryRunner.query(`SELECT id, role FROM "user"`);
    } catch {
      users = [];
    }

    for (const user of users) {
      if (!user.role) continue;

      const roleRow = await queryRunner.query(
        `SELECT id FROM "roles" WHERE name = $1 LIMIT 1`,
        [user.role],
      );

      if (roleRow.length > 0) {
        await queryRunner.query(
          `UPDATE "user" SET role_id = $1 WHERE id = $2`,
          [roleRow[0].id, user.id],
        );
      }
    }

    // ========================
    // FK FIXED HERE
    // ========================
    const userTable = await queryRunner.getTable(EntityNames.User);

    const fkExists = userTable?.foreignKeys.find((fk) =>
      fk.columnNames.includes("role_id"),
    );

    if (!fkExists) {
      await queryRunner.createForeignKey(
        EntityNames.User,
        new TableForeignKey({
          columnNames: ["role_id"],
          referencedTableName: "roles", // 👈 FIX اصلی اینجاست
          referencedColumnNames: ["id"],
          onDelete: "SET NULL",
        }),
      );
    }

    // drop old role column
    if (await queryRunner.hasColumn(EntityNames.User, "role")) {
      await queryRunner.dropColumn(EntityNames.User, "role");
    }

    // ========================
    // OTP TABLE
    // ========================
    if (!(await queryRunner.hasTable(EntityNames.Otp))) {
      await queryRunner.createTable(
        new Table({
          name: EntityNames.Otp,
          columns: [
            { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
            { name: "code", type: "varchar", length: "6" },
            { name: "expires_in", type: "timestamp" },
            { name: "method", type: "varchar", isNullable: true },
            { name: "userId", type: "int" },
            { name: "createdAt", type: "timestamp", default: "now()" },
            { name: "updatedAt", type: "timestamp", default: "now()" },
          ],
        }),
        true,
      );
    }

    // FK OTP
    const otpTable = await queryRunner.getTable(EntityNames.Otp);

    const otpFkExists = otpTable?.foreignKeys.find((fk) =>
      fk.columnNames.includes("userId"),
    );

    if (!otpFkExists) {
      await queryRunner.createForeignKey(
        EntityNames.Otp,
        new TableForeignKey({
          columnNames: ["userId"],
          referencedTableName: EntityNames.User,
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(EntityNames.Otp, true);
    await queryRunner.dropTable(EntityNames.User, true);

    await queryRunner.query(`DROP TYPE IF EXISTS "user_roles_enum"`);
  }
}