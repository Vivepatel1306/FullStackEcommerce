import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  createHash,
  randomBytes,
  randomUUID,
} from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  // =====================================================
  // Generate Refresh Token
  // =====================================================

  private async generateRefreshToken(
    userId: number,
  ) {
    const jti = randomUUID();

    const token =
      await this.jwtService.signAsync(
        {
          sub: userId,
          type: 'refresh',
          jti,
        },
        {
          expiresIn: '7d',
        },
      );

    return token;
  }

  // =====================================================
  // Hash Refresh Token
  // =====================================================

  private hashRefreshToken(
    token: string,
  ): string {
    return createHash('sha256')
      .update(token)
      .digest('hex');
 
    }

  // =====================================================
  // Hash Refresh Token with bcrypt
  // =====================================================

  private async hashRefreshTokenWithBcrypt(
    token: string,
  ): Promise<string> {
    const tokenHash =
      this.hashRefreshToken(token);

    return bcrypt.hash(tokenHash, 12);
  }

  // =====================================================
  // Compare Refresh Token
  // =====================================================

  private async compareRefreshToken(
    token: string,
    storedHash: string,
  ): Promise<boolean> {
    const tokenHash =
      this.hashRefreshToken(token);

    return bcrypt.compare(
      tokenHash,
      storedHash,
    );
  }


  private generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

private hashVerificationToken(token: string): string {
  return createHash('sha256')
    .update(token)
    .digest('hex');
}

  // =====================================================
  // REGISTER
  // =====================================================

 async register(registerDto: RegisterDto) {
  const {
    email,
    password,
    firstName,
    lastName,
  } = registerDto;

  // 1. Check whether email already exists
  const existingUser =
    await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new ConflictException(
      'Email already registered',
    );
  }

  // 2. Hash password
  const passwordHash =
    await bcrypt.hash(password, 12);

  // 3. Generate verification token
  const verificationToken =
    this.generateVerificationToken();

  // 4. Hash verification token
  const verificationTokenHash =
    this.hashVerificationToken(
      verificationToken,
    );

  // 5. Token expires in 15 minutes
  const verificationExpiresAt =
    new Date(
      Date.now() + 15 * 60 * 1000,
    );

  // 6. Create user FIRST
  const user =
    await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: 'USER',
        verificationTokenHash,
        verificationExpiresAt,
      },
    });

  // 7. Send verification email
  await this.emailService.sendVerificationEmail(
    user.email,
    verificationToken,
  );

  return {
    message: 'User registered successfully',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

  async verifyEmail(token: string) {
  if (!token) {
    throw new UnauthorizedException(
      'Verification token is required',
    );
  }

  const tokenHash =
    this.hashVerificationToken(token);

  const user =
    await this.prisma.user.findFirst({
      where: {
        verificationTokenHash: tokenHash,
      },
    });

  if (!user) {
    throw new UnauthorizedException(
      'Invalid verification token',
    );
  }

  if (
    !user.verificationExpiresAt ||
    user.verificationExpiresAt < new Date()
  ) {
    throw new UnauthorizedException(
      'Verification token has expired',
    );
  }

  await this.prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
      verificationTokenHash: null,
      verificationExpiresAt: null,
    },
  });

  return {
    message: 'Email verified successfully',
  };
}
  // =====================================================
  // LOGIN
  // =====================================================

  async login(
    loginDto: LoginDto,
  ) {
    const {
      email,
      password,
    } = loginDto;

    // Find user
    const user =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // Compare password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.passwordHash,
      );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // Check account status
    if (!user.isActive) {
      throw new UnauthorizedException(
        'User account is inactive',
      );
    }

    // Generate access token
    const accessToken =
      await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

    // Generate refresh token
    const refreshToken =
      await this.generateRefreshToken(
        user.id,
      );

    // Hash refresh token
    const refreshTokenHash =
      await this.hashRefreshTokenWithBcrypt(
        refreshToken,
      );

    // Store refresh token hash
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshTokenHash,
      },
    });

    return {
      message: 'Login successful',

      accessToken,

      refreshToken,

      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  // =====================================================
  // REFRESH TOKEN
  // =====================================================

  async refresh(
    refreshToken: string,
  ) {
    // Make sure refresh token exists
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token is required',
      );
    }

    // ---------------------------------------------------
    // 1. Verify JWT
    // ---------------------------------------------------

    let payload: {
      sub: number;
      type: string;
      jti: string;
    };

    try {
      payload =
        await this.jwtService.verifyAsync(
          refreshToken,
        );
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired refresh token',
      );
    }

    // ---------------------------------------------------
    // 2. Make sure it is a refresh token
    // ---------------------------------------------------

    if (
      payload.type !== 'refresh'
    ) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    // ---------------------------------------------------
    // 3. Find user
    // ---------------------------------------------------

    const user =
      await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    // ---------------------------------------------------
    // 4. Make sure stored hash exists
    // ---------------------------------------------------

    if (!user.refreshTokenHash) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    // ---------------------------------------------------
    // 5. Compare refresh token
    // ---------------------------------------------------

    const tokenMatches =
      await this.compareRefreshToken(
        refreshToken,
        user.refreshTokenHash,
      );

    if (!tokenMatches) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    // ---------------------------------------------------
    // 6. Check account status
    // ---------------------------------------------------

    if (!user.isActive) {
      throw new UnauthorizedException(
        'User account is inactive',
      );
    }

    // ---------------------------------------------------
    // 7. Generate NEW access token
    // ---------------------------------------------------

    const accessToken =
      await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

    // ---------------------------------------------------
    // 8. Generate NEW refresh token
    // ---------------------------------------------------

    const newRefreshToken =
      await this.generateRefreshToken(
        user.id,
      );

    // ---------------------------------------------------
    // 9. Hash NEW refresh token
    // ---------------------------------------------------

    const newRefreshTokenHash =
      await this.hashRefreshTokenWithBcrypt(
        newRefreshToken,
      );

    // ---------------------------------------------------
    // 10. Replace OLD refresh token hash
    // ---------------------------------------------------

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshTokenHash:
          newRefreshTokenHash,
      },
    });

    // ---------------------------------------------------
    // 11. Return new tokens
    // ---------------------------------------------------

    return {
      message:
        'Tokens refreshed successfully',

      accessToken,

      refreshToken:
        newRefreshToken,
    };
  }
async resendVerification(email: string) {
  const user =
    await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    throw new UnauthorizedException(
      'Unable to process request',
    );
  }

  if (user.isVerified) {
    return {
      message: 'Email is already verified',
    };
  }

  // Generate a new token
  const verificationToken =
    this.generateVerificationToken();

  // Hash the new token
  const verificationTokenHash =
    this.hashVerificationToken(
      verificationToken,
    );

  // New expiry: 15 minutes
  const verificationExpiresAt =
    new Date(
      Date.now() + 15 * 60 * 1000,
    );

  // Replace old token
  await this.prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      verificationTokenHash,
      verificationExpiresAt,
    },
  });

  // Send new email
  await this.emailService.sendVerificationEmail(
    user.email,
    verificationToken,
  );

  return {
    message:
      'Verification email sent successfully',
  };
}
  // =====================================================
  // LOGOUT
  // =====================================================

  async logout(
    userId: number,
  ) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash: null,
      },
    });

    return {
      message:
        'Logout successful',
    };
  }
}