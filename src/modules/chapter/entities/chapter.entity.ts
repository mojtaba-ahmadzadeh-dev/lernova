import { BaseEntity } from "common/abestract/base.entity";
import { EntityNames } from "common/enums/entity.enum";
import { CourseEntity } from "modules/course/entities/course.entity";
// import { SesstionEntity } from "modules/sesstion/entities/sesstion.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";


@Entity(EntityNames.Chapter)
export class ChapterEntity extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  title: string;
  @Column({ type: "text", nullable: true })
  description?: string;
  @Column({ type: "int", default: 1 })
  order: number;
  @ManyToOne(() => CourseEntity, (course) => course.chapters, {
    onDelete: "CASCADE",
  })
  course: CourseEntity;
  // @OneToMany(() => SesstionEntity, (sesstion) => sesstion.chapter)
  // sesstions: SesstionEntity[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
