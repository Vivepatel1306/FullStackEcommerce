import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request as NestRequest,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request as ExpressRequest } from 'express';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

 @Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'VENDOR')
create(
  @Body() createProductDto: CreateProductDto,
  @NestRequest() req: ExpressRequest,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new UnauthorizedException(
      'Authorization header is missing',
    );
  }

  return this.productService.create(
    createProductDto,
    authorization,
  );
}

  @Get()
  findAll(@Query() query: GetProductsDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productService.findOne(id);
  }

 @Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'VENDOR')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateProductDto: UpdateProductDto,
  @NestRequest() req: ExpressRequest,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new UnauthorizedException(
      'Authorization header is missing',
    );
  }

  return this.productService.update(
    id,
    updateProductDto,
    req.user,
    authorization,
  );
}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDOR')
  remove(
    @Param('id', ParseIntPipe) id: number,

    @NestRequest() req: ExpressRequest,
  ) {
    return this.productService.remove(
      id,
      req.user,
    );
  }
}