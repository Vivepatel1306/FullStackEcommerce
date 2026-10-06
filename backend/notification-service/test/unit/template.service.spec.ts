jest.mock("@nestjs/common", () => ({
  Injectable: () => (target: Function) => target,
}));

import { NotificationChannel } from "../../generated/prisma/enums";
import { TemplateService } from "../../src/notifications/services/template.service";

describe("TemplateService", () => {
  const templates = new TemplateService();

  it("renders order confirmation email copy", () => {
    expect(
      templates.render(
        "order.confirmed",
        { orderId: "order-123" },
        NotificationChannel.EMAIL,
      ),
    ).toEqual({
      subject: "Order order-123 confirmed",
      body: "Your order order-123 has been confirmed.",
    });
  });

  it("renders concise order confirmation SMS copy", () => {
    expect(
      templates.render(
        "order.confirmed",
        { orderId: "order-123" },
        NotificationChannel.SMS,
      ).body,
    ).toBe("Order order-123 is confirmed.");
  });

  it("renders order shipment push copy", () => {
    expect(
      templates.render(
        "order.shipped",
        { orderId: "order-123" },
        NotificationChannel.PUSH,
      ),
    ).toEqual({
      subject: "Order shipped",
      body: "Order order-123 has shipped.",
    });
  });
});
