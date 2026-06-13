import { PartialType } from '@nestjs/swagger';
import { SendOtpDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(SendOtpDto) {}
