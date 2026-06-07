import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiCookieAuth } from "@nestjs/swagger";
import { AuthGuard } from "modules/auth/guard/auth.guard";

export const AuthDecorator = () => {
  return applyDecorators(
    ApiCookieAuth("accessToken"),
    UseGuards(AuthGuard),
  );
};