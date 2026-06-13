import { Body, Controller, Get, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { BasketService } from "../basket/basket.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Permissions } from "common/decorator/permission.decorator";
import { RbacDecorator } from "common/decorator/auth.decorator";

@Controller("order")
@RbacDecorator()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly basketService: BasketService,
  ) {}

  @Get("/user")
  // @CanAccess(Role.User, Role.Admin)
  @Permissions("create:order")
  findUserOrders() {
    return this.orderService.findUserOrders();
  }

  @Get("/admin")
  // @CanAccess(Role.Admin)
  findAllOrdersForAdmin() {
    return this.orderService.findAllOrderForAdmin();
  }
}
