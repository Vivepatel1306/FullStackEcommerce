import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { AddDocumentDto } from "../dto/add-document.dto";
import { CreateVendorDto } from "../dto/create-vendor.dto";
import { UpdateVendorDto } from "../dto/update-vendor.dto";
import { VendorReviewDto } from "../dto/vendor-review.dto";
import { VendorService } from "../services/vendor.service";

@Controller("vendors")
export class VendorController {
  constructor(private readonly vendors: VendorService) {}

  @Post()
  create(@Body() input: CreateVendorDto) {
    return this.vendors.create(input);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.vendors.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() input: UpdateVendorDto) {
    return this.vendors.update(id, input);
  }

  @Post(":id/review")
  review(@Param("id") id: string, @Body() input: VendorReviewDto) {
    return this.vendors.review(id, input);
  }

  @Post(":id/documents")
  addDocument(@Param("id") id: string, @Body() input: AddDocumentDto) {
    return this.vendors.addDocument(
      id,
      input.documentType,
      input.fileName,
      input.objectKey,
    );
  }
}
