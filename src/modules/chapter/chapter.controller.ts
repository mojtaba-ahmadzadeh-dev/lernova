import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { ApiConsumes } from "@nestjs/swagger";
import { ChapterDto, UpdateChapterDto } from "./dto/chapter.dto";
import { SkipAuth } from "common/decorator/skip-auth-decorator";
import { Permissions } from "common/decorator/permission.decorator";
import { SwaggerConsumes } from "common/enums/swagger-consumes.enum";

@Controller("chapter")
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  @Permissions("create:course")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() chapterDto: ChapterDto) {
    return this.chapterService.create(chapterDto);
  }

  @Get()
  @SkipAuth()
  findAll(@Param("courseId") courseId: number) {
    return this.chapterService.findAll(courseId);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.chapterService.findOne(id);
  }

  @Patch(":id")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param("id") id: number, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chapterService.update(id, updateChapterDto);
  }

  @Delete(":id")
  @Permissions("remove:course")
  remove(@Param("id") id: number) {
    return this.chapterService.remove(id);
  }
}
