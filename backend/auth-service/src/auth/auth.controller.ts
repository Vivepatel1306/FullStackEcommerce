import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Throttle({
  default: {
    limit: 5,
    ttl: 60000,
  },
})
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Req() req: any) {
    return this.authService.logout(req.user.userId);
  }
  

@Get('verify-email')
verifyEmail(@Query('token') token: string) {
  return this.authService.verifyEmail(token);
}


@Post('resend-verification')
@Throttle({
  default: {
    limit: 3,
    ttl: 60000,
  },
})
resendVerification(@Body('email') email: string) {
  return this.authService.resendVerification(email);
}


@Post('forgot-password')
@Throttle({
  default: {
    limit: 3,
    ttl: 60000,
  },
})
forgotPassword(
  @Body() forgotPasswordDto: ForgotPasswordDto,
) {
  return this.authService.forgotPassword(
    forgotPasswordDto,
  );
}


@Post('reset-password')
resetPassword(
  @Body() resetPasswordDto: ResetPasswordDto,
) {
  return this.authService.resetPassword(
    resetPasswordDto,
  );
}


@Post('change-password')
@UseGuards(AuthGuard('jwt'))
changePassword(
  @Req() req: any,
  @Body() changePasswordDto: ChangePasswordDto,
) {
  return this.authService.changePassword(
    req.user.userId,
    changePasswordDto,
  );
}
}