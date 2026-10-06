export const notificationConfig = {
  port: Number(process.env.PORT ?? 3003),
  queueUrl: process.env.SQS_NOTIFICATION_QUEUE_URL,
};
