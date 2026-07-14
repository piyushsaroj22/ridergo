import { AccountType } from "../utils/jwt.js";
import { HydratedDocument } from "mongoose";
import UserModel from "../modules/user/user.model.js";
import DriverModel from "../modules/driver/driver.model.js";

type UserDocument = HydratedDocument<
  typeof UserModel extends import("mongoose").Model<infer T> ? T : never
>;

type DriverDocument = HydratedDocument<
  typeof DriverModel extends import("mongoose").Model<infer T> ? T : never
>;

declare global {
  namespace Express {
    interface Request {
      account?: UserDocument | DriverDocument;
      accountType?: AccountType;
    }
  }
}

export {};
