import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { UserEntity } from 'modules/user/entities/user.entity';
import { RbacRepository } from './repository/rbac.repository';
import { RbacGuard } from './guard/rbac.guard';
import { UserRepository } from 'modules/user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity, UserEntity]),
    
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [RbacController],
  providers: [
    RbacService,
    RbacRepository,
    RbacGuard,
    UserRepository,
  ],
  exports: [
    RbacService,
    RbacGuard,
    RbacRepository,
    JwtModule
  ],
})
export class RbacModule {}