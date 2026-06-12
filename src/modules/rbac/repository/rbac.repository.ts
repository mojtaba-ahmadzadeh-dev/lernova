import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "modules/user/entities/user.entity";
import { Repository } from "typeorm";
import { PermissionEntity } from "../entities/permission.entity";
import { RoleEntity } from "../entities/role.entity";

@Injectable()
export class RbacRepository {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permRepo: Repository<PermissionEntity>,
  ) {}

  async findUserWithPermissions(userId: number) {
    return this.userRepo.findOne({
      where: { id: userId },
      relations: ["roles", "roles.permissions"],
    });
  }

  async getAllPermissions() {
    return this.permRepo.find();
  }
}
