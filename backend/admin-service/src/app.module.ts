import { Module } from "@nestjs/common";
import { AdminModule } from "./admin/admin.module";
import { VendorsModule } from "./vendors/vendors.module";

@Module({ imports: [AdminModule, VendorsModule] })
export class AppModule {}
