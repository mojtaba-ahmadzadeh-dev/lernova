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


@Controller("basket")
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  @Permissions("add:basket")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }

  // @Get()
  // basket() {
  //   return this.basketService.getBasket();
  // }

  // @Post("/discount")
  // @Permissions("apply_discount_for_basket")
  // @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  // applyDiscountForBasket(@Body() discountBasketDto: DiscountBasketDto) {
  //   return this.basketService.applyDiscount(discountBasketDto);
  // }

  // @Delete("discount")
  // @Permissions("remove:descount")
  // @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  // removeDiscountFormBasket(@Body() discountBasketDto: DiscountBasketDto) {
  //   return this.basketService.removeDiscountFormBasket(discountBasketDto);
  // }

  @Delete("/remove/:id")
  removeFromBasketId(@Param("id") id: number) {
    return this.basketService.removeFromBasketId(id);
  }
}
