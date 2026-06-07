import { UserEntity } from "../user/entities/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
