import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([DiscountEntity, CourseEntity])],
  controllers: [DiscountController],
  providers: [DiscountService, JwtService],
  exports: [DiscountService]
})
export class DiscountModule {}
