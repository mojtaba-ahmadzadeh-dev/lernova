
import { BaseEntity } from "common/abestract/base.entity";
import { EntityNames } from "common/enums/entity.enum";
import { BlogEntity } from "modules/blog/entities/blog.entity";
import { CourseEntity } from "modules/course/entities/course.entity";
import { UserEntity } from "modules/user/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity(EntityNames.Comment)
export class CommentEntity extends BaseEntity {
  @Column()
  text: string;

  @Column()
  targetId: number;

  @Column()
  targetType: string;

  @Column({ type: "int", nullable: true })
  parentId: number | null;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  author: UserEntity;

  @Column({ default: false })
  accepted: boolean;

  @ManyToOne(() => BlogEntity, (blog) => blog.comments, { nullable: true })
  @JoinColumn({ name: "targetId", referencedColumnName: "id" })
  blog: BlogEntity;

  @ManyToOne(() => CourseEntity, (course) => course.comments, {
    nullable: true,
  })
  @JoinColumn({ name: "targetId", referencedColumnName: "id" })
  course: CourseEntity;
}
