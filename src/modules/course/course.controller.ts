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
  UseGuards,
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
import { Permissions } from "common/decorator/permission.decorator";
import { PermissionsList } from "common/constants/permissions.constants";
import { RbacGuard } from "modules/rbac/guard/rbac.guard";
import { RbacDecorator } from "common/decorator/auth.decorator";

@Controller("course")
@RbacDecorator()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Permissions(PermissionsList.CREATE_COURSE)
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
  @Permissions(PermissionsList.UPDATE_COURSE)
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
  @Permissions(PermissionsList.REMOVE_COURSE)
  remove(@Param("id") id: number) {
    return this.courseService.remove(id);
  }

  @Get("/:id")
  @SkipAuth()
  findOne(@Param("id") id: number) {
    return this.courseService.findOne(id);
  }
}
