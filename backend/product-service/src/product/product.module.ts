import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    PassportModule,
    S3Module
  ],
  controllers: [
    ProductController,
  ],
  providers: [
    ProductService,
    JwtStrategy,
  ],
})
export class ProductModule {}