import { Socket } from "socket.io";
import { AccountType, verifyToken } from "../utils/jwt.js";

export interface SocketAccount {
  accountId: string;
  accountType: Exclude<AccountType, "Admin">;
}

export const authenticateSocket = (socket: Socket): SocketAccount => {
  const token = socket.handshake.auth.token;

  if (!token) {
    throw new Error("Authentication token is required");
  }

  const payload = verifyToken(token);

  if (payload.accountType === "Admin") {
    throw new Error("Admin socket is not supported");
  }

  return {
    accountId: payload.accountId,
    accountType: payload.accountType,
  };
};
