import { Module } from "@nestjs/common";
import { AdminModule } from "../admin/admin.module";
import { AdminVendorsController } from "./controllers/admin-vendors.controller";
import { AdminVendorsService } from "./services/admin-vendors.service";

@Module({
  imports: [AdminModule],
  controllers: [AdminVendorsController],
  providers: [AdminVendorsService],
})
export class VendorsModule {}
