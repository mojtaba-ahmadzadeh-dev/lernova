import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthDecorator } from "src/common/decorator/auth.decorator";
import { CanAccess } from "src/common/decorator/skip-auth-decorator";
import { Role } from "src/common/enums/role.enum";
import { ApiConsumes } from "@nestjs/swagger";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import {
  multerDestination,
  multerFileName,
} from "src/common/utils/multer.util";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Pagination } from "src/common/decorator/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { AdminCreateUserDto, ChangeRoleDto } from "./dto/create-user.dto";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@Controller("user")
@AuthDecorator()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/all")
  @CanAccess(Role.Admin)
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get("/me")
  @CanAccess(Role.User, Role.Admin)
  userMe() {
    return this.userService.userMe();
  }

  @Patch("/profile")
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "avatar", maxCount: 1 },
        { name: "bg_image", maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: multerDestination("user-profile"),
          filename: multerFileName,
        }),
      },
    ),
  )
  update(@UploadedFiles() files: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(files, updateUserDto);
  }

  @Patch("/change-role")
  @AuthDecorator()
  @CanAccess(Role.Admin)
  changeUserRole(@Body() changeRoleDto: ChangeRoleDto) {
    const { userId, role } = changeRoleDto;
    return this.userService.changeUserRole(userId, role);
  }

  @Post("/admin/create-user")
  @CanAccess(Role.Admin)
  async adminCreateUser(@Body() adminCreateUserDto: AdminCreateUserDto) {
    return await this.userService.adminCreateUser(adminCreateUserDto);
  }

  @Get("/ban/:userId")
  @CanAccess(Role.Admin)
  toggleBanUser(@Param("userId") userId: string) {
    return this.userService.toggleBanUser(+userId);
  }
}
