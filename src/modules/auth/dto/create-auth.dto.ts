import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEmail,
  IsMobilePhone,
  Matches,
  IsEnum,
  ValidateIf,
} from "class-validator";
import { AuthMethod } from "common/enums/auth-method.enum";
import { AuthMessages } from "common/enums/message.enum";


export class CheckOtpDto {
  @ApiProperty({
    required: false,
    example: "user@example.com",
    description: "ایمیل کاربر برای بررسی OTP (یکی از email یا mobile الزامی است)",
  })

  @ValidateIf((o) => !o.mobile)
  @IsEmail({}, { message: AuthMessages.INVALID_EMAIL })
  email?: string;

  @ApiProperty({
    required: false,
    example: "09123456789",
    description: "شماره موبایل کاربر برای بررسی OTP (یکی از email یا mobile الزامی است)",
  })
  @ValidateIf((o) => !o.email)
  @IsMobilePhone("fa-IR", {}, { message: AuthMessages.INVALID_MOBILE })
  mobile?: string;

  @ApiProperty({
    example: "12345",
    description: "کد OTP پنج یا شش رقمی",
  })
  @IsString()
  @Matches(/^\d{5,6}$/, { message: AuthMessages.INVALID_OTP })
  code: string;
}

export class SendOtpDto {
  @ApiProperty({ enum: AuthMethod, example: AuthMethod.MOBILE })
  @IsEnum(AuthMethod)
  method: AuthMethod;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.method === AuthMethod.EMAIL) 
  @IsEmail({}, { message: AuthMessages.INVALID_EMAIL })
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.method === AuthMethod.MOBILE) 
  @IsMobilePhone("fa-IR", {}, { message: AuthMessages.INVALID_MOBILE })
  @IsOptional()
  mobile?: string;
}