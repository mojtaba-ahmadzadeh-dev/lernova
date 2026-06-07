import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { AdminCreateUserDto, CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import * as bcrypt from "bcrypt";
import type { Request } from "express";
import { PaginationDto } from "common/dto/pagination.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "common/utils/pagination.utils";
import { deleteInvalidPropertyObject } from "common/utils/function.utils";
import { UserMessages } from "common/enums/message.enum";
import { Role } from "common/enums/role.enum";
import { UserEntity } from "./entities/user.entity";


@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @Inject(REQUEST) private request: Request,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { skip, limit, page } = paginationSolver(paginationDto);

    const totalCount = await this.userRepository.count();

    const users = await this.userRepository.find({
      skip,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return {
      pagination: paginationGenerator(totalCount, page, limit),
      data: users,
    };
  }

  async userMe() {
    const user = this.request.user;

    return await this.userRepository.findOne({
      where: { id: user.id },
    });
  }

  async updateUser(files: any, updateUserDto: UpdateUserDto) {
    const userId = this.request.user["id"];

    if (files?.avatar?.length > 0) {
      const [image] = files.avatar;
      updateUserDto.avatar = image?.path?.slice(7);
    }

    deleteInvalidPropertyObject(updateUserDto);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("کاربر یافت نشد");
    }

    const { fullName, email, avatar, password } = updateUserDto;

    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;

    if (password !== undefined && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await this.userRepository.save(user);

    return {
      message: "اطلاعات کاربر با موفقیت ویرایش شد",
    };
  }

  async changeUserRole(userId: number, role: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(UserMessages.USER_NOT_FOUND);
    }
    if (!Object.values(Role).includes(role as Role)) {
      throw new ConflictException(UserMessages.INVALID_ROLE);
    }
    user.role = role as Role;
    await this.userRepository.save(user);
    return { message: UserMessages.ROLE_UPDATED };
  }

  async adminCreateUser(adminCreateUserDto: AdminCreateUserDto) {
    const { email, mobile, password, fullName, role } = adminCreateUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { mobile }],
    });

    if (existingUser) {
      throw new ConflictException(UserMessages.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      mobile,
      fullName,
      password: hashedPassword,
      role: role || Role.User,
      isVerified: true,
    });

    await this.userRepository.save(newUser);

    return {
      message: "کاربر با موفقیت توسط ادمین ایجاد شد",
    };
  }

  async toggleBanUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(UserMessages.USER_NOT_FOUND);
    }
    user.isBanned = !user.isBanned;

    await this.userRepository.save(user);

    return {
      message: user.isBanned
        ? UserMessages.USER_BANNED
        : UserMessages.USER_UNBANNED,
      isBanned: user.isBanned,
    };
  }
}
