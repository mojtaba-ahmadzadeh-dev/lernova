import { Module } from "@nestjs/common";
import { AuthService } from "./service/auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { otpEntity } from "../user/entities/otp.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TokenService } from "./service/token.service";
import { RoleEntity } from "modules/rbac/entities/role.entity";
import { PermissionEntity } from "modules/rbac/entities/permission.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      otpEntity,
      RoleEntity,
      PermissionEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
