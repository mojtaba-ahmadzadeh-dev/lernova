import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// این اینام را برای مدیریت بهتر نوع موجودیت‌ها تعریف می‌کنیم
export enum CommentTargetType {
  BLOG = "blog",
  COURSE = "course",
}

export class CreateCommentDto {
  @ApiProperty({ description: "متن کامنت", example: "این یک دوره عالی بود" })
  @IsString({ message: "متن کامنت باید رشته باشد" })
  @IsNotEmpty({ message: "متن کامنت نباید خالی باشد" })
  @Length(3, 500, { message: "متن کامنت باید بین ۳ تا ۵۰۰ کاراکتر باشد" })
  text: string;

  @ApiProperty({ description: "آیدی بلاگ یا دوره مربوطه", example: 1 })
  @IsInt({ message: "آیدی هدف باید عدد صحیح باشد" })
  @IsNotEmpty({ message: "آیدی هدف الزامی است" })
  targetId: number;

  @ApiProperty({
    description: "نوع موجودیت (blog یا course)",
    enum: CommentTargetType,
    example: CommentTargetType.BLOG,
  })
  @IsEnum(CommentTargetType, {
    message: "نوع موجودیت انتخاب شده معتبر نیست (blog یا course)",
  })
  @IsNotEmpty({ message: "نوع موجودیت الزامی است" })
  targetType: string;

  @IsInt()
  @ApiProperty()
  @IsOptional() // چون ممکن است کامنت اصلی باشد و parent نداشته باشد
  parentId?: number;
}
