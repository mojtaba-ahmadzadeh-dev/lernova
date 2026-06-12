import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "modules/user/entities/user.entity";
import { Repository } from "typeorm";
import { CreateRbacDto } from "./dto/create-rbac.dto";
import { PermissionEntity } from "./entities/permission.entity";
import { RoleEntity } from "./entities/role.entity";
import { RbacMessages } from "common/enums/message.enum";

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,

    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,

    @InjectRepository(PermissionEntity)
    private permissionRepo: Repository<PermissionEntity>,
  ) {}

  async canAccess(
    userId: number,
    requiredPermissions: string[],
  ): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["role", "role.permissions"],
      select: ["id", "isBanned"],
    });

    if (!user || user.isBanned) {
      return false;
    }

    const userPermissions =
      user.role?.permissions?.map((permission) => permission.name) || [];

    if (userPermissions.includes("all")) {
      return true;
    }

    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }

  async create(dto: CreateRbacDto) {
    const existing = await this.permissionRepository.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(RbacMessages.PERMISSION_ALREADY_EXISTS);
    }

    const permission = this.permissionRepository.create({
      name: dto.name,
      description: dto.description,
    });

    return this.permissionRepository.save(permission);
  }

  async findAllPermissions() {
    return await this.permissionRepo.find({
      relations: ["roles"], 
    });
  }

  async assignPermissionToRole(roleId: number, permissionId: number) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ["permissions"],
    });

    if (!role) {
      throw new NotFoundException(RbacMessages.NOTFOUND_ROLE);
    }

    const permission = await this.permissionRepo.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException(RbacMessages.NOTFOUND_PERMISSION);
    }

    const alreadyHasPermission = role.permissions.some(
      (p) => p.id === permission.id,
    );

    if (alreadyHasPermission) {
      throw new ConflictException(RbacMessages.ALREADY_PERMISSION);
    }

    role.permissions.push(permission);

    const savedRole = await this.roleRepository.save(role);

    return {
      message: RbacMessages.PERMISSION_ASSIGNED_SUCCESSFULLY,
      data: {
        roleId: savedRole.id,
        roleName: savedRole.name,
        permissionId: permission.id,
        permissionName: permission.name,
      },
    };
  }

  async removePermissionFromRole(roleId: number, permissionId: number) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ["permissions"],
    });

    if (!role) {
      throw new NotFoundException(`Role با آیدی ${roleId} پیدا نشد`);
    }

    role.permissions = role.permissions.filter(
      (permission) => permission.id !== permissionId,
    );

    return await this.roleRepository.save(role);
  }

  async getRoleById(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ["permissions"],
    });

    if (!role) {
      throw new NotFoundException(`Role با آیدی ${id} پیدا نشد`);
    }
    return role;
  }

  async getAllRoles() {
    return this.roleRepository.find();
  }

  async createPermission(dto: CreateRbacDto) {
    const existing = await this.permissionRepo.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(RbacMessages.PERMISSION_ALREADY_EXISTS);
    }

    const permission = this.permissionRepo.create({
      name: dto.name,
      description: dto.description || null,
    });

    return await this.permissionRepo.save(permission);
  }

  async deleteRole(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ["permissions"],
    });

    if (!role) {
      throw new NotFoundException(RbacMessages.NOTFOUND_ROLE);
    }

    role.permissions = [];
    await this.roleRepository.save(role);

    const result = await this.roleRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(RbacMessages.NOTFOUND_ROLE);
    }

    return {
      message: RbacMessages.ROLE_DELETED_SUCCESSFULLY,
    };
  }
}
