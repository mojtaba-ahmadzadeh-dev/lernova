import { Module } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketController } from "./basket.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BasketEntity } from "./entities/basket.entity";
import { DiscountEntity } from "../discount/entities/discount.entity";
import { CourseService } from "../course/services/course.service";
import { DiscountService } from "../discount/discount.service";
import { CourseEntity } from "../course/entities/course.entity";
import { CourseModule } from "../course/course.module";
import { DiscountModule } from "../discount/discount.module";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([BasketEntity, DiscountEntity, CourseEntity]),
    CourseModule, // 👈 به جای CourseService
    DiscountModule,
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService]
})
export class BasketModule {}
