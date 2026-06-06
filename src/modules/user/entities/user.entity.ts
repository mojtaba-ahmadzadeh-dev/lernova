import { BaseEntity } from "src/common/abestract/base.entity";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { otpEntity } from "./otp.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Role } from "src/common/enums/role.enum";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  email: string;
  @Column({ unique: true, nullable: true })
  mobile: string;
  @Column({ nullable: true })
  fullName: string;
  @Column({ select: false, nullable: true })
  password: string;
  @Column({ default: false })
  isBanned: boolean;
  @Column({ type: "enum", default: Role.User, enum: Role })
  role: Role;
  @Column({ nullable: true })
  avatar?: string;
  @Column({ default: false })
  isVerified: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => otpEntity, (otp) => otp.user)
  otps: otpEntity[];
}
