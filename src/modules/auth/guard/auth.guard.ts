import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { isJWT } from "class-validator";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../service/auth.service";
import { ROLES_KEY, SKIP_AUTH_KEY } from "common/decorator/skip-auth-decorator";
import { Role } from "common/enums/role.enum";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isSkipAuth = this.reflector.getAllAndOverride<boolean>(
      SKIP_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isSkipAuth) {
      return true;
    }
    

    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();

    const token = this.extractToken(request);
    const user = await this.authService.validateAccessToken(token);
    
    request.user = user;

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles || requiredRoles.length === 0) return true;
    
    const userRole = user?.role ?? Role.User;

    if (requiredRoles.includes(userRole)) return true;

    throw new ForbiddenException("ACCESS_DENIED");
  }

  protected extractToken(request: Request) {
    const { accessToken } = request.cookies;
    
    if (!accessToken || !isJWT(accessToken)) {
      throw new UnauthorizedException("login requred");
    }

    return accessToken;
  }
}
