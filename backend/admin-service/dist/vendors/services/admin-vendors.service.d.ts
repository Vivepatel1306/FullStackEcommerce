import { ApproveVendorDto } from "../../admin/dto/approve-vendor.dto";
import { RejectVendorDto } from "../../admin/dto/reject-vendor.dto";
import { UpdateVendorStatusDto } from "../dto/update-vendor-status.dto";
export declare class AdminVendorsService {
    private readonly vendorServiceUrl;
    list(status?: string): Promise<unknown>;
    get(id: string): Promise<unknown>;
    approve(id: string, input: ApproveVendorDto): Promise<unknown>;
    reject(id: string, input: RejectVendorDto): Promise<unknown>;
    updateStatus(id: string, input: UpdateVendorStatusDto): Promise<unknown>;
    private review;
    private request;
}
