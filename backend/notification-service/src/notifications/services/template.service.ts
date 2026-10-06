import { Injectable } from "@nestjs/common";
import { NotificationChannel } from "../../../generated/prisma/enums";
import { orderConfirmedEmail } from "../../templates/email/order-confirmed.template";
import { passwordResetEmail } from "../../templates/email/password-reset.template";
import { paymentSuccessEmail } from "../../templates/email/payment-success.template";
import { orderConfirmedPush } from "../../templates/push/order-confirmed.template";
import { orderShippedPush } from "../../templates/push/order-shipped.template";
import { orderConfirmedSms } from "../../templates/sms/order-confirmed.template";
import { otpSms } from "../../templates/sms/otp.template";

export interface RenderedTemplate {
  subject: string;
  body: string;
}

@Injectable()
export class TemplateService {
  render(
    type: string,
    data: Record<string, unknown>,
    channel: NotificationChannel,
  ): RenderedTemplate {
    const orderId = String(data.orderId ?? "your order");
    const status = String(data.status ?? "");

    switch (type) {
      case "order.confirmed":
      case "order.created":
        if (channel === NotificationChannel.SMS) {
          return {
            subject: "Order confirmed",
            body: orderConfirmedSms(orderId),
          };
        }
        if (channel === NotificationChannel.PUSH) {
          return orderConfirmedPush(orderId);
        }
        return orderConfirmedEmail(orderId);
      case "order.shipped":
        if (channel === NotificationChannel.PUSH)
          return orderShippedPush(orderId);
        return {
          subject: `Order ${orderId} shipped`,
          body: `Your order ${orderId} has shipped.`,
        };
      case "payment.succeeded":
        return paymentSuccessEmail(orderId);
      case "user.password.reset":
      case "auth.password.reset":
        return passwordResetEmail();
      case "user.otp.sent":
      case "auth.otp.sent":
        return {
          subject: "Verification code",
          body: otpSms(String(data.code ?? "")),
        };
      default:
        return {
          subject: type.replaceAll(".", " "),
          body: `${type.replaceAll(".", " ")}${status ? `: ${status}` : ""}`,
        };
    }
  }
}
