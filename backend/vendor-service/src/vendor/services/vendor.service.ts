import { Injectable, NotFoundException } from "@nestjs/common";
import { VendorEventPublisher } from "../../events/vendor-event.publisher";
import { RedisService } from "../../redis/redis.service";
import { CreateVendorDto } from "../dto/create-vendor.dto";
import { UpdateVendorDto } from "../dto/update-vendor.dto";
import { VendorReviewDto } from "../dto/vendor-review.dto";
import { VendorRepository } from "./vendor.repository";

@Injectable()
export class VendorService {
  constructor(
    private readonly repository: VendorRepository,
    private readonly cache: RedisService,
    private readonly events: VendorEventPublisher,
  ) {}

  async create(input: CreateVendorDto) {
    const vendor = await this.repository.create(input);
    await this.cache.set(`vendor:${vendor.id}`, vendor);
    await this.events.publish({
      event: "vendor.created",
      vendorId: vendor.id,
      ownerId: vendor.ownerId,
      status: vendor.status,
      occurredAt: new Date().toISOString(),
    });
    return vendor;
  }
  async findById(id: string) {
    const cached = await this.cache.get(`vendor:${id}`);
    if (cached) return cached;
    const vendor = await this.repository.findById(id);
    if (!vendor) throw new NotFoundException("Vendor not found");
    await this.cache.set(`vendor:${id}`, vendor);
    return vendor;
  }
  async update(id: string, input: UpdateVendorDto) {
    await this.ensureExists(id);
    const vendor = await this.repository.update(id, input);
    await this.cache.set(`vendor:${id}`, vendor);
    return vendor;
  }
  async review(id: string, input: VendorReviewDto) {
    const current = await this.ensureExists(id);
    const vendor = await this.repository.review(id, input);
    await this.cache.set(`vendor:${id}`, vendor);
    await this.events.publish({
      event: "vendor.status.changed",
      vendorId: vendor.id,
      ownerId: current.ownerId,
      status: vendor.status,
      occurredAt: new Date().toISOString(),
    });
    return vendor;
  }
  async addDocument(
    id: string,
    documentType: string,
    fileName: string,
    objectKey: string,
  ) {
    await this.ensureExists(id);
    await this.cache.del(`vendor:${id}`);
    return this.repository.addDocument(id, documentType, fileName, objectKey);
  }
  private async ensureExists(id: string) {
    const vendor = await this.repository.findById(id);
    if (!vendor) throw new NotFoundException("Vendor not found");
    return vendor;
  }
}
