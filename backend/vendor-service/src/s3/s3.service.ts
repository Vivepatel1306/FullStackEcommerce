import { Injectable } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

@Injectable()
export class S3Service {
  private readonly client = new S3Client({
    region: process.env.AWS_REGION ?? "us-east-1",
    endpoint: process.env.AWS_S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.AWS_S3_ENDPOINT),
  });

  async uploadVendorDocument(
    vendorId: string,
    fileName: string,
    content: Buffer,
    contentType?: string,
  ): Promise<string> {
    const objectKey = `vendors/${vendorId}/${Date.now()}-${fileName}`;
    const bucket = process.env.S3_VENDOR_DOCUMENTS_BUCKET;
    if (!bucket)
      throw new Error("S3_VENDOR_DOCUMENTS_BUCKET is not configured");
    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: content,
        ContentType: contentType,
      }),
    );
    return objectKey;
  }
}
