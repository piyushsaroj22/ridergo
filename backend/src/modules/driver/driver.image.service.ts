import { HydratedDocument } from "mongoose";
import { Driver } from "./driver.model.js";
import { uploadImage, deleteImage } from "../../services/cloudinary.service.js";

interface UpdateDriverImageInput {
  driver: HydratedDocument<Driver>;
  file: Express.Multer.File;
  folder: string;
  imageField: "profileImage" | "licenseImage" | "rcImage" | "vehicleImage";
  publicIdField:
    | "profileImagePublicId"
    | "licenseImagePublicId"
    | "rcImagePublicId"
    | "vehicleImagePublicId";
}

export const updateDriverImage = async ({
  driver,
  file,
  folder,
  imageField,
  publicIdField,
}: UpdateDriverImageInput) => {
  if (!file) {
    throw new Error("Image is required");
  }

  //delete old image
  const oldPublicId = driver[publicIdField];

  if (oldPublicId) {
    await deleteImage(oldPublicId);
  }

  // Upload new image
  const uploadedImage = await uploadImage(file.buffer, folder);

  driver[imageField] = uploadedImage.secureUrl;
  driver[publicIdField] = uploadedImage.publicId;

  await driver.save();

  return uploadedImage;
};
