import { SetMetadata } from "@nestjs/common";
import { Role } from "../enums/role.enum";

export const SKIP_AUTH_KEY = "skipAuth";
export const ROLES_KEY = "roles";

export const SkipAuth = () =>
  SetMetadata(SKIP_AUTH_KEY, true);

export const CanAccess = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);