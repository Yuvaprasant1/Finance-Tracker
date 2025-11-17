export interface UserProfileDTO {
  id?: string;
  phoneNumber?: string;
  name?: string;
  email?: string;
  currency: string;
  address?: string;
  canEditCurrency: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserProfileRequest {
  name?: string;
  email?: string;
  currency?: string;
  address?: string;
}


