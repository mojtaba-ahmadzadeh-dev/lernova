import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BasketEntity } from "./entities/basket.entity";
import { Repository } from "typeorm";

import { REQUEST } from "@nestjs/core";
import { BasketDto, DiscountBasketDto } from "./dto/basket.dto";
import type { Request } from "express";
import { CourseService } from "modules/course/course.service";
import { BasketMessage, DiscountMessage } from "common/enums/message.enum";
import { DiscountService } from "modules/discount/discount.service";
import { DiscountEntity } from "modules/discount/entities/discount.entity";

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private basketRepository: Repository<BasketEntity>,
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
    @Inject(REQUEST) private request: Request,
    private courseService: CourseService,
    private discountService: DiscountService,
  ) {}

  async addToBasket(basketDto: BasketDto) {
    const userId = this.request.user.id;
    const courseId = Number(basketDto.courseId);

    await this.courseService.checkExistCourseById(courseId);

    let basketItem = await this.basketRepository.findOne({
      where: {
        userId,
        courseId,
      },
    });

    if (basketItem) throw new ConflictException(BasketMessage.AlreadyCourse);

    basketItem = this.basketRepository.create({
      courseId,
      userId,
    });

    await this.basketRepository.save(basketItem);

    return {
      message: BasketMessage.AddToBasket,
    };
  }

  async getBasket() {
    const { id: userId } = this.request.user;

    let courses: any[] = [];

    let finalAmount = 0;
    let totalPrice = 0;
    let totalDiscountAmount = 0;
    let totalQuantity = 0;

    const items = await this.basketRepository.find({
      where: { userId },
      relations: {
        course: true,
        discount: true,
      },
    });

    if (!items.length) throw new NotFoundException(BasketMessage.NotFound);

    for (const item of items) {
      const quantity = item.quantity || 1;
      const coursePrice = +item.course.price;

      let finalPricePerItem = coursePrice;
      let discountAmountPerItem = 0;

      if (item.discount && item.discount.active) {
        if (
          item.discount.expires_in &&
          item.discount.expires_in.getTime() <= Date.now()
        ) {
          throw new BadRequestException(DiscountMessage.Expires_code);
        } else {
          if (item.discount.percent != null) {
            discountAmountPerItem =
              coursePrice * (+item.discount.percent / 100);
          } else if (item.discount.amount != null) {
            discountAmountPerItem = +item.discount.amount;
          }

          finalPricePerItem = coursePrice - discountAmountPerItem;
          if (finalPricePerItem < 0) {
            finalPricePerItem = 0;
          }
        }
      }

      totalPrice += coursePrice * quantity;
      totalDiscountAmount += discountAmountPerItem * quantity;
      finalAmount += finalPricePerItem * quantity;
      totalQuantity += quantity;

      courses.push({
        id: item.id,
        title: item.course.title,
        courseId: item.courseId,
        cover: item.course.cover,
        price: coursePrice,
        quantity,
        finalPrice: finalPricePerItem,
        totalItemPrice: finalPricePerItem * quantity,
        discountAmount: discountAmountPerItem,
      });
    }

    return {
      courses,
      totalPrice,
      totalDiscountAmount,
      finalAmount,
      totalQuantity,
    };
  }

  async applyDiscount(discountBasketDto: DiscountBasketDto) {
    const { id: userId } = this.request.user;
    const code = discountBasketDto.code;
    const courseId = Number(discountBasketDto.courseId);

    if (!code) throw new BadRequestException("کد تخفیف الزامی است");

    if (isNaN(courseId)) {
      throw new BadRequestException("شناسه دوره نامعتبر است");
    }

    const discount = await this.discountService.findOneByCode(code);

    if (!discount.active) {
      throw new BadRequestException(DiscountMessage.NotActive);
    }

    if (discount.limit && discount.limit <= discount.usege) {
      throw new BadRequestException(DiscountMessage.UsegeLimit);
    }

    if (
      discount?.expires_in &&
      discount?.expires_in?.getTime() <= new Date().getTime()
    ) {
      throw new BadRequestException(DiscountMessage.Expires_code);
    }

    const existingBasketItem = await this.basketRepository.findOne({
      where: {
        userId,
        courseId,
        discountId: discount.id,
      },
    });

    if (existingBasketItem) {
      throw new BadRequestException(DiscountMessage.AlreadyAppliedToCourse);
    }

    const userBasketDiscount = await this.basketRepository.findOneBy({
      discountId: discount.id,
      userId,
    });

    if (userBasketDiscount) {
      throw new BadRequestException(DiscountMessage.AlreadyUseDiscount);
    }

    const basketItem = this.basketRepository.create({
      courseId,
      discountId: discount.id,
      userId,
    });

    await this.basketRepository.save(basketItem);

    discount.usege = (discount.usege || 0) + 1;
    await this.discountRepository.save(discount);

    return {
      message: DiscountMessage.ApplyDiscount,
    };
  }

  async removeFromBasketId(id: number) {
    let basketItem = await this.basketRepository.findOneBy({ id });
    if (basketItem) {
      await this.basketRepository.delete({ id: basketItem.id });
    } else {
      throw new NotFoundException(BasketMessage.NotFound);
    }

    return {
      message: BasketMessage.Removed,
    };
  }

  async removeDiscountFormBasket(discountBasketDto: DiscountBasketDto) {
    const { id: userId } = this.request.user;
    const { code } = discountBasketDto;

    if (!code) {
      throw new BadRequestException("کد تخفیف الزامی است");
    }

    const discount = await this.discountService.findOneByCode(code);

    const basketDiscount = await this.basketRepository.findOne({
      where: {
        discountId: discount.id,
      },
    });

    if (!basketDiscount) throw new NotFoundException(DiscountMessage.NotFound);

    await this.basketRepository.delete({
      discountId: discount.id,
      userId,
    });

    return {
      message: DiscountMessage.Removed,
    };
  }
}
