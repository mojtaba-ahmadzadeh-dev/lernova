import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { BasketService } from "./basket.service";
import { ApiConsumes } from "@nestjs/swagger";
import { Permissions } from "common/decorator/permission.decorator";
import { SwaggerConsumes } from "common/enums/swagger-consumes.enum";
import { BasketDto, DiscountBasketDto } from "./dto/basket.dto";
import { PermissionsList } from "common/constants/permissions.constants";
import { RbacDecorator } from "common/decorator/auth.decorator";

@Controller("basket")
@RbacDecorator()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  @Permissions(PermissionsList.ADD_TO_BASKET)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }

  @Get()
  basket() {
    return this.basketService.getBasket();
  }

  @Post("/discount")
  @Permissions(PermissionsList.APPLY_DISCOUNT_TO_BASKET)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  applyDiscountForBasket(@Body() discountBasketDto: DiscountBasketDto) {
    return this.basketService.applyDiscount(discountBasketDto);
  }

  @Delete("discount")
  @Permissions(PermissionsList.REMOVE_DISCOUNT_FROM_BASKET)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  removeDiscountFormBasket(@Body() discountBasketDto: DiscountBasketDto) {
    return this.basketService.removeDiscountFormBasket(discountBasketDto);
  }

  @Delete("/remove/:id")
  removeFromBasketId(@Param("id") id: number) {
    return this.basketService.removeFromBasketId(id);
  }
}
