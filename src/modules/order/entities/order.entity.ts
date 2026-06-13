import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { OrderItemEntity } from "./order-item.entity";
import { EntityNames } from "common/enums/entity.enum";
import { BaseEntity } from "common/abestract/base.entity";
import { OrderStatus } from "common/enums/status.enum";
import { UserEntity } from "modules/user/entities/user.entity";
// import { PaymentEntity } from "src/modules/payment/entities/payment.entity";

@Entity(EntityNames.Order)
export class OrderEntity extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  payment_amount: number;

  @Column()
  discount_amount: number;

  @Column()
  total_amount: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: string;

  @Column({ nullable: true })
  description: string;

  // relations

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items: OrderItemEntity[];

  // @OneToOne(() => PaymentEntity, (payment) => payment.order, {
  //   onDelete: "SET NULL",
  // })
  // payment: PaymentEntity;
}