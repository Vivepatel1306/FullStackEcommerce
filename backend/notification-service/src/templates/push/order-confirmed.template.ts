export function orderConfirmedPush(orderId: string) {
  return {
    subject: "Order confirmed",
    body: `Order ${orderId} has been confirmed.`,
  };
}
