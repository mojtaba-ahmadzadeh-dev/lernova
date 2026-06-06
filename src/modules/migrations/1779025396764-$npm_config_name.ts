import { EntityNames } from "src/common/enums/entity.enum";
import { Role } from "src/common/enums/role.enum";
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
            {
              name: "mobile",
              type: "varchar",
              length: "20",
              isNullable: true,
              isUnique: true,
            },
            {
              name: "email",
              type: "varchar",
              length: "100",
              isUnique: true,
              isNullable: true,
            },
            {
              name: "fullName",
              type: "varchar",
              length: "100",
              isNullable: true,
            },
            {
              name: "password",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "role",
              type: "enum",
              enum: [Role.User, Role.Admin],
              enumName: "user_roles_enum",
              default: `'${Role.User}'`,
            },
            {
              name: "avatar",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "isVerified",
              type: "boolean",
              default: "false",
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
        true,
      );
    }

    // ========================
    // ADD isBanned COLUMN
    // ========================
    const hasIsBanned = await queryRunner.hasColumn(EntityNames.User, "isBanned");

    if (!hasIsBanned) {
      await queryRunner.addColumn(
        EntityNames.User,
        new TableColumn({
          name: "isBanned",
          type: "boolean",
          default: false,
          isNullable: false,
        }),
      );
    }

    // ========================
    // OTP TABLE
    // ========================
    const hasOtpTable = await queryRunner.hasTable(EntityNames.Otp);

    if (!hasOtpTable) {
      await queryRunner.createTable(
        new Table({
          name: EntityNames.Otp,
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            {
              name: "code",
              type: "varchar",
              length: "6",
              isNullable: false,
            },
            {
              name: "expires_in",
              type: "timestamp",
              isNullable: false,
            },
            {
              name: "method",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "userId",
              type: "int",
              isNullable: false,
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
        true,
      );
    }

    // ========================
    // FK OTP -> USER
    // ========================
    const otpTable = await queryRunner.getTable(EntityNames.Otp);

    const fkExists = otpTable?.foreignKeys.find((fk) =>
      fk.columnNames.includes("userId"),
    );

    if (!fkExists) {
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
    const otpTable = await queryRunner.getTable(EntityNames.Otp);

    if (otpTable) {
      const fk = otpTable.foreignKeys.find((f) =>
        f.columnNames.includes("userId"),
      );

      if (fk) {
        await queryRunner.dropForeignKey(EntityNames.Otp, fk);
      }
    }

    await queryRunner.dropTable(EntityNames.Otp, true);
    await queryRunner.dropTable(EntityNames.User, true);

    await queryRunner.query(`DROP TYPE IF EXISTS "user_roles_enum"`);
  }
}
