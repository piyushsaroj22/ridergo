export interface GetUserProfileResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    isEmailVerified: boolean;
  };
}

export interface UpdateUserProfileInput {
  name: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    isEmailVerified: boolean;
  };
}
