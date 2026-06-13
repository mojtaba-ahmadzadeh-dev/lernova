import { Module } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "./entities/course.entity";
import { CourseCategoryEntity } from "./entities/course-category.entity";
import { CategoryModule } from "../category/category.module";
import { AuthModule } from "../auth/auth.module";
import { CourseService } from "./course.service";
import { RbacModule } from "modules/rbac/rbac.module";
import { UserModule } from "modules/user/user.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([CourseEntity, CourseCategoryEntity]),
    CategoryModule,
    RbacModule
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService, TypeOrmModule],
})
export class CourseModule {}
