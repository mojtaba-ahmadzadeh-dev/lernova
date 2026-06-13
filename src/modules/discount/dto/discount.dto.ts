import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  Min,
  Max,
} from "class-validator";

export class DiscountDto {
  @ApiProperty({ example: "OFF500" })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percent?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({
    example: 0,
    description: "Timestamp به میلی‌ثانیه. مقدار 0 یعنی بدون تاریخ انقضا.",
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  expires_in?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  limit?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number) // مهم: تبدیل ورودی به number
  @IsNumber()
  @Min(1)
  courseId?: number;
}
