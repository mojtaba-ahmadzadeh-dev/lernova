import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from "@nestjs/common";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CourseDto, FilterCourseDto } from "./dto/create-course.dto";

import { ApiConsumes } from "@nestjs/swagger";
import { CourseService } from "./course.service";
import { CanAccess, SkipAuth } from "common/decorator/skip-auth-decorator";
import { UploadFile } from "common/utils/multer.util";
import { SwaggerConsumes } from "common/enums/swagger-consumes.enum";
import { Role } from "common/enums/role.enum";
import { Pagination } from "common/decorator/pagination.decorator";
import { PaginationDto } from "common/dto/pagination.dto";


@Controller("course")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @CanAccess(Role.Admin)
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFile("cover", "course"))
  create(
    @Body() courseDto: CourseDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    return this.courseService.create(courseDto, cover);
  }

  @Get("/all")
  @SkipAuth()
  @Pagination()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterCourseDto,
  ) {
    return this.courseService.findAll(paginationDto, filterDto);
  }

  @Patch("/:id")
  @CanAccess(Role.Admin)
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFile("cover", "course"))
  update(
    @Param("id") id: number,
    @Body() updateDto: UpdateCourseDto,
    @UploadedFile() cover?: Express.Multer.File,
  ) {
    return this.courseService.update(id, updateDto, cover);
  }

  @Delete("/:id")
  @CanAccess(Role.Admin)
  remove(@Param("id") id: number) {
    return this.courseService.remove(id);
  }

  @Get("/:id")
  @SkipAuth()
  findOne(@Param("id") id: number) {
    return this.courseService.findOne(id);
  }
}
