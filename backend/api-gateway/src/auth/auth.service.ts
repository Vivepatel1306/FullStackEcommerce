import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get authServiceUrl(): string {
    return this.configService.getOrThrow<string>('AUTH_SERVICE_URL');
  }
private handleAuthError(error: unknown): never {
  const axiosError = error as AxiosError<any>;

  const status = axiosError.response?.status;

  const message =
    axiosError.response?.data?.message ??
    'Auth service request failed';

  switch (status) {
    case 400:
      throw new BadRequestException(message);

    case 401:
      throw new UnauthorizedException(message);

    case 403:
      throw new ForbiddenException(message);

    case 404:
      throw new NotFoundException(message);

    case 409:
      throw new ConflictException(message);

    case 500:
      throw new InternalServerErrorException(
        'Auth service internal error',
      );

    default:
      throw new HttpException(
        message,
        status ?? 500,
      );
  }
}

  async register(data: any) {
    try {
        const response = await firstValueFrom(
      this.httpService.post(
        `${this.authServiceUrl}/auth/register`,
        data,
      ),
    );

    return response.data;
    } catch (error) {
        this.handleAuthError(error);
    }
    
  }

 async login(data: any) {
  try {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.authServiceUrl}/auth/login`,
        data,
      ),
    );

    return response.data;
  } catch (error) {
    this.handleAuthError(error);
  }
}
  async refresh(refreshToken: string) {
    try {
        const response = await firstValueFrom(
      this.httpService.post(
        `${this.authServiceUrl}/auth/refresh`,
        { refreshToken },
      ),
    );

    return response.data;
    } catch (error) {
        this.handleAuthError(error);
    }
    
  }

  async logout(authHeader: string) {
    try {
        const response = await firstValueFrom(
      this.httpService.post(
        `${this.authServiceUrl}/auth/logout`,
        {},
        {
          headers: {
            Authorization: authHeader,
          },
        },
      ),
    );

    return response.data;
    } catch (error) {
        this.handleAuthError(error);
    }
    
  }

  async resendVerification(email: string) {
    try {
        const response = await firstValueFrom(
      this.httpService.post(
        `${this.authServiceUrl}/auth/resend-verification`,
        { email },
      ),
    );

    return response.data;
    } catch (error) {
        this.handleAuthError(error);
    }
    
  }

  async forgotPassword(email: string) {
    try {
        const response = await firstValueFrom(
      this.httpService.post(
        `${this.authServiceUrl}/auth/forgot-password`,
        { email },
      ),
    );

    return response.data;
    } catch (error) {
        this.handleAuthError(error);
    }
    
  }

  async resetPassword(data: any) {
    try {
        const response = await firstValueFrom(
      this.httpService.post(
        `${this.authServiceUrl}/auth/reset-password`,
        data,
      ),
    );

    return response.data;
    } catch (error) {
        this.handleAuthError(error);
    }
    
  }

  async changePassword(data: any, authHeader: string) {
    try {
         const response = await firstValueFrom(
      this.httpService.post(
        `${this.authServiceUrl}/auth/change-password`,
        data,
        {
          headers: {
            Authorization: authHeader,
          },
        },
      ),
    );

    return response.data;
    } catch (error) {
        this.handleAuthError(error);
    }
   
  }
  async verifyEmail(token: string) {
    try {
        const response = await firstValueFrom(
    this.httpService.get(
      `${this.authServiceUrl}/auth/verify-email`,
      {
        params: { token },
      },
    ),
  );

  return response.data;
    } catch (error) {
        this.handleAuthError(error);
    }
  
}
}