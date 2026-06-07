import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TransformToBoolean } from "common/decorator/to-boolean.decorator";

export class CourseDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(5, 255)
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @Length(5, 450)
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  content: string;
  @ApiPropertyOptional({ type: "integer" })
  @IsOptional()
  price: number;
  @ApiProperty({ type: "string", format: "binary" })
  cover: string;
  @ApiProperty({ type: "boolean", required: false })
  @TransformToBoolean()
  @IsOptional()
  isCompleted: boolean;
  @ApiProperty({ type: "boolean", required: false })
  @TransformToBoolean()
  @IsOptional()
  isPublished: boolean;
  @ApiProperty({ type: "boolean", required: false })
  @TransformToBoolean()
  @IsOptional()
  hasCertificate: boolean;
  @ApiProperty({ type: "string", isArray: true })
  categories: string[] | string;
}

export class CourseCommentDto {
  @ApiProperty()
  @Length(5)
  text: string;
  @ApiProperty()
  @IsString()
  courseId: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentId: string;
}

export class FilterCourseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true) 
  @IsBoolean()
  isFree?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPublished?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  page?: number;
  @ApiPropertyOptional()
  @IsOptional()
  limit?: number;
}
