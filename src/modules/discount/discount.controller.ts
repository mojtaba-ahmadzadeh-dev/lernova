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

@Controller("discount")
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @Permissions("create:discount")
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  async create(@Body() dto: DiscountDto) {
    return await this.discountService.create(dto);
  }

  @Get()
  @Permissions("find:discount")
  async findAll() {
    return await this.discountService.findAll();
  }

  @Get(":id")
  @Permissions("findOne:discount")
  async findOne(@Param("id") id: number) {
    return await this.discountService.findOne(id);
  }

  @Delete(":id")
  @Permissions("remove:discount")
  async remove(@Param("id") id: number) {
    return await this.discountService.remove(id);
  }
}
