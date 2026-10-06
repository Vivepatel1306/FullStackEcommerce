export function orderShippedPush(orderId: string) {
  return {
    subject: "Order shipped",
    body: `Order ${orderId} has shipped.`,
  };
}
