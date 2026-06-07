import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AuthModule } from "../auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";
// import { TypeOrmDbConfig } from "src/config/typeorm.config";
// import { UserModule } from "../user/user.module";
import { HttpModule } from "@nestjs/axios";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { TypeOrmDbConfig } from "../../config/typeorm.config";
import { CategoryModule } from "modules/category/category.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), ".env"),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDbConfig,
    }),
    AuthModule,
    UserModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
