# Vendor Service

NestJS vendor bounded context for onboarding and reviewing ecommerce vendors.

## Run locally

```bash
npm install
copy .env.example .env
npx prisma generate
npm run start:dev
```

The REST API listens on `PORT` (default `3001`). Vendor records use PostgreSQL; Redis, S3, and SQS are optional until their environment variables are configured.

## Endpoints

- `POST /vendors` creates a vendor in `PENDING` status.
- `GET /vendors/:id` reads a vendor, using Redis when configured.
- `PATCH /vendors/:id` updates vendor profile fields.
- `POST /vendors/:id/review` changes review status and publishes an event to SQS.
- `POST /vendors/:id/documents` registers an uploaded S3 object key.
