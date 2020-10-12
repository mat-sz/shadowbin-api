export enum AuthenticationStatus {
  AUTHENTICATED = 'authenticated',
  NOT_AUTHENTICATED = 'not_authenticated',
  REQUIRE_2FA = 'require_2fa',
}

export interface JWTData {
  uuid: string;
  name: string;
  status: AuthenticationStatus;
}
