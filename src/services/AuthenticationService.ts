import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { randomBytes } from 'crypto';
import { Context } from 'koa';

import { User } from '../entities/User';
import { AuthenticationRequest } from '../models/AuthenticationRequest';
import {
  AuthenticationResponse,
  AuthenticationResponseResult,
} from '../models/AuthenticationResponse';
import { TwoFactorResponse } from '../models/TwoFactorResponse';
import { JWTData, AuthenticationStatus } from '../models/JWTData';
import { TwoFactorRequest } from '../models/TwoFactorRequest';
import { RefreshTokenResponse } from '../models/RefreshTokenResponse';
import { Session } from '../entities/Session';

@Service()
export class AuthenticationService {
  @OrmRepository(User)
  private userRepository: Repository<User>;

  @OrmRepository(Session)
  private sessionRepository: Repository<Session>;

  async createSession(user: User, context?: Context) {
    const session = new Session();
    session.refreshToken = randomBytes(128).toString('base64');
    session.user = user;

    if (context) {
      session.firstIp = context.ip;
      session.lastIp = context.ip;
      session.firstUserAgent = context.headers['user-agent'];
      session.lastUserAgent = context.headers['user-agent'];
    }

    await this.sessionRepository.save(session);
    return session;
  }

  async authenticate(
    request: AuthenticationRequest,
    context?: Context
  ): Promise<AuthenticationResponse> {
    const user = await this.userRepository.findOne({
      where: { name: request.username },
      relations: ['authenticationMethods'],
    });

    if (!user) {
      return {
        result: AuthenticationResponseResult.FAILURE,
      };
    }

    let result = AuthenticationResponseResult.FAILURE;
    let token: string | undefined = undefined;
    let refreshToken: string | undefined = undefined;
    let expiresIn: number | undefined = undefined;

    if (await compare(request.password, user.password)) {
      result = AuthenticationResponseResult.SUCCESS;
    }

    if (
      result === AuthenticationResponseResult.SUCCESS &&
      user.twoFactorSecret
    ) {
      result = AuthenticationResponseResult.REQUIRE_2FA;
    }

    if (result === AuthenticationResponseResult.SUCCESS) {
      const data: JWTData = {
        status: AuthenticationStatus.AUTHENTICATED,
        uuid: user.uuid,
        name: user.name,
        role: user.role,
      };

      expiresIn = parseInt(process.env.JWT_EXPIRY);
      token = sign(data, process.env.JWT_SECRET, {
        expiresIn,
      });

      refreshToken = (await this.createSession(user, context)).refreshToken;
    } else if (result === AuthenticationResponseResult.REQUIRE_2FA) {
      const data: JWTData = {
        status: AuthenticationStatus.REQUIRE_2FA,
        uuid: user.uuid,
        name: user.name,
        role: user.role,
      };

      expiresIn = parseInt(process.env.JWT_EXPIRY);
      token = sign(data, process.env.JWT_SECRET, {
        expiresIn,
      });
    }

    return {
      result,
      token,
      refreshToken,
      expiresIn,
    };
  }

  async refreshToken(
    refreshToken: string,
    context?: Context
  ): Promise<RefreshTokenResponse> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken },
      relations: ['user'],
    });

    if (!session) {
      return {
        success: false,
      };
    }

    if (context) {
      session.lastIp = context.ip;
      session.lastUserAgent = context.headers['user-agent'];
      await this.sessionRepository.save(session);
    }

    const data: JWTData = {
      status: AuthenticationStatus.AUTHENTICATED,
      uuid: session.user.uuid,
      name: session.user.name,
      role: session.user.role,
    };
    const expiresIn = parseInt(process.env.JWT_EXPIRY);
    const token = sign(data, process.env.JWT_SECRET, {
      expiresIn,
    });

    return {
      success: true,
      token,
      expiresIn,
    };
  }

  async twoFactorVerify(
    request: TwoFactorRequest,
    user: User,
    context?: Context
  ): Promise<TwoFactorResponse> {
    if (
      !user?.twoFactorSecret ||
      !request.token ||
      !authenticator.check(request.token, user.twoFactorSecret)
    ) {
      return {
        success: false,
      };
    }

    const data: JWTData = {
      status: AuthenticationStatus.AUTHENTICATED,
      uuid: user.uuid,
      name: user.name,
      role: user.role,
    };
    const expiresIn = parseInt(process.env.JWT_EXPIRY);
    const token = sign(data, process.env.JWT_SECRET, {
      expiresIn,
    });

    return {
      success: true,
      token,
      refreshToken: (await this.createSession(user, context)).refreshToken,
      expiresIn,
    };
  }

  async twoFactorEnable(user: User) {
    if (user.twoFactorSecret) {
      throw new Error('2FA is already enabled for this user.');
    }

    user.twoFactorSecret = authenticator.generateSecret();
    this.userRepository.save(user);

    return {
      uri: authenticator.keyuri(user.name, 'kreds', user.twoFactorSecret),
    };
  }

  async twoFactorDisable(user: User, token: string) {
    if (!user.twoFactorSecret) {
      throw new Error('2FA is not enabled for this user.');
    }

    if (!authenticator.check(token, user.twoFactorSecret)) {
      throw new Error('Invalid token.');
    }
  }
}
