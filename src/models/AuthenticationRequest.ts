export enum AuthenticationRequestType {
  PASSWORD = 'password',
  OAUTH2 = 'oauth2',
  EXTENSION = 'extension',
}

export enum AuthenticationRequestPasswordSubtype {
  BCRYPT = 'bcrypt',
}

export enum RefreshTokenStorage {
  NONE = 'none',
  COOKIES = 'cookies',
}

export interface AuthenticationRequest {
  type: AuthenticationRequestType;
  username: string;
  subtype: string;
  data: Record<string, string> | string;
  refreshTokenStorage?: RefreshTokenStorage;
}

export interface AuthenticationRequestPassword extends AuthenticationRequest {
  type: AuthenticationRequestType.PASSWORD;
  subtype: AuthenticationRequestPasswordSubtype;
  data: string;
}

export interface AuthenticationRequestOAuth2 extends AuthenticationRequest {
  type: AuthenticationRequestType.OAUTH2;
  subtype: string;
  data: Record<string, string>;
}

export interface AuthenticationRequestExtension extends AuthenticationRequest {
  type: AuthenticationRequestType.EXTENSION;
  subtype: string;
  data: Record<string, string>;
}

export type AuthenticationRequestUnion =
  | AuthenticationRequest
  | AuthenticationRequestPassword
  | AuthenticationRequestOAuth2
  | AuthenticationRequestExtension;
