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
import { Role } from "src/common/enums/role.enum";
import { TokenService } from "./token.service";
import { AuthMessages } from "src/common/enums/message.enum";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,

    @InjectRepository(otpEntity)
    private otpRepo: Repository<otpEntity>,

    private readonly tokenService: TokenService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { method: authMethod, mobile, email } = dto;

    let identifier: string;
    let userWhere: { mobile: string } | { email: string };

    if (authMethod === "mobile") {
      if (!mobile) {
        throw new BadRequestException(
          AuthMessages.BOTH_EMAIL_OR_MOBILE_REQUIRED,
        );
      }
      identifier = mobile;
      userWhere = { mobile };
    } else if (authMethod === "email") {
      if (!email) {
        throw new BadRequestException(
          AuthMessages.BOTH_EMAIL_OR_MOBILE_REQUIRED,
        );
      }
      identifier = email;
      userWhere = { email };
    } else {
      throw new BadRequestException("روش ورود نامعتبر است");
    }

    let user = await this.userRepo.findOne({ where: userWhere });

    if (!user) {
      const usersCount = await this.userRepo.count();
      const role = usersCount === 0 ? Role.Admin : Role.User;

      user = this.userRepo.create({
        mobile: authMethod === "mobile" ? mobile : undefined,
        email: authMethod === "email" ? email : undefined,
        role,
      });

      user = await this.userRepo.save(user);
    }

    const existingOtp = await this.otpRepo.findOne({
      where: { userId: user.id },
    });

    const now = new Date();
    if (existingOtp && existingOtp.expires_in > now) {
      throw new BadRequestException(AuthMessages.OTP_COOLDOWN);
    }

    if (existingOtp) {
      await this.otpRepo.delete({ id: existingOtp.id });
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
      code,
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
    if (usersCount === 0) {
      const adminUser = this.userRepo.create({
        mobile: process.env.ADMIN_MOBILE ?? undefined,
        email: process.env.ADMIN_EMAIL ?? undefined,
        role: Role.Admin,
        isVerified: true,
      });
      await this.userRepo.save(adminUser);
    }
  }

  async validateAccessToken(token: string) {
    const { id } = this.tokenService.verifyAccessToken(token);

    const user = await this.userRepo.findOneBy({ id });

    if (!user) throw new UnauthorizedException("login again");
    return user;
  }
}
