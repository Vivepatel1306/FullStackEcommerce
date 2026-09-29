import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { EmailModule } from '../email/email.module';
@Module({
  imports: [PrismaModule,EmailModule,
     JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '15m',
      },
    }),],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,RolesGuard],
})
export class AuthModule {}