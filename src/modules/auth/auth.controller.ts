import { Controller, Post, Body, Res } from "@nestjs/common";
import { AuthService } from "./service/auth.service";
import { CheckOtpDto, SendOtpDto } from "./dto/create-auth.dto";
import type { Response } from "express";
import { ApiConsumes } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("send-otp")
    @ApiConsumes(SwaggerConsumes.UrlEncoded)
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post("check-otp")
    @ApiConsumes(SwaggerConsumes.UrlEncoded)
  async checkOtp(
    @Body() dto: CheckOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.checkOtp(dto);

    res.cookie("accessToken", result.tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 3600 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 3600 * 1000,
      path: "/",
    });

    return {
      message: result.message,
      user: result.user,
    };
  }
}
