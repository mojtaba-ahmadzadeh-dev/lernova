import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { otpEntity } from "./otp.entity";
import { EntityNames } from "common/enums/entity.enum";
import { BaseEntity } from "common/abestract/base.entity";
import { Role } from "common/enums/role.enum";
import { CourseEntity } from "modules/course/entities/course.entity";

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
  @OneToMany(() => CourseEntity, (course) => course.teacher, { cascade: true })
  taughtCourses: CourseEntity[];
}
