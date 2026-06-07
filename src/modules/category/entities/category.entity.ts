import { BaseEntity } from "common/abestract/base.entity";
import { EntityNames } from "common/enums/entity.enum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity {
  @Column()
  title: string;
  @Column()
  slug: string;
  @Column({ default: true })
  isActive: boolean;
  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    nullable: true,
    onDelete: "CASCADE",
  })
  parent: CategoryEntity;
  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];
  // @OneToMany(() => CourseCategoryEntity, (course) => course.category)
  // course_categories: CourseCategoryEntity[];
  // @OneToMany(() => BlogCategoryEntity, (blog) => blog.category)
  // blog_categories: BlogCategoryEntity[];
}
