import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    const region = process.env.AWS_REGION;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!region) {
      throw new Error('AWS_REGION is not defined');
    }

    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME is not defined');
    }

    this.s3Client = new S3Client({
      region,
    });

    this.bucketName = bucketName;
  }

  async generateUploadUrl(
    key: string,
    contentType: string,
  ) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(
        this.s3Client,
        command,
        {
          expiresIn: 300,
        },
      );

      return {
        uploadUrl,
        key,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate upload URL',
      );
    }
  }
  async generateViewUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const viewUrl = await getSignedUrl(
      this.s3Client,
      command,
      {
        expiresIn: 3600,
      },
    );

    return {
      viewUrl,
    };
  } catch (error) {
    throw new InternalServerErrorException(
      'Failed to generate image URL',
    );
  }
}

async verifyObjectExists(key: string): Promise<boolean> {
  try {
    await this.s3Client.send(
      new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );

    return true;
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } })
      .$metadata?.httpStatusCode;

    if (status === 404) {
      return false;
    }

    throw new InternalServerErrorException(
      'Failed to verify image in S3',
    );
  }
}

async deleteObject(key: string): Promise<void> {
  try {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  } catch (error) {
    throw new InternalServerErrorException(
      'Failed to delete image from S3',
    );
  }
}

}