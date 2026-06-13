import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator"; // 👈 این را اضافه کنید

export class BasketDto {
  @ApiProperty()
  @IsNotEmpty() // 👈 این دکوراتور باعث می‌شود فیلد شناخته شود
  @IsString()
  courseId: string;
}

export class DiscountBasketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @ApiProperty({ required: false })
  @IsString()
  code?: string; // 👈 اگر کد تخفیف اختیاری باشه
}
