import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

import { AuthenticatedUser } from '../common/interfaces/user.interface';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service
  ) {}

  
private async isImageInUse(imageKey: string): Promise<boolean> {
  const product = await this.prisma.product.findFirst({
    where: {
      imageKey,
    },
    select: {
      id: true,
    },
  });

  return product !== null;
}

private async validateImage(
  imageKey: string | undefined,
  user: AuthenticatedUser,
) {
  if (!imageKey) {
    return;
  }

  if (
    user.role !== 'ADMIN' &&
    !imageKey.startsWith(`products/${user.sub}/`)
  ) {
    throw new ForbiddenException(
      'You can only use your own uploaded images',
    );
  }

  const exists = await this.s3Service.verifyObjectExists(
    imageKey,
  );

  if (!exists) {
    throw new NotFoundException(
      'Image not found in S3',
    );
  }
}


  // =========================
  // CREATE
  // =========================

  
async create(
  createProductDto: CreateProductDto,
  user: AuthenticatedUser,
) {
  try {
    await this.validateImage(
      createProductDto.imageKey,
      user,
    );

    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        category: createProductDto.category,
        imageKey: createProductDto.imageKey,
        vendorId: user.sub,
        isActive: true,
      },
    });

    return {
      message: 'Product created successfully',
      product,
    };
  } catch (error) {
    if (
      error instanceof ForbiddenException ||
      error instanceof NotFoundException ||
      error instanceof InternalServerErrorException
    ) {
      throw error;
    }

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
      sortBy = 'createdAt',
      sortOrder = 'desc',
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
          [sortBy]: sortOrder,
        },
      }),

      this.prisma.product.count({
        where,
      }),
    ]
  );

    // Generate temporary S3 URLs for products that have images
    const productsWithImageUrls = await Promise.all(
      products.map(async (product) => {
        let imageUrl: string | null = null;

        if (product.imageKey) {
          const result = await this.s3Service.generateViewUrl(
            product.imageKey,
          );

          imageUrl = result.viewUrl;
        }

        return {
          ...product,
          imageUrl,
        };
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      products: productsWithImageUrls,

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
  const product = await this.prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  let imageUrl: string | null = null;

  if (product.imageKey) {
    const result = await this.s3Service.generateViewUrl(
      product.imageKey,
    );

    imageUrl = result.viewUrl;
  }

  return {
    ...product,
    imageUrl,
  };
}
  // =========================
  // UPDATE
  // =========================

  

async update(
  id: number,
  updateProductDto: UpdateProductDto,
  user: AuthenticatedUser,
) {
  const product = await this.findActiveProduct(id);

  // 1. Verify product ownership.
  if (
    user.role === 'VENDOR' &&
    product.vendorId !== user.sub
  ) {
    throw new ForbiddenException(
      'You can only update your own products',
    );
  }

  // 2. Validate the new image, if supplied.
  if (updateProductDto.imageKey !== undefined) {
    await this.validateImage(
      updateProductDto.imageKey,
      user,
    );
  }

  try {
    // 3. Update the database first.
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    const oldImageKey = product.imageKey;
    const newImageKey = updatedProduct.imageKey;

    // 4. Clean up the old image only when the key changes.
    if (
      oldImageKey &&
      oldImageKey !== newImageKey
    ) {
      const stillInUse = await this.isImageInUse(oldImageKey);

      if (!stillInUse) {
        try {
          await this.s3Service.deleteObject(oldImageKey);
        } catch (error) {
          // The database update succeeded. Don't report it
          // as failed just because S3 cleanup failed.
          console.error('Failed to clean up old S3 image:', error);
        }
      }
    }

    return {
      message: 'Product updated successfully',
      product: updatedProduct,
    };
  } catch (error) {
    this.handlePrismaError(error);
  }
}



  // =========================
  // DELETE
  // =========================

  async remove(
    id: number,
    user: AuthenticatedUser,
  ) {
    const product =
      await this.findActiveProduct(id);

    // Vendors can only delete their own products.
    // ADMIN can delete any product.
    if (
      user.role === 'VENDOR' &&
      product.vendorId !== user.sub
    ) {
      throw new ForbiddenException(
        'You can only delete your own products',
      );
    }

    try {
      const updatedProduct =
        await this.prisma.product.update({
          where: {
            id,
          },

          // Soft delete
          data: {
            isActive: false,
          },
        });

      return {
        message:
          'Product deleted successfully',

        product: updatedProduct,
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // =========================
  // CHECK PRODUCT EXISTS
  // =========================

  private async findActiveProduct(
    id: number,
  ) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (
      !product ||
      !product.isActive
    ) {
      throw new NotFoundException(
        `Product with ID ${id} not found`,
      );
    }

    return product;
  }

  // =========================
  // PRISMA ERROR HANDLER
  // =========================

  private handlePrismaError(
    error: unknown,
  ): never {
    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
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