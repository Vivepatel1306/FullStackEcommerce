import {
   Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: any) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: any) {
    return this.authService.login(data);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  logout(@Headers('authorization') authorization: string) {
    return this.authService.logout(authorization);
  }

  @Post('resend-verification')
  resendVerification(@Body('email') email: string) {
    return this.authService.resendVerification(email);
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(@Body() data: any) {
    return this.authService.resetPassword(data);
  }

  @Post('change-password')
  changePassword(
    @Body() data: any,
    @Headers('authorization') authorization: string,
  ) {
    return this.authService.changePassword(data, authorization);
  }
  @Get('verify-email')
verifyEmail(@Query('token') token: string) {
  return this.authService.verifyEmail(token);
}
  
}