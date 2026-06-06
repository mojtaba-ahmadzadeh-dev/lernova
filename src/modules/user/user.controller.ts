import {
  Controller,
} from "@nestjs/common";
import { UserService } from "./user.service";
// import { AuthDecorator } from "src/common/decorator/auth.decorator";

@Controller("user")
// @AuthDecorator()
export class UserController {
  constructor(private readonly userService: UserService) {}
}
