import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CategoryService } from "../category/category.service";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogBookmarkEntity } from "./entities/blog-bookmark.entity";
import { BlogLikesEntity } from "./entities/blog-likes.entity";
import { BlogCategoryEntity } from "./entities/blog-category.entity";
import { BlogEntity } from "./entities/blog.entity";
import { Repository } from "typeorm";

import { isArray } from "class-validator";
import { BlogDto } from "./dto/blog.dto";
import type { Request } from "express";
import { BlogMessage, CategoryMessage, ConflictMessage } from "common/enums/message.enum";
import { BlogStatus } from "common/decorator/status.enum";


@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogLikesEntity)
    private blogLikeRepository: Repository<BlogLikesEntity>,
    @InjectRepository(BlogBookmarkEntity)
    private blogBookmarkRepository: Repository<BlogBookmarkEntity>,
    @Inject(REQUEST) private request: Request,
    private categoryService: CategoryService,
  ) {}

  async create(blogDto: BlogDto, image: Express.Multer.File) {
    const user = this.request.user;

    let { title, description, content, slug, time_for_stady, categories } =
      blogDto;

    slug = slug
      ? this.generateSlug(slug)
      : this.generateSlug(title.split(" ").join("-"));

    if (!isArray(categories) && typeof categories === "string") {
      categories = categories.split(",");
    } else if (!isArray(categories)) {
      throw new BadRequestException(CategoryMessage.InValidCategory);
    }

    await this.checkExistBlogByTitle(title);

    const isExistSlug = await this.checkBlogBySlug(slug);
    if (isExistSlug) throw new ConflictException(ConflictMessage.AlreadySlug);

    const imageUrl = `/uploads/${image.filename}`;

    let blog = this.blogRepository.create({
      title,
      description,
      content,
      slug,
      image: imageUrl,
      imageKey: image.filename,
      status: BlogStatus.Draft,
      time_for_stady,
      authorId: user.id,
    });

    blog = await this.blogRepository.save(blog);

    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }

      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }

    return {
      message: BlogMessage.Created,
    };
  }

  async findAll() {
    return await this.blogRepository.find({
      relations: {
        categories: {
          category: true,
        },
      },
      order: {
        created_at: "DESC",
      },
    });
  }

  private generateSlug(slug: string): string {
    if (!slug) return "";

    let cleanSlug = slug.startsWith("/") ? slug.slice(1) : slug;

    return `/${cleanSlug}`;
  }

  async findOneBySlug(slug: string) {
    const blog = await this.blogRepository.findOne({
      where: { slug },
      relations: {
        categories: {
          category: true,
        },
        // اگر در آینده نویسنده یا کامنت‌ها را هم اضافه کردید، اینجا اضافه کنید
        // author: true
      },
    });

    if (!blog) {
      throw new NotFoundException(BlogMessage.NotFound); // فرض بر اینکه این پیام در enum موجود است
    }

    return blog;
  }

  async findOneById(id: number) {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: {
        categories: {
          category: true,
        },
      },
    });

    if (!blog) {
      throw new NotFoundException(BlogMessage.NotFound);
    }

    return blog;
  }

  async toggleBookmark(blogId: number) {
    const userId = this.request.user.id;

    const blog = await this.blogRepository.findOneBy({ id: blogId });
    if (!blog) throw new NotFoundException(BlogMessage.NotFound);

    const isBookmarked = await this.blogBookmarkRepository.findOneBy({
      blogId,
      userId,
    });

    if (isBookmarked) {
      await this.blogBookmarkRepository.delete({ id: isBookmarked.id });
      return { message: "بلاگ از لیست بوک‌مارک‌ها حذف شد" };
    } else {
      await this.blogBookmarkRepository.insert({
        blogId,
        userId,
      });
      return { message: "بلاگ به لیست بوک‌مارک‌ها اضافه شد" };
    }
  }

  async toggleLike(blogId: number) {
    const userId = this.request.user.id;

    const blog = await this.blogRepository.findOneBy({ id: blogId });
    if (!blog) throw new NotFoundException(BlogMessage.NotFound);

    const isLiked = await this.blogLikeRepository.findOneBy({
      blogId,
      userId,
    });

    if (isLiked) {
      await this.blogLikeRepository.delete({ id: isLiked.id });
      return { message: "لایک برداشته شد" };
    } else {
      await this.blogLikeRepository.insert({
        blogId,
        userId,
      });
      return { message: "بلاگ لایک شد" };
    }
  }

  async update(
    id: number,
    blogDto: Partial<BlogDto>,
    image?: Express.Multer.File,
  ) {
    const blog = await this.findOneById(id);

    // ۱. آپدیت Slug (فقط اگر در بدنه درخواست باشد)
    if (blogDto.slug) {
      const newSlug = this.generateSlug(blogDto.slug);
      const isExistSlug = await this.blogRepository.findOne({
        where: { slug: newSlug },
      });
      if (isExistSlug && isExistSlug.id !== id)
        throw new ConflictException(ConflictMessage.AlreadySlug);
      blog.slug = newSlug;
    }

    // ۲. آپدیت تصویر
    if (image) {
      blog.image = `/uploads/${image.filename}`;
      blog.imageKey = image.filename;
    }

    // ۳. آپدیت سایر فیلدها (فقط اگر مقدار داشته باشند)
    // استفاده از شرط های منطقی برای اینکه مقدار نال یا آندفایند جایگزین دیتای اصلی نشود
    if (blogDto.title) {
      await this.checkExistBlogByTitle(blogDto.title); // چک تایتل جدید
      blog.title = blogDto.title;
    }

    if (blogDto.description) blog.description = blogDto.description;
    if (blogDto.content) blog.content = blogDto.content;
    if (blogDto.time_for_stady) blog.time_for_stady = blogDto.time_for_stady;

    await this.blogRepository.save(blog);

    // ۴. آپدیت دسته‌بندی‌ها (فقط اگر در ریکوئست باشند)
    if (blogDto.categories) {
      let categories = blogDto.categories;
      if (!isArray(categories) && typeof categories === "string") {
        categories = categories.split(",");
      }

      await this.blogCategoryRepository.delete({ blogId: id });

      for (const categoryTitle of categories) {
        let category = await this.categoryService.findOneByTitle(categoryTitle);
        if (!category) {
          category = await this.categoryService.insertByTitle(categoryTitle);
        }
        await this.blogCategoryRepository.insert({
          blogId: id,
          categoryId: category.id,
        });
      }
    }

    return { message: "بلاگ با موفقیت بروزرسانی شد" };
  }

  async checkExistBlogByTitle(title: string) {
    const blog = await this.blogRepository.findOneBy({ title });
    if (blog) throw new ConflictException(BlogMessage.AlreadyBlog);
  }

  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return blog;
  }
}
