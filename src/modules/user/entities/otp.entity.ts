import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { BaseEntity } from "common/abestract/base.entity";
import { EntityNames } from "common/enums/entity.enum";

@Entity(EntityNames.Otp)
export class otpEntity extends BaseEntity {
  @Column()
  code: string;

  @Column()
  expires_in: Date;

  @Column({ nullable: true })
  method?: string;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.otps, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
