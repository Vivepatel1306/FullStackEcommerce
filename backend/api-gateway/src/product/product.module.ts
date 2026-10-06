import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService,JwtAuthGuard],
})
export class ProductModule {}