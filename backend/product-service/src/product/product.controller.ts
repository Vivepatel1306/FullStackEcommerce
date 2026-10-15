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
} from '@nestjs/common';

import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';


import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUploadUrlDto } from './dto/create-upload-url.dto';
import { ProductService } from './product.service';
import { S3Service } from '../s3/s3.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly s3Service: S3Service
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createProductDto: CreateProductDto,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.productService.create(
      createProductDto,
      req.user,
    );
  }

  @Get()
  findAll(
    @Query() getProductsDto: GetProductsDto,
  ) {
    return this.productService.findAll(getProductsDto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.productService.update(
      id,
      updateProductDto,
      req.user,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @NestRequest() req: AuthenticatedRequest,
  ) {
    return this.productService.remove(
      id,
      req.user,
    );
  }


@Post('images/upload-url')
@UseGuards(JwtAuthGuard)
   async generateUploadUrl(
  @Body() createUploadUrlDto: CreateUploadUrlDto,
  @NestRequest() req: AuthenticatedRequest,
) {
  const key = `products/${req.user.sub}/${Date.now()}-${createUploadUrlDto.fileName}`;

  return this.s3Service.generateUploadUrl(
    key,
    createUploadUrlDto.contentType,
  );
   }

@Get('images/view-url')
@UseGuards(JwtAuthGuard)
   async generateViewUrl(@Query('key') key: string) {
  return this.s3Service.generateViewUrl(key);
   }
}