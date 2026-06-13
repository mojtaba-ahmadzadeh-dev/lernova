import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "./entities/comment.entity";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const user = this.request.user;
    if (!user) throw new UnauthorizedException("کاربر احراز هویت نشده است.");

    const { text, targetId, targetType, parentId } = createCommentDto;

    const newComment = this.commentRepository.create({
      text,
      targetId,
      targetType,
      parentId: parentId ?? null,
      author: user,
      accepted: false,
    });

    const saved = await this.commentRepository.save(newComment);

    const comment = await this.commentRepository.findOne({
      where: { id: saved.id },
      relations: { author: true },
    });

    return {
      message:
        "کامنت شما با موفقیت ثبت شد و پس از بررسی توسط ادمین نمایش داده خواهد شد.",
      comment,
    };
  }

  async findAll() {
    const comments = await this.commentRepository.find({
      where: { accepted: true },
      relations: ["author", "blog", "course"],
      order: { id: "DESC" },
    });

    return comments.map((comment) => {
      const response: any = {
        id: comment.id,
        text: comment.text,
        targetId: comment.targetId,
        targetType: comment.targetType,
        parentId: comment.parentId,
        accepted: comment.accepted, 
        author: {
          id: comment.author?.id,
          mobile: comment.author?.mobile,
          fullName: comment.author?.fullName,
        },
      };

      if ("createdAt" in comment) response["createdAt"] = comment["createdAt"];
      if ("updatedAt" in comment) response["updatedAt"] = comment["updatedAt"];

      if (comment.course) response.course = comment.course;
      if (comment.blog) response.blog = comment.blog;

      return response;
    });
  }

  async acceptComment(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException("کامنت مورد نظر یافت نشد.");
    }

    await this.commentRepository.update(id, { accepted: true });

    const updatedComment = await this.commentRepository.findOne({
      where: { id },
      relations: ["author", "blog", "course"],
    });

    return {
      message: "کامنت با موفقیت تایید و منتشر شد.",
      data: updatedComment,
    };
  }

  async rejectComment(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException("کامنت مورد نظر یافت نشد.");
    }

    await this.commentRepository.delete(id);

    return {
      message: "کامنت با موفقیت رد و حذف شد.",
    };
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id, accepted: true },
      relations: ["author", "blog", "course"],
    });

    if (!comment) {
      throw new NotFoundException("کامنت مورد نظر یافت نشد.");
    }

    return {
      id: comment.id,
      text: comment.text,
      targetId: comment.targetId,
      targetType: comment.targetType,
      parentId: comment.parentId,
      accepted: comment.accepted,
      author: {
        id: comment.author?.id,
        mobile: comment.author?.mobile,
        fullName: comment.author?.fullName,
      },
      createdAt: comment["createdAt"],
      updatedAt: comment["updatedAt"],
      course: comment.course,
      blog: comment.blog,
    };
  }
}
