import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';   // مسیر رو چک کن
import { RoleEntity } from 'modules/rbac/entities/role.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    RbacModule,               // باید import بشه
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}