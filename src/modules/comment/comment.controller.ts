import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Permissions } from "common/decorator/permission.decorator";
import { SkipAuth } from "common/decorator/skip-auth-decorator";
import { RbacDecorator } from "common/decorator/auth.decorator";

@Controller("comment")
@RbacDecorator()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Permissions("create:comment")
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @SkipAuth()
  findAll() {
    return this.commentService.findAll();
  }

  @Patch("accept/:id")
  @Permissions("accept:comment")
  acceptComment(@Param("id") id: number) {
    return this.commentService.acceptComment(id);
  }

  @Patch("reject/:id")
  @Permissions("reject:comment")
  rejectComment(@Param("id") id: number) {
    return this.commentService.rejectComment(id);
  }

  @Get(":id")
  @SkipAuth()
  findOne(@Param("id") id: number) {
    return this.commentService.findOne(id);
  }
}
