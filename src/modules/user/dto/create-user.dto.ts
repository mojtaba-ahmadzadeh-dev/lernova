import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  IsMobilePhone,
  MinLength,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
import { Role } from "src/common/enums/role.enum";

export class CreateUserDto {
  @ApiPropertyOptional({ example: "علی", description: "نام" })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: "ali@gmail.com", description: "ایمیل" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: "Secret123!",
    minLength: 6,
    description: "رمز عبور جدید",
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: "رمز عبور باید حداقل ۶ کارکتر باشد" })
  password?: string;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "آواتار (فایل)",
  })
  @IsOptional()
  avatar?: any;
}

export class ChangeRoleDto {
  @ApiProperty({ example: 1, description: "شناسه کاربر" })
  userId: number;

  @ApiProperty({ example: "ADMIN", description: "نقش جدید" })
  role: string;
}

export class AdminCreateUserDto {
  @ApiPropertyOptional({ example: "علی رضایی", description: "نام کامل" })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: "ali@gmail.com", description: "ایمیل" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "09123456789", description: "شماره موبایل" })
  @IsOptional()
  @IsMobilePhone("fa-IR")
  mobile?: string;

  @ApiProperty({
    example: "Secret123!",
    minLength: 6,
    description: "رمز عبور",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: "رمز عبور باید حداقل ۶ کارکتر باشد" })
  password: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.User,
    description: "نقش کاربر",
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
