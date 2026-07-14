import EmailVerificationModel from "./emailVerification.model.js";
import DriverModel from "../driver/driver.model.js";
import UserModel from "../user/user.model.js";

export const cleanupExpiredVerificationUsers = async () => {
  const expiredTokens = await EmailVerificationModel.find({
    expiresAt: { $lt: new Date() },
  });

  for (const verification of expiredTokens) {
    if (verification.accountType === "User") {
      const user = await UserModel.findById(verification.user);

      if (user && !user.isEmailVerified) {
        await UserModel.findByIdAndDelete(user._id);
      }
    } else {
      const driver = await DriverModel.findById(verification.user);

      if (driver && !driver.isEmailVerified) {
        await DriverModel.findByIdAndDelete(driver._id);
      }
    }

    await EmailVerificationModel.findByIdAndDelete(verification._id);
  }
};

// export const cleanupExpiredVerificationUsers = async () => {
//   console.log("Cleanup Job Running...");

//   const expiredTokens = await EmailVerificationModel.find({
//     expiresAt: { $lt: new Date() },
//   });

//   console.log("Expired Tokens:", expiredTokens.length);

//   for (const verification of expiredTokens) {
//     console.log("Processing:", verification);

//     const driver = await DriverModel.findById(verification.user);

//     console.log("Driver Found:", driver);

//     if (driver) {
//       console.log("Verified:", driver.isEmailVerified);

//       const deleted = await DriverModel.findByIdAndDelete(driver._id);

//       console.log("Deleted:", deleted);
//     }

//     await EmailVerificationModel.findByIdAndDelete(verification._id);
//   }
// };
