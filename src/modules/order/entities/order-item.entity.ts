import { Column, Entity, ManyToOne } from "typeorm";
import { OrderEntity } from "./order.entity";
import { EntityNames } from "common/enums/entity.enum";
import { BaseEntity } from "common/abestract/base.entity";
import { OrderItemStatus } from "common/enums/status.enum";
import { CourseEntity } from "modules/course/entities/course.entity";


@Entity(EntityNames.OrderItem)
export class OrderItemEntity extends BaseEntity {
  @Column()
  courseId: number;
  @Column()
  orderId: number
  @Column({
    type: "enum",
    enum: OrderItemStatus,
    default: OrderItemStatus.Pending,
  })
  status: string;
  @ManyToOne(() => CourseEntity, (course) => course.orders, {
    onDelete: "CASCADE",
  })
  course: CourseEntity;
  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: "CASCADE",
  })
  order: OrderEntity;
}
