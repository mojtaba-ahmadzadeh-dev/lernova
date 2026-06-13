import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

// dto/create-order.dto.ts
export class CreateOrderDto {
  @ApiProperty()
    @IsOptional()
  @IsString()
  description?: string;
}