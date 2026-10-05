import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get productServiceUrl(): string {
    return this.configService.getOrThrow<string>('PRODUCT_SERVICE_URL');
  }

  private handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        throw new BadRequestException(message ?? 'Bad request');
      }

      if (status === 404) {
        throw new NotFoundException(message ?? 'Product not found');
      }
    }

    throw new InternalServerErrorException(
      'Product service is unavailable',
    );
  }

  async create(data: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.productServiceUrl}/products`,
          data,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.productServiceUrl}/products`,
          {
            params: query,
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.productServiceUrl}/products/${id}`,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: number, data: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.productServiceUrl}/products/${id}`,
          data,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(
          `${this.productServiceUrl}/products/${id}`,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}