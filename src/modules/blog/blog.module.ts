import { Module } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { BlogController } from "./blog.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { BlogCategoryEntity } from "./entities/blog-category.entity";
import { BlogLikesEntity } from "./entities/blog-likes.entity";
import { BlogBookmarkEntity } from "./entities/blog-bookmark.entity";
import { CategoryService } from "../category/category.service";
import { CategoryModule } from "../category/category.module";

@Module({
  imports: [
    AuthModule,
    CategoryModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      BlogCategoryEntity,
      BlogLikesEntity,
      BlogBookmarkEntity,
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
