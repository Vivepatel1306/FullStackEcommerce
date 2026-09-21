import { ConflictException, Injectable,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    // 1. Check whether email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2. Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // 3. Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: 'USER',
      },
    });

    // 4. Never return password/passwordHash
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
  async login(loginDto: LoginDto) {
  const { email, password } = loginDto;

  // 1. Find user
  const user = await this.prisma.user.findUnique({
    where: {
      email,
    },
  });

  // 2. User doesn't exist
  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  // 3. Compare password
  const passwordMatch = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  // 4. Password is incorrect
  if (!passwordMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }
  const accessToken = await this.jwtService.signAsync({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  // 5. Return user for now
  return {
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}
}