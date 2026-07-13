import EmailVerificationModel from "./emailVerification.model.js";
import UserModel from "../user/user.model.js";

export const cleanupExpiredVerificationUsers = async () => {
  const expiredTokens = await EmailVerificationModel.find({
    expiresAt: { $lt: new Date() },
  });

  for (const verification of expiredTokens) {
    const user = await UserModel.findById(verification.user);

    if (user && !user.isEmailVerified) {
      await UserModel.findByIdAndDelete(user._id);
    }

    await EmailVerificationModel.findByIdAndDelete(verification._id);
  }
};
