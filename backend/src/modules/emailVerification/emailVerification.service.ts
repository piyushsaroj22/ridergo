import crypto from "crypto";
import env from "../../config/env.js";
import EmailVerificationModel from "./emailVerification.model.js";
import verificationEmailTemplate from "../../templates/verificationEmail.js";
import { sendMail } from "../../services/mail.service.js";

export const sendVerificationEmail = async (
  userId: string,
  accountType: "User" | "Driver",
  name: string,
  email: string,
): Promise<void> => {
  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // todo ye baad me sahi kar dunga 15 * 60 * 1000

  await EmailVerificationModel.deleteMany({
    user: userId,
  });

  await EmailVerificationModel.create({
    user: userId,
    accountType,
    token,
    expiresAt,
  });

  const verificationLink = `${env.APP_URL}/api/auth/verify-email/${token}`;

  await sendMail({
    to: email,
    subject: "Verify your RiderGO account",
    html: verificationEmailTemplate(name, verificationLink),
  });
};
