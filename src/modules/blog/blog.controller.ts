import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseIntPipe,
} from "@nestjs/common";
import { BlogService } from "./blog.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { BlogDto, UpdateBlogDto } from "./dto/blog.dto";
import { ApiConsumes } from "@nestjs/swagger";
import { SwaggerConsumes } from "common/enums/swagger-consumes.enum";
import { Permissions } from "common/decorator/permission.decorator";
import { SkipAuth } from "common/decorator/skip-auth-decorator";

@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @Permissions("create:blog")
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @Body() blogDto: BlogDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return await this.blogService.create(blogDto, image);
  }

  @Get()
  @SkipAuth()
  async findAll() {
    return await this.blogService.findAll();
  }

  @Get("/:slug")
  @SkipAuth()
  async findOneBySlug(@Param("slug") slug: string) {
    return await this.blogService.findOneBySlug(slug);
  }

  @Get("/by-id/:id")
  @SkipAuth()
  async findOneById(@Param("id", ParseIntPipe) id: number) {
    return await this.blogService.findOneById(id);
  }

  @Get("/bookmark/:id")
  async toggleBookmark(@Param("id", ParseIntPipe) id: number) {
    return await this.blogService.toggleBookmark(id);
  }

  @Get("/like/:id")
  async toggleLike(@Param("id", ParseIntPipe) id: number) {
    return await this.blogService.toggleLike(id);
  }

  @Patch("/:id")
  @Permissions("update:blog_by_id")
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(FileInterceptor("image"))
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.blogService.update(id, updateBlogDto, image);
  }
}
