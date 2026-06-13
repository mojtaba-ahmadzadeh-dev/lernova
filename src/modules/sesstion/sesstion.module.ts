import { Module } from '@nestjs/common';
import { SesstionService } from './sesstion.service';
import { SesstionController } from './sesstion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesstionEntity } from './entities/sesstion.entity';
import { ChapterEntity } from '../chapter/entities/chapter.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([SesstionEntity, ChapterEntity])],
  controllers: [SesstionController],
  providers: [SesstionService, JwtService],
})
export class SesstionModule {}
