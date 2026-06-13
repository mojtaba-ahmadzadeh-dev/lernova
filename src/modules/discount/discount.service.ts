import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { DiscountEntity } from "./entities/discount.entity";
import { DiscountDto } from "./dto/discount.dto";
import { CourseEntity } from "../course/entities/course.entity";
import { DiscountMessage } from "common/enums/message.enum";

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,

    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
  ) {}

  async create(dto: DiscountDto) {
    if (!dto.percent && !dto.amount) {
      throw new BadRequestException(DiscountMessage.InValidDiscountField);
    }

    if (dto.courseId) {
      const course = await this.courseRepository.findOneBy({
        id: dto.courseId,
      });
      if (!course) {
        throw new NotFoundException(DiscountMessage.NotFound);
      }
    }

    const isExist = await this.discountRepository.findOneBy({ code: dto.code });
    if (isExist) {
      throw new ConflictException(DiscountMessage.AlreadyDiscount);
    }

    const newDiscount = this.discountRepository.create({
      code: dto.code,
      percent: dto.percent,
      amount: dto.amount,
      courseId: dto.courseId,
      limit: dto.limit,
      expires_in: dto.expires_in ? new Date(dto.expires_in) : undefined,
      active: true,
      usege: 0,
    });

    return await this.discountRepository.save(newDiscount);
  }

  async findAll() {
    return await this.discountRepository.find({
      order: { id: "DESC" },
    });
  }

  async findOne(id: number) {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) {
      throw new NotFoundException(DiscountMessage.NotFound);
    }
    return discount;
  }

  async remove(id: number) {
    const discount = await this.findOne(id);

    await this.discountRepository.remove(discount);

    return {
      message: DiscountMessage.Removed,
    };
  }

  async findOneByCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (!discount) throw new NotFoundException(DiscountMessage.NotFound);
    return discount;
  }
}
