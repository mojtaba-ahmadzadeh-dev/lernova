import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { BasketEntity } from "../basket/entities/basket.entity";
import { BasketService } from "../basket/basket.service";
import { BasketModule } from "../basket/basket.module";
import { RbacModule } from "modules/rbac/rbac.module";
import { UserModule } from "modules/user/user.module";

@Module({
  imports: [AuthModule ,BasketModule, UserModule, RbacModule ,TypeOrmModule.forFeature([OrderEntity, BasketEntity])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
