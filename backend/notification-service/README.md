# Notification Service

NestJS service for consuming domain events, persisting notification history and preferences, and delivering email, SMS, and push notifications through AWS.

## Run locally

```bash
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Set `DATABASE_URL` and `DIRECT_URL` to a PostgreSQL database. Configure AWS credentials using the standard AWS SDK credential chain and set `AWS_REGION`. Set `SQS_NOTIFICATION_QUEUE_URL` to a queue subscribed to the domain events; leave it blank to run only the HTTP API. Configure `EMAIL_FROM` for SES email delivery. SMS uses SNS phone destinations; push expects an SNS platform endpoint ARN.

## API

- `GET /health` reports service health.
- `POST /notifications` sends a notification. Body fields: `eventId`, `type`, `recipient`, optional `userId`, `subject`, `body`, and `channels` (`EMAIL`, `SMS`, `PUSH`).
- `GET /notifications?userId=...` returns a user's delivery history.
- `GET /notifications/preferences/:userId` reads channel preferences.
- `PUT /notifications/preferences/:userId` replaces preference flags.

The HTTP routes are intended for trusted internal callers and must be protected by the API gateway or service authentication before external exposure. SQS event bodies must include `event` (or `type`) and at least one destination field: `recipientEmail`/`email`, `phone`/`phoneNumber`, or `pushEndpointArn`. Include `eventId` for producer-level idempotency and `userId` (or `customerId`/`ownerId`) to apply saved preferences. Events without destinations fail processing so the queue's redrive policy can retain them for inspection instead of silently dropping them.

An event is considered idempotent per `eventId`, recipient, and channel. Event records are acknowledged from SQS only after handling succeeds. Failures remain on the source queue with exponential visibility backoff; configure an SQS redrive policy with a dead-letter queue and `maxReceiveCount` in AWS. This keeps retry limits and DLQ retention in queue infrastructure rather than duplicating them in application code.

The Compose mapping is host port `4002` to container port `3003`. Create a local `.env` from `.env.example` before starting the service with Compose.
