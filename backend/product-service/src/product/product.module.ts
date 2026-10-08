import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
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