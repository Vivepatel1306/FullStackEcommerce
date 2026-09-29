# Admin Service

The admin service exposes administrative operations and delegates vendor data changes to `vendor-service`.

## Configuration

```env
PORT=3002
VENDOR_SERVICE_URL=http://localhost:3001
```

JWT authentication and admin-role authorization belong at the API gateway in front of this service. The service should not be exposed directly to the public network.

## Vendor endpoints

| Method  | Path                            | Purpose                                       |
| ------- | ------------------------------- | --------------------------------------------- |
| `GET`   | `/admin/vendors?status=PENDING` | List vendors, optionally filtered by status   |
| `GET`   | `/admin/vendors/:id`            | View a vendor and its documents               |
| `POST`  | `/admin/vendors/:id/approve`    | Approve a vendor                              |
| `POST`  | `/admin/vendors/:id/reject`     | Reject a vendor with `{ "reason": "..." }`    |
| `PATCH` | `/admin/vendors/:id/status`     | Set a status with `{ "status": "SUSPENDED" }` |

Status changes are sent through `vendor-service`'s review endpoint, so its cache and `vendor.status.changed` event remain authoritative.
