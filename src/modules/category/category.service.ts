import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { CategoryDto } from "./dto/create-category.dto";
import slugify from "slugify";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryMessage, ConflictMessage, PublicMessage } from "common/enums/message.enum";
import { PaginationDto } from "common/dto/pagination.dto";
import { paginationGenerator, paginationSolver } from "common/utils/pagination.utils";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(categoryDto: CategoryDto) {
    let { title, parentId, isActive } = categoryDto;

    title = await this.checkExistByTitle(title);

    let parentCategory: CategoryEntity | null = null;

    if (parentId) {
      const parentIdNumber = Number(parentId);

      if (isNaN(parentIdNumber)) {
        throw new NotFoundException(CategoryMessage.InvalidParentId);
      }

      parentCategory = await this.categoryRepository.findOneBy({
        id: parentIdNumber,
      });

      if (!parentCategory) {
        throw new NotFoundException(CategoryMessage.NotFound);
      }
    }

    const slug = slugify(title, { lower: true, strict: true });

    const category = this.categoryRepository.create({
      title,
      slug,
      isActive,
      parent: parentCategory ?? undefined,
    });

    await this.categoryRepository.save(category);

    return {
      message: CategoryMessage.Created,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    let [categories, count] = await this.categoryRepository.findAndCount({
      relations: ["children", "parent"],
      skip,
      take: limit,
    });

    categories = categories.filter((category) => !category.parent);

    return {
      categories,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const { title, isActive, slug } = updateCategoryDto;
    if (title) category.title = title;
    if (slug) category.slug = slug;
    if (isActive) category.isActive = isActive;

    await this.categoryRepository.save(category);

    return {
      message: CategoryMessage.Updated,
    };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["children"],
    });
    if (!category) throw new NotFoundException(PublicMessage.NotFound);
    return category;
  }

  async findOneBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ["children", "parent"],
    });

    if (!category) {
      throw new NotFoundException(CategoryMessage.NotFound);
    }

    return {
      category,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.categoryRepository.delete({ id });

    return {
      message: CategoryMessage.Removed,
    };
  }

  async checkExistByTitle(title: string) {
    title = title?.trim()?.toLowerCase();

    const category = await this.categoryRepository.findOneBy({ title });

    if (category) {
      throw new ConflictException(ConflictMessage.AlreadyCategory);
    }

    return title;
  }

  async findOneByTitle(title: string) {
    return this.categoryRepository.findOneBy({ title });
  }

  async insertByTitle(title: string) {
    const category = this.categoryRepository.create({
      title,
      slug: title,
      isActive: false,
    });

    return await this.categoryRepository.save(category);
  }
}
