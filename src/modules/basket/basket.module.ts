import { Module } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketController } from "./basket.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BasketEntity } from "./entities/basket.entity";
import { DiscountEntity } from "../discount/entities/discount.entity";
import { CourseEntity } from "../course/entities/course.entity";
import { CourseModule } from "../course/course.module";
import { DiscountModule } from "../discount/discount.module";
import { RbacModule } from "modules/rbac/rbac.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserModule } from "modules/user/user.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([BasketEntity, DiscountEntity, CourseEntity]),
    CourseModule,
    DiscountModule,
    RbacModule
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],   
})
export class BasketModule {}