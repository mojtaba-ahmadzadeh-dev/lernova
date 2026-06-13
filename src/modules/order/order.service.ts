import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { DeepPartial, Repository } from "typeorm";
import { DataSource } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { OrderItemEntity } from "./entities/order-item.entity";
import type { Request } from "express";
import { BasketEntity } from "../basket/entities/basket.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { BasketType } from "common/types";

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(BasketEntity)
    private basketRepository: Repository<BasketEntity>,
    @Inject(REQUEST) private request: Request,
    private dataSource: DataSource,
  ) {}

  async findUserOrders() {
    const { id: userId } = this.request.user;

    return this.orderRepository.find({ where: { userId } });
  }

  // async create(basket: BasketType, paymentDto: PaymentDto) {
  //   const { description } = paymentDto;
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const { id: userId } = this.request.user;
  //     const { courses, finalAmount, totalDiscountAmount, totalPrice } = basket;

  //     let order = queryRunner.manager.create(OrderEntity, {
  //       userId,
  //       total_amount: totalPrice,
  //       discount_amount: totalDiscountAmount,
  //       payment_amount: finalAmount,
  //       description,
  //       status: OrderStatus.Pending,
  //     });

  //     order = await queryRunner.manager.save(OrderEntity, order);

  //     let orderItems: DeepPartial<OrderItemEntity>[] = [];
  //     for (const item of courses) {
  //       orderItems.push({
  //         courseId: Number(item.courseId),
  //         orderId: order.id,
  //         status: OrderItemStatus.Pending,
  //       });
  //     }
  //     if (orderItems.length > 0) {
  //       await queryRunner.manager.insert(OrderItemEntity, orderItems);
  //     } else {
  //       throw new BadRequestException("سفارش های شما خالی می باشد");
  //     }

  //     await queryRunner.commitTransaction();
  //     await queryRunner.release();
  //     return order;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     await queryRunner.release();
  //     throw error;
  //   }
  // }

  async findAllOrderForAdmin() {
    return this.orderRepository.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException("");
    return order;
  }

  async save(order: OrderEntity) {
    return await this.orderRepository.findOneBy(order);
  }
}
