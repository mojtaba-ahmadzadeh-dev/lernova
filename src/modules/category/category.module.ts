import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'modules/user/user.module';
import { RbacGuard } from 'modules/rbac/guard/rbac.guard';

@Module({
  imports: [AuthModule,UserModule, TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService],
  exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule {}
