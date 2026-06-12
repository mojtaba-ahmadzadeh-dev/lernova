import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SesstionEntity } from "./entities/sesstion.entity";
import { ChapterEntity } from "../chapter/entities/chapter.entity";
import { Repository } from "typeorm";
import { SesstionDto } from "./dto/sesstion.dto";
import { ChapterMessage, SesstionMessage } from "common/enums/message.enum";


@Injectable()
export class SesstionService {
  constructor(
    @InjectRepository(SesstionEntity)
    private sesstionRepository: Repository<SesstionEntity>,
    @InjectRepository(ChapterEntity)
    private chapterRepository: Repository<ChapterEntity>,
  ) {}

  async create(sesstionDto: SesstionDto, file: Express.Multer.File) {
    const { title, order, isFree, duration, chapterId } = sesstionDto;

    const chapter = await this.chapterRepository.findOne({
      where: { id: Number(chapterId) },
    });

    if (!chapter) throw new NotFoundException(ChapterMessage.NotFound);

    if (!file) throw new BadRequestException("فایل ویدیو الزامی است");

    const videoUrl = file.path; 

    const sesstion = this.sesstionRepository.create({
      title,
      order,
      isFree,
      videoUrl,
      duration,
      chapter,
    });

    await this.sesstionRepository.save(sesstion);

    return {
      message: SesstionMessage.uploaded,
      sesstion,
    };
  }

  async findAll(chapterId: number) {
    const chapterExists = await this.chapterRepository.findOneBy({
      id: chapterId,
    });

    if (!chapterExists) {
      throw new NotFoundException(`فصلی با شناسه ${chapterId} یافت نشد.`);
    }

    return await this.sesstionRepository.find({
      where: {
        chapter: {
          id: chapterId,
        },
      },
      order: {
        order: "ASC",
      },
    });
  }

  async findOne(id: number) {
    const sesstion = await this.sesstionRepository.findOneBy({ id });
    if (!sesstion) throw new NotFoundException(SesstionMessage.NotFound);
    return sesstion;
  }

  async remove(id: number) {
    const sesstion = await this.findOne(id);
    await this.sesstionRepository.remove(sesstion);
    return {
      message: SesstionMessage.Deleted,
    };
  }
}
