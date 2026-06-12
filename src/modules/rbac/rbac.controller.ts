import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { RbacService } from "./rbac.service";
import { CreateRbacDto, CreateRoleDto } from "./dto/create-rbac.dto";
import { Permissions } from "common/decorator/permission.decorator";
import { RbacGuard } from "./guard/rbac.guard";
import { ApiTags } from "@nestjs/swagger";

@Controller("rbac")
@ApiTags("RBAC")
@UseGuards(RbacGuard)
export class RbacController {
  constructor(private rbacService: RbacService) {}

  @Post("roles")
  @Permissions("role:create")
  async createRole(@Body() dto: CreateRoleDto) {
    return this.rbacService.create(dto);
  }

  @Get("permissions")
  @Permissions("all")
  async getAllPermissions() {
    return this.rbacService.findAllPermissions();
  }

  @Get("roles")
  getAllRoles() {
    return this.rbacService.getAllRoles();
  }

  @Get("roles/:id")
  @Permissions("all")
  async getRoleById(@Param("id") id: number) {
    return this.rbacService.getRoleById(id);
  }

  @Post("roles/:roleId/permissions/:permissionId")
  @Permissions("all")
  async assignPermissionToRole(
    @Param("roleId") roleId: number,
    @Param("permissionId") permissionId: number,
  ) {
    return this.rbacService.assignPermissionToRole(roleId, permissionId);
  }

  @Post("permissions")
  @Permissions("all")
  async createPermission(@Body() dto: CreateRbacDto) {
    return this.rbacService.createPermission(dto);
  }

  @Delete("role/:id")
  deleteRole(@Param("id") id: number) {
    return this.rbacService.deleteRole(id);
  }
}
