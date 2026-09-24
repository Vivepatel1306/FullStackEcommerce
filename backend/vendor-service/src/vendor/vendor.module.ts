import { Module } from "@nestjs/common";
import { VendorController } from "./controllers/vendor.controller";
import { VendorEventPublisher } from "../events/vendor-event.publisher";
import { VendorRepository } from "./services/vendor.repository";
import { VendorService } from "./services/vendor.service";

@Module({
  controllers: [VendorController],
  providers: [VendorService, VendorRepository, VendorEventPublisher],
})
export class VendorModule {}
