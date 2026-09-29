export declare enum VendorStatus {
    PENDING = "PENDING",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SUSPENDED = "SUSPENDED"
}
export declare class UpdateVendorStatusDto {
    status: VendorStatus;
}
