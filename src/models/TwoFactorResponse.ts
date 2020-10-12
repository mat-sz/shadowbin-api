export interface TwoFactorResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}
