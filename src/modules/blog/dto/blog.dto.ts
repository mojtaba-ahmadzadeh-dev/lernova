import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { BlogStatus } from "common/decorator/status.enum";


export class BlogDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 200)
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 500)
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  content: string;
  @ApiPropertyOptional()
  slug: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  time_for_stady: string;
  @ApiPropertyOptional({ type: "string", format: "binary" })
  image: string;
  @ApiProperty({ type: String, isArray: true })
  categories: string[] | string;
}

export class UpdateBlogDto {
  @ApiPropertyOptional()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  time_for_stady?: string;

  @ApiPropertyOptional({ type: "string", format: "binary" })
  @IsOptional()
  image?: any;

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsOptional()
  categories?: string[] | string;
}

export class StatusBlogDto {
  @ApiProperty({ enum: BlogStatus })
  @IsEnum(BlogStatus)
  status: BlogStatus;
}

export class FilterBlogDto {
  category: string;
  search: string;
}
