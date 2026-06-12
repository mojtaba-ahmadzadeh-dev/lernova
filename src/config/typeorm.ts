import { config } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";

config({ path: join(process.cwd(), ".env") });

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

let dataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  password: DB_PASSWORD,
  username: DB_USERNAME,
  database: DB_NAME,
  port: Number(DB_PORT),
  synchronize: true,
  entities: [__dirname + "/../**/*.entity.{ts,js}"],
  migrations: [__dirname + "/../modules/**/migrations/*{.ts,.js}"],
  migrationsTableName: "lernova_migration_db",
});

export default dataSource;
