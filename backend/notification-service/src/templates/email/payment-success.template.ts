export function paymentSuccessEmail(orderId: string) {
  return {
    subject: "Payment received",
    body: `Payment for order ${orderId} was successful.`,
  };
}
