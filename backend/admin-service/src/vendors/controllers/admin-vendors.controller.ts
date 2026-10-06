import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApproveVendorDto } from "../../admin/dto/approve-vendor.dto";
import { RejectVendorDto } from "../../admin/dto/reject-vendor.dto";
import { UpdateVendorStatusDto } from "../dto/update-vendor-status.dto";
import { AdminVendorsService } from "../services/admin-vendors.service";

@Controller("admin/vendors")
export class AdminVendorsController {
  constructor(private readonly vendors: AdminVendorsService) {}

  @Get()
  list(@Query("status") status?: string) {
    return this.vendors.list(status);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.vendors.get(id);
  }

  @Post(":id/approve")
  approve(@Param("id") id: string, @Body() input: ApproveVendorDto) {
    return this.vendors.approve(id, input);
  }

  @Post(":id/reject")
  reject(@Param("id") id: string, @Body() input: RejectVendorDto) {
    return this.vendors.reject(id, input);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() input: UpdateVendorStatusDto) {
    return this.vendors.updateStatus(id, input);
  }
}
