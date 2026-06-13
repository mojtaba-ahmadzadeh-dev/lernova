import { BaseEntity } from "common/abestract/base.entity";
import { BasketDiscountType } from "common/enums/discount-type.enum";
import { EntityNames } from "common/enums/entity.enum";
import { CourseEntity } from "modules/course/entities/course.entity";
import { UserEntity } from "modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity(EntityNames.Basket)
export class BasketEntity extends BaseEntity {
  @Column()
  courseId: number;
  @Column()
  userId: number;
  @Column({ type: "enum", enum: BasketDiscountType, nullable: true })
  type: string;
  @Column({ type: "int", default: 1 })
  quantity: number;
  @Column({ nullable: true })
  discountId: number;
  @ManyToOne(() => CourseEntity, (course) => course.baskets, {
    onDelete: "CASCADE",
  })
  course: CourseEntity;
  @ManyToOne(() => UserEntity, (user) => user.basket, { onDelete: "CASCADE" })
  user: UserEntity;
  // @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, {
  //   onDelete: "CASCADE",
  // })
  // discount: DiscountEntity;
}
