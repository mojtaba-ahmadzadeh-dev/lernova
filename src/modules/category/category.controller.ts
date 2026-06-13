import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDto } from "./dto/create-category.dto";

import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CanAccess, SkipAuth } from "common/decorator/skip-auth-decorator";
import { Role } from "common/enums/role.enum";
import { Pagination } from "common/decorator/pagination.decorator";
import { PaginationDto } from "common/dto/pagination.dto";
import { PermissionsList } from "common/constants/permissions.constants";
import { Permissions } from "common/decorator/permission.decorator";
import { RbacDecorator } from "common/decorator/auth.decorator";

@Controller("category")
@RbacDecorator()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  @Permissions(PermissionsList.CREATE_CATEGORY)
  create(@Body() categoryDto: CategoryDto) {
    return this.categoryService.create(categoryDto);
  }

  @Get()
  @SkipAuth()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(":slug")
  @SkipAuth()
  findOneBySlug(@Param("slug") slug: string) {
    return this.categoryService.findOneBySlug(slug);
  }

  @Patch(":id")
  @Permissions(PermissionsList.UPDATE_CATEGORY)
  update(
    @Param("id") id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  @Permissions(PermissionsList.REMOVE_CATEGORY)
  remove(@Param("id") id: number) {
    return this.categoryService.remove(id);
  }
}
