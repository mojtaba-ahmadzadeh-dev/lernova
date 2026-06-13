import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { CourseEntity } from '../course/entities/course.entity';
import { BlogEntity } from '../blog/entities/blog.entity';
import { RbacModule } from 'modules/rbac/rbac.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [AuthModule, RbacModule, UserModule, TypeOrmModule.forFeature([CommentEntity, CourseEntity, BlogEntity])],
  controllers: [CommentController],
  providers: [CommentService, JwtService],
})
export class CommentModule {}
