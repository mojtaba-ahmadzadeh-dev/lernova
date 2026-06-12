import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { UserEntity } from 'modules/user/entities/user.entity';
import { RbacRepository } from './repository/rbac.repository';
import { RbacGuard } from './guard/rbac.guard';
import { UserRepository } from 'modules/user/user.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity, UserEntity]),
  ],
  controllers: [RbacController],
  providers: [
    RbacService,
    RbacRepository,
    RbacGuard,
    UserRepository,
    JwtService,
  ],
  exports: [
    RbacService,
    RbacGuard,
    RbacRepository,
    JwtService
  ],
})
export class RbacModule {}
