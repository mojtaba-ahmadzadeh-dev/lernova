import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CheckOtpDto, SendOtpDto } from "../dto/create-auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { Repository } from "typeorm";
import { otpEntity } from "../../user/entities/otp.entity";
import { TokenService } from "./token.service";
import { AuthMessages } from "common/enums/message.enum";
import { Role } from "common/enums/role.enum";
import { RoleEntity } from "modules/rbac/entities/role.entity";
import { PermissionEntity } from "modules/rbac/entities/permission.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,

    @InjectRepository(otpEntity)
    private otpRepo: Repository<otpEntity>,

    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepo: Repository<PermissionEntity>,

    private readonly tokenService: TokenService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { method: authMethod, mobile, email } = dto;

    let userWhere: { mobile: string } | { email: string };

    if (authMethod === "mobile") {
      if (!mobile) {
        throw new BadRequestException(
          AuthMessages.BOTH_EMAIL_OR_MOBILE_REQUIRED,
        );
      }

      userWhere = { mobile };
    } else if (authMethod === "email") {
      if (!email) {
        throw new BadRequestException(
          AuthMessages.BOTH_EMAIL_OR_MOBILE_REQUIRED,
        );
      }

      userWhere = { email };
    } else {
      throw new BadRequestException("روش ورود نامعتبر است");
    }

    let user = await this.userRepo.findOne({
      where: userWhere,
      relations: ["role"],
    });

    if (!user) {
      const usersCount = await this.userRepo.count();

      // ==========================
      // Create Admin Role
      // ==========================

      let adminRole = await this.roleRepo.findOne({
        where: { name: "admin" },
        relations: ["permissions"],
      });

      if (!adminRole) {
        adminRole = await this.roleRepo.save(
          this.roleRepo.create({
            name: "admin",
          }),
        );
      }

      // ==========================
      // Create User Role
      // ==========================

      let userRole = await this.roleRepo.findOne({
        where: { name: "user" },
      });

      if (!userRole) {
        userRole = await this.roleRepo.save(
          this.roleRepo.create({
            name: "user",
          }),
        );
      }

      // ==========================
      // Create ALL Permission
      // ==========================

      let allPermission = await this.permissionRepo.findOne({
        where: {
          name: "all",
        },
      });

      if (!allPermission) {
        allPermission = await this.permissionRepo.save(
          this.permissionRepo.create({
            name: "all",
            description: "Full system access",
          }),
        );
      }

      // ==========================
      // First User => Admin
      // ==========================

      if (usersCount === 0) {
        adminRole = await this.roleRepo.findOne({
          where: { id: adminRole.id },
          relations: ["permissions"],
        });

        const hasAllPermission = adminRole.permissions.some(
          (permission) => permission.name === "all",
        );

        if (!hasAllPermission) {
          adminRole.permissions.push(allPermission);

          await this.roleRepo.save(adminRole);
        }
      }

      const selectedRole = usersCount === 0 ? adminRole : userRole;

      user = this.userRepo.create({
        mobile: authMethod === "mobile" ? mobile : undefined,
        email: authMethod === "email" ? email : undefined,
        role: selectedRole,
        isVerified: false,
      });

      user = await this.userRepo.save(user);

      console.log(`User ${user.id} created with role ${selectedRole.name}`);
    }

    const existingOtp = await this.otpRepo.findOne({
      where: {
        userId: user.id,
      },
    });

    const now = new Date();

    if (existingOtp && existingOtp.expires_in > now) {
      throw new BadRequestException(AuthMessages.OTP_COOLDOWN);
    }

    if (existingOtp) {
      await this.otpRepo.delete({
        id: existingOtp.id,
      });
    }

    const code = Math.floor(10000 + Math.random() * 90000).toString();

    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + 2);

    const otpMethod = authMethod === "mobile" ? "sms" : "email";

    const otp = this.otpRepo.create({
      code,
      expires_in: expiresIn,
      method: otpMethod,
      userId: user.id,
    });

    await this.otpRepo.save(otp);

    return {
      message: AuthMessages.OTP_SENT_SUCCESSFULLY,
    };
  }

  async checkOtp(dto: CheckOtpDto) {
    const { mobile, email, code } = dto;

    let user: UserEntity | null = null;
    if (mobile) {
      user = await this.userRepo.findOne({ where: { mobile } });
    } else if (email) {
      user = await this.userRepo.findOne({ where: { email } });
    }

    if (!user) {
      throw new BadRequestException(AuthMessages.USER_NOT_FOUND);
    }

    const otp = await this.otpRepo.findOne({
      where: { userId: user.id },
    });

    if (!otp) {
      throw new BadRequestException(AuthMessages.OTP_NOT_FOUND);
    }

    const now = new Date();
    if (otp.expires_in < now) {
      throw new BadRequestException(AuthMessages.OTP_EXPIRED);
    }

    if (otp.code !== code) {
      throw new BadRequestException(AuthMessages.OTP_INVALID);
    }

    user.isVerified = true;
    await this.userRepo.save(user);

    const payload = {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
    };

    const tokens = await this.tokenService.generateTokens(payload);

    return {
      message: AuthMessages.LOGIN_SUCCESSFUL,
      user,
      tokens,
    };
  }

  async createInitialAdminUser() {
    const usersCount = await this.userRepo.count();

    if (usersCount > 0) {
      return;
    }

    const adminRole = await this.roleRepo.findOne({
      where: {
        name: "admin",
      },
    });

    if (!adminRole) {
      throw new BadRequestException("Admin role not found");
    }

    const adminUser = this.userRepo.create({
      mobile: process.env.ADMIN_MOBILE ?? undefined,
      email: process.env.ADMIN_EMAIL ?? undefined,
      role: adminRole,
      isVerified: true,
    });

    await this.userRepo.save(adminUser);
  }

  async validateAccessToken(token: string) {
    const { id } = this.tokenService.verifyAccessToken(token);

    const user = await this.userRepo.findOne({
      where: { id },
      relations: {
        role: {
          permissions: true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException("login again");
    }

    return user;
  }
}
