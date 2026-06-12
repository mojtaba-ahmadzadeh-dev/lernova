import { Module } from '@nestjs/common';
import { SesstionService } from './sesstion.service';
import { SesstionController } from './sesstion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesstionEntity } from './entities/sesstion.entity';
import { ChapterEntity } from '../chapter/entities/chapter.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([SesstionEntity, ChapterEntity])],
  controllers: [SesstionController],
  providers: [SesstionService],
})
export class SesstionModule {}
