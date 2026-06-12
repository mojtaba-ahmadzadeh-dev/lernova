import { Reflector } from "@nestjs/core";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "modules/user/entities/user.entity";
import { UserRepository } from "modules/user/user.repository";
import { Request } from "express";

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      "permissions",
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest<Request>();

    const accessToken = request.cookies?.accessToken;

    if (!accessToken) {
      throw new UnauthorizedException("Login required");
    }

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    const user = await this.findUserWithPermissions(payload.id);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (user.isBanned) {
      throw new ForbiddenException("Your account has been banned");
    }

    request.user = user;

    if (requiredPermissions?.length > 0) {
      const userPermissions = user.role?.permissions?.map((p) => p.name) || [];

      const hasAccess = requiredPermissions.every((perm) =>
        userPermissions.includes(perm),
      );

      if (!hasAccess) {
        throw new ForbiddenException(
          `you can not access: ${requiredPermissions.join(", ")}`,
        );
      }
    }

    return true;
  }

  private async findUserWithPermissions(
    userId: number,
  ): Promise<UserEntity | null> {
    return this.userRepository.findUserWithPermissions(userId);
  }
}
