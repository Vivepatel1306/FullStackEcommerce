import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/database.module";
import { CreateVendorDto } from "../dto/create-vendor.dto";
import { UpdateVendorDto } from "../dto/update-vendor.dto";
import { VendorReviewDto } from "../dto/vendor-review.dto";

@Injectable()
export class VendorRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateVendorDto) {
    return this.prisma.vendor.create({
      data: {
        ownerId: input.ownerId,
        businessName: input.businessName,
        legalName: input.legalName,
        email: input.email,
        phone: input.phone,
        address: { create: input.address },
      },
      include: { address: true, documents: true },
    });
  }

  findById(id: string) {
    return this.prisma.vendor.findUnique({
      where: { id },
      include: { address: true, documents: true },
    });
  }
  update(id: string, input: UpdateVendorDto) {
    return this.prisma.vendor.update({
      where: { id },
      data: input,
      include: { address: true, documents: true },
    });
  }
  review(id: string, input: VendorReviewDto) {
    return this.prisma.vendor.update({
      where: { id },
      data: {
        status: input.status,
        rejectionReason: input.rejectionReason ?? null,
      },
      include: { address: true, documents: true },
    });
  }
  addDocument(
    vendorId: string,
    documentType: string,
    fileName: string,
    objectKey: string,
  ) {
    return this.prisma.vendorDocument.create({
      data: { vendorId, documentType, fileName, objectKey },
    });
  }
}
