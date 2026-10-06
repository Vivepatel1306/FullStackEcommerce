import { Module } from "@nestjs/common";
import { OrderConsumer } from "./order.consumer";
import { PaymentConsumer } from "./payment.consumer";
import { UserConsumer } from "./user.consumer";
import { VendorConsumer } from "./vendor.consumer";

@Module({
  providers: [OrderConsumer, PaymentConsumer, UserConsumer, VendorConsumer],
  exports: [OrderConsumer, PaymentConsumer, UserConsumer, VendorConsumer],
})
export class ConsumersModule {}
