import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // CREATE
  // =========================

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          price: createProductDto.price,
          category: createProductDto.category,
          imageUrl: createProductDto.imageUrl,
          isActive: true,
        },
      });

      return {
        message: 'Product created successfully',
        product,
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // =========================
  // GET ALL
  // =========================

  async findAll(getProductsDto: GetProductsDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
      } = getProductsDto;

      const skip = (page - 1) * limit;

      const where: Prisma.ProductWhereInput = {
        isActive: true,

        ...(search && {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }),

        ...(category && {
          category: {
            equals: category,
            mode: 'insensitive',
          },
        }),
      };

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),

        this.prisma.product.count({
          where,
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // =========================
  // GET ONE
  // =========================

  async findOne(id: number) {
    return this.findActiveProduct(id);
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ) {
    // First check whether product exists
    await this.findActiveProduct(id);

    try {
      const product = await this.prisma.product.update({
        where: {
          id,
        },
        data: updateProductDto,
      });

      return {
        message: 'Product updated successfully',
        product,
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // =========================
  // DELETE
  // =========================

 async remove(id: number) {

  await this.findActiveProduct(id);

  const updatedProduct = await this.prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  console.log('PRODUCT UPDATED:', updatedProduct);

  return {
    message: 'Product deleted successfully',
    product: updatedProduct,
  };
}

  // =========================
  // CHECK PRODUCT EXISTS
  // =========================

  private async findActiveProduct(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product || !product.isActive) {
    console.log('PRODUCT IS NOT ACTIVE');
    throw new NotFoundException(
      `Product with ID ${id} not found`,
    );
  }

    return product;
  }

  // =========================
  // PRISMA ERROR HANDLER
  // =========================

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new NotFoundException(
            'Product not found',
          );

        case 'P2002':
          throw new ConflictException(
            'Product already exists',
          );

        case 'P2003':
          throw new ConflictException(
            'Product cannot be modified because it is referenced by another record',
          );

        default:
          throw new InternalServerErrorException(
            'Database operation failed',
          );
      }
    }

    throw new InternalServerErrorException(
      'Something went wrong while processing the product',
    );
  }
}