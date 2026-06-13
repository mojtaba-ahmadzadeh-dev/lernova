import { BaseEntity } from "common/abestract/base.entity";
import { EntityNames } from "common/enums/entity.enum";
import { BasketEntity } from "modules/basket/entities/basket.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity(EntityNames.Discount)
export class DiscountEntity extends BaseEntity {
  @Column()
  code: string;
  @Column({ type: "numeric", nullable: true })
  percent: number;
  @Column({ type: "numeric", nullable: true })
  amount: number;
  @Column({ nullable: true })
  expires_in: Date;
  @Column({ nullable: true })
  limit: number;
  @Column({ nullable: true, default: 0 })
  usege: number;
  @Column({ default: true })
  active: boolean;
  @Column({ nullable: true })
  courseId: number;
  @OneToMany(() => BasketEntity, (basket) => basket.discount)
  baskets: BasketEntity[];
}
