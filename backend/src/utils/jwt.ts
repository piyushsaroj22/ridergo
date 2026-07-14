import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import env from "../config/env.js";

export type AccountType = "User" | "Driver" | "Admin";

export interface TokenPayload extends JwtPayload {
  accountId: string;
  accountType: AccountType;
}

export const generateToken = (
  accountId: string,
  accountType: AccountType,
): string => {
  return jwt.sign(
    {
      accountId,
      accountType,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    },
  );
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};
