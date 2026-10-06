export const VENDOR_EVENTS = {
  CREATED: "vendor.created",
  STATUS_CHANGED: "vendor.status.changed",
} as const;

export interface VendorEvent {
  event: string;
  vendorId: string;
  ownerId: string;
  status: string;
  occurredAt: string;
}
