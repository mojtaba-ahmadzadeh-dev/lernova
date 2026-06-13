import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { CourseCategoryEntity } from "./course-category.entity";
import { EntityNames } from "common/enums/entity.enum";
import { BaseEntity } from "common/abestract/base.entity";
import { UserEntity } from "modules/user/entities/user.entity";
import { ChapterEntity } from "modules/chapter/entities/chapter.entity";
import { CommentEntity } from "modules/comment/entities/comment.entity";
import { BasketEntity } from "modules/basket/entities/basket.entity";

@Entity(EntityNames.Course)
export class CourseEntity extends BaseEntity {
  @Column()
  title: string;
  @Column({ type: "varchar", length: 450 })
  description: string;
  @Column({ type: "varchar", nullable: true })
  content: string;
  @Column({ type: "decimal", default: 0 })
  price: number;
  @Column({ default: false })
  isFree: boolean;
  @Column({ nullable: true, unique: true })
  shortLink: string;
  @Column({ nullable: true })
  cover: string;
  @Column({ default: false })
  isCompleted: boolean;
  @Column({ default: false })
  isPublished: boolean;
  @Column({ type: "float", default: 0 })
  rating: number;
  @Column({ default: false })
  hasCertificate: boolean;
  @Column({ type: "int", default: 0 })
  views: number;
  @OneToMany(() => CourseCategoryEntity, (category) => category.course)
  categories: CourseCategoryEntity[];
  @ManyToOne(() => UserEntity, (user) => user.taughtCourses, {
    onDelete: "SET NULL",
  })
  teacher: UserEntity;
  @OneToMany(() => ChapterEntity, (chapter) => chapter.course)
  chapters: ChapterEntity[];
  @OneToMany(() => CommentEntity, (comment) => comment.course)
  comments: CommentEntity[];
  @OneToMany(() => BasketEntity, (basket) => basket.course)
  baskets: BasketEntity[];
  // @OneToMany(() => OrderItemEntity, (order) => order.course)
  // orders: OrderItemEntity[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
