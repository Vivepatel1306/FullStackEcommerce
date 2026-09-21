import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { RedisModule } from "./redis/redis.module";
import { S3Module } from "./s3/s3.module";
import { VendorModule } from "./vendor/vendor.module";

@Module({ imports: [DatabaseModule, RedisModule, S3Module, VendorModule] })
export class AppModule {}
