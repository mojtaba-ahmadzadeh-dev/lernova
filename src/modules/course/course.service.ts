import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { isArray } from "class-validator";
import { randomBytes } from "crypto";

import * as fs from "fs";
import * as path from "path";
import { CourseEntity } from "./entities/course.entity";
import { CourseCategoryEntity } from "./entities/course-category.entity";
import { CategoryService } from "modules/category/category.service";
import { CourseDto, FilterCourseDto } from "./dto/create-course.dto";
import { CategoryMessage, CourseMessage } from "common/enums/message.enum";
import { PaginationDto } from "common/dto/pagination.dto";
import { paginationGenerator, paginationSolver } from "common/utils/pagination.utils";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable({ scope: Scope.REQUEST })
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(CourseCategoryEntity)
    private courseCategoryRepository: Repository<CourseCategoryEntity>,
    @Inject(REQUEST) private request: Request,
    private categoryService: CategoryService,
  ) {}

  async create(courseDto: CourseDto, cover: Express.Multer.File) {
    const user = this.request.user;

    let {
      title,
      description,
      content,
      hasCertificate,
      isCompleted,
      categories,
      isPublished,
      price,
    } = courseDto;

    if (typeof categories === "string") {
      categories = categories.split(",");
    } else if (!isArray(categories)) {
      throw new BadRequestException(CategoryMessage.InValidCategory);
    }

    await this.checkExistCourseByTitle(title);

    const filePath = `/uploads/course/${cover.filename}`;

    const generateShortLink = `http://localhost:${process.env.PORT}/courses/${randomBytes(5).toString("base64url")}`;

    let course = this.courseRepository.create({
      title,
      description,
      content,
      isFree: price > 0 ? false : true,
      isCompleted,
      isPublished,
      price,
      hasCertificate,
      cover: filePath,
      shortLink: generateShortLink,
      teacher: user,
    });

    course = await this.courseRepository.save(course);

    for (const title of categories) {
      let category = await this.categoryService.findOneByTitle(title);

      if (!category) {
        category = await this.categoryService.insertByTitle(title);
      }

      await this.courseCategoryRepository.insert({
        courseId: course.id,
        categoryId: category.id,
      });
    }

    return {
      message: CourseMessage.Created,
    };
  }

  async checkExistCourseByTitle(title: string) {
    const course = await this.courseRepository.findOneBy({ title });
    if (course) throw new ConflictException(CourseMessage.AlreadyCourse);
  }

  async findAll(paginationDto: PaginationDto, filterDto: FilterCourseDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);

    const query = this.courseRepository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.teacher", "teacher")
      .orderBy("course.createdAt", "DESC")
      .skip(skip)
      .take(limit);

    if (filterDto.search) {
      query.andWhere("course.title ILIKE :search", {
        search: `%${filterDto.search}%`,
      });
    }

    if (filterDto.isPublished !== undefined) {
      query.andWhere("course.isPublished = :isPublished", {
        isPublished: filterDto.isPublished,
      });
    }

    if (filterDto.isFree !== undefined) {
      query.andWhere("course.isFree = :isFree", {
        isFree: filterDto.isFree,
      });
    }

    const [courses, count] = await query.getManyAndCount();

    return {
      pagination: paginationGenerator(count, page, limit),
      courses,
    };
  }

  async update(
    id: number,
    updateDto: UpdateCourseDto,
    cover?: Express.Multer.File,
  ) {
    const course = await this.checkExistCourseById(id);

    const { title, categories, price, ...updateFields } = updateDto;

    if (title && title !== course.title) {
      await this.checkExistCourseByTitle(title);
      course.title = title;
    }

    if (cover) {
      course.cover = `/uploads/course/${cover.filename}`;
    }

    Object.assign(course, updateFields);
    if (price !== undefined) {
      course.price = price;
      course.isFree = price > 0 ? false : true;
    }

    if (categories) {
      let categoryList: string[];
      if (typeof categories === "string") {
        categoryList = categories.split(",");
      } else if (isArray(categories)) {
        categoryList = categories;
      } else {
        throw new BadRequestException(CategoryMessage.InValidCategory);
      }

      await this.courseCategoryRepository.delete({ courseId: id });

      for (const title of categoryList) {
        let category = await this.categoryService.findOneByTitle(title);
        if (!category) {
          category = await this.categoryService.insertByTitle(title);
        }
        await this.courseCategoryRepository.insert({
          courseId: id,
          categoryId: category.id,
        });
      }
    }

    await this.courseRepository.save(course);

    return {
      message: CourseMessage.Updated,
    };
  }

  async checkExistCourseById(id: number) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) throw new NotFoundException(CourseMessage.NotFound);
    return course;
  }

  async remove(id: number) {
    const course = await this.checkExistCourseById(id);

    await this.courseCategoryRepository.delete({ courseId: id });

    if (course.cover) {
      const filePath = path.join(process.cwd(), course.cover);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.courseRepository.delete(id);

    return {
      message: CourseMessage.Removed,
    };
  }
  
  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: { teacher: true },
    });

    if (!course) {
      throw new NotFoundException(CourseMessage.NotFound);
    }

    return course;
  }
}
