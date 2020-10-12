import { Inject } from 'typedi';
import {
  JsonController,
  Get,
  Post,
  Ctx,
  Body,
  CurrentUser,
  Authorized,
  CookieParam,
} from 'routing-controllers';

import { AuthenticationService } from '../services/AuthenticationService';
import { AuthenticationRequest } from '../models/AuthenticationRequest';
import { TwoFactorRequest } from '../models/TwoFactorRequest';
import { RefreshTokenRequest } from '../models/RefreshTokenRequest';
import { User } from '../entities/User';
import { Context } from 'koa';

@JsonController('/v1/authentication')
export class AuthenticationController {
  @Inject()
  private authenticationService: AuthenticationService;

  @Get('/')
  async index(@CurrentUser() user?: User) {
    return {
      isAuthenticated: !!user,
      user,
    };
  }

  @Post('/')
  async authenticate(
    @Ctx() context: Context,
    @Body() authenticationRequest: AuthenticationRequest
  ) {
    return await this.authenticationService.authenticate(
      authenticationRequest,
      context
    );
  }

  @Post('/refresh')
  async refresh(
    @Ctx() context: Context,
    @Body() refreshRequest: RefreshTokenRequest,
    @CookieParam('kreds_refresh_token') refreshToken?: string
  ) {
    return await this.authenticationService.refreshToken(
      refreshRequest?.refreshToken || refreshToken,
      context
    );
  }

  @Post('/2fa/verify')
  async twoFactor(
    @Ctx() context: Context,
    @CurrentUser({ required: true }) user: User,
    @Body() twoFactorRequest: TwoFactorRequest
  ) {
    return await this.authenticationService.twoFactorVerify(
      twoFactorRequest,
      user,
      context
    );
  }

  @Post('/2fa/enable')
  @Authorized()
  async twoFactorEnable(@CurrentUser({ required: true }) user: User) {
    return await this.authenticationService.twoFactorEnable(user);
  }
}
