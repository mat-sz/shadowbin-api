export interface RefreshTokenResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}
