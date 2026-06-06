import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { StringValue } from "ms";


@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async generateTokens(payload: any) {
    
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("ACCESS_TOKEN_EXPIRES") as StringValue
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("REFRESH_TOKEN_EXPIRES") as StringValue
    });

    return { accessToken, refreshToken };
  }

    verifyAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
      });
    } catch (e) {
      throw new UnauthorizedException("Access token is invalid or expired");
    }
  }

   verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
      });
    } catch (e) {
      throw new UnauthorizedException("Refresh token is invalid or expired");
    }
  }
}