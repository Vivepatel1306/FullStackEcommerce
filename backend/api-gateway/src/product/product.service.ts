import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

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


  if (axios.isAxiosError(error)) {
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
async create(
  data: any,
  authorization: string,
) {
  try {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.productServiceUrl}/products`,
        data,
        {
          headers: {
            Authorization: authorization,
          },
        },
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

 async update(
  id: number,
  data: any,
  user: JwtPayload,
  authorization: string,
) {
  try {
    const response = await firstValueFrom(
      this.httpService.patch(
        `${this.productServiceUrl}/products/${id}`,
        data,
        {
          headers: {
            Authorization: authorization,
          },
        },
      ),
    );

    return response.data;
  } catch (error) {
    this.handleError(error);
  }
}
  async remove(id: number,
  user: JwtPayload) {
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