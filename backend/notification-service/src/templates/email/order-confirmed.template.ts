export function orderConfirmedEmail(orderId: string) {
  return {
    subject: `Order ${orderId} confirmed`,
    body: `Your order ${orderId} has been confirmed.`,
  };
}
