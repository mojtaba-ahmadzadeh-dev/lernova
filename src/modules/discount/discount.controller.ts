import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { DiscountService } from "./discount.service";
import { ApiConsumes } from "@nestjs/swagger";
import { DiscountDto } from "./dto/discount.dto";
import { SwaggerConsumes } from "common/enums/swagger-consumes.enum";
import { Permissions } from "common/decorator/permission.decorator";
import { PermissionsList } from "common/constants/permissions.constants";
import { RbacDecorator } from "common/decorator/auth.decorator";

@Controller("discount")
@RbacDecorator()
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @Permissions(PermissionsList.CREATE_DISCOUNT)
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  async create(@Body() dto: DiscountDto) {
    return await this.discountService.create(dto);
  }

  @Get()
  @Permissions(PermissionsList.FIND_DISCOUNT)
  async findAll() {
    return await this.discountService.findAll();
  }

  @Get(":id")
  @Permissions(PermissionsList.FIND_ONE_DISCOUNT)
  async findOne(@Param("id") id: number) {
    return await this.discountService.findOne(id);
  }

  @Delete(":id")
  @Permissions(PermissionsList.REMOVE_DISCOUNT)
  async remove(@Param("id") id: number) {
    return await this.discountService.remove(id);
  }
}
