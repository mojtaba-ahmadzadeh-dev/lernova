import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFiles,
  Query,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiConsumes } from "@nestjs/swagger";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AdminCreateUserDto, ChangeRoleDto } from "./dto/create-user.dto";
import { CanAccess } from "common/decorator/skip-auth-decorator";
import { Role } from "common/enums/role.enum";
import { Pagination } from "common/decorator/pagination.decorator";
import { PaginationDto } from "common/dto/pagination.dto";
import { SwaggerConsumes } from "common/enums/swagger-consumes.enum";
import { multerDestination, multerFileName } from "common/utils/multer.util";
import { RbacDecorator } from "common/decorator/auth.decorator";
import { Permissions } from "common/decorator/permission.decorator";

@Controller("user")
@RbacDecorator()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/all")
  @Permissions('user:read')
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
  @CanAccess(Role.Admin)
  changeUserRole(@Body() changeRoleDto: ChangeRoleDto) {
    const { userId, role } = changeRoleDto;
    return this.userService.changeUserRole(userId, role);
  }

  @Post("/admin/create-user")
  @CanAccess(Role.Admin)
  adminCreateUser(@Body() adminCreateUserDto: AdminCreateUserDto) {
    return this.userService.adminCreateUser(adminCreateUserDto);
  }

  @Get("/ban/:userId")
  @CanAccess(Role.Admin)
  toggleBanUser(@Param("userId") userId: number) {
    return this.userService.toggleBanUser(+userId);
  }

  @Delete("/delete/:id")
  @CanAccess(Role.Admin)
  deleteUser(@Param("id") userId: number) {
    return this.userService.deleteUser(userId);
  }
}
