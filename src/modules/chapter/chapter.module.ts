import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from '../course/entities/course.entity';
import { ChapterEntity } from './entities/chapter.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([CourseEntity, ChapterEntity])],
  controllers: [ChapterController],
  providers: [ChapterService, JwtService],
})
export class ChapterModule {}
