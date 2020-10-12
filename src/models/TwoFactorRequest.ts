import { RefreshTokenStorage } from './AuthenticationRequest';

export interface TwoFactorRequest {
  token: string;
  refreshTokenStorage?: RefreshTokenStorage;
}
