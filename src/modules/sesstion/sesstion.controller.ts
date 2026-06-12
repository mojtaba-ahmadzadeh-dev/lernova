import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from "@nestjs/common";
import { SesstionService } from "./sesstion.service";
import { SesstionDto } from "./dto/sesstion.dto";
import { ApiConsumes } from "@nestjs/swagger";
import { SwaggerConsumes } from "common/enums/swagger-consumes.enum";
import { Permissions } from "common/decorator/permission.decorator";
import { UploadFile } from "common/utils/multer.util";
import { SkipAuth } from "common/decorator/skip-auth-decorator";

@Controller("sesstion")
export class SesstionController {
  constructor(private readonly sesstionService: SesstionService) {}

  @Post()
  @Permissions("create:session")
  @UseInterceptors(UploadFile("video", "videos"))
  @ApiConsumes(SwaggerConsumes.MultipartData)
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() sesstionDto: SesstionDto,
  ) {
    return this.sesstionService.create(sesstionDto, file);
  }

  @Get("/:chapterId")
  @SkipAuth()
  findAll(@Param("chapterId", ParseIntPipe) chapterId: number) {
    return this.sesstionService.findAll(chapterId);
  }

  @Delete(":id")
  @Permissions("remove:session")
  remove(@Param("id") id: number) {
    return this.sesstionService.remove(id);
  }
}
