import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { OrderConsumer } from "../consumers/order.consumer";
import { PaymentConsumer } from "../consumers/payment.consumer";
import { UserConsumer } from "../consumers/user.consumer";
import { VendorConsumer } from "../consumers/vendor.consumer";
import { EventHandlerService } from "./event-handler.service";
import { DomainEvent } from "./event.types";

@Injectable()
export class EventRouterService {
  constructor(
    private readonly orders: OrderConsumer,
    private readonly payments: PaymentConsumer,
    private readonly users: UserConsumer,
    private readonly vendors: VendorConsumer,
    private readonly handler: EventHandlerService,
  ) {}

  route(event: DomainEvent) {
    const supported = [
      this.orders,
      this.payments,
      this.users,
      this.vendors,
    ].some((consumer) => consumer.supports(event.event));
    if (!supported) {
      throw new UnprocessableEntityException(
        `Unsupported event: ${event.event}`,
      );
    }
    return this.handler.handle(event);
  }
}
