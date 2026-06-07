import { Module } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "./entities/course.entity";
import { CourseCategoryEntity } from "./entities/course-category.entity";
import { CategoryModule } from "../category/category.module";
import { AuthModule } from "../auth/auth.module";
import { CourseService } from "./course.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([CourseEntity, CourseCategoryEntity]),
    CategoryModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService, TypeOrmModule],
})
export class CourseModule {}
