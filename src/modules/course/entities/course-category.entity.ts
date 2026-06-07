import { Column, Entity, ManyToOne } from "typeorm";
import { CourseEntity } from "./course.entity";
import { CategoryEntity } from "modules/category/entities/category.entity";
import { EntityNames } from "common/enums/entity.enum";
import { BaseEntity } from "common/abestract/base.entity";

@Entity(EntityNames.CourseCategory)
export class CourseCategoryEntity extends BaseEntity {
  @Column()
  courseId: number;
  @Column()
  categoryId: number;
  @ManyToOne(() => CourseEntity, (course) => course.categories, {
    onDelete: "CASCADE",
  })
  course: CourseEntity;
  @ManyToOne(() => CategoryEntity, (category) => category.course_categories, {
    onDelete: "CASCADE",
  })
  category: CategoryEntity;
}
