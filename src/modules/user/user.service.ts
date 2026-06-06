import {
  Inject,
  Injectable,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @Inject(REQUEST) private request: Request,
  ) {}


}
