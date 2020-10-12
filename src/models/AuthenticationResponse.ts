export enum AuthenticationResponseResult {
  SUCCESS = 'success',
  FAILURE = 'failure',
  REQUIRE_2FA = 'require_2fa',
}

export interface AuthenticationResponse {
  result: AuthenticationResponseResult;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}
