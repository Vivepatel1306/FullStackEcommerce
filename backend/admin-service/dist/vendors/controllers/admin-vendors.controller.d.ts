import { ApproveVendorDto } from "../../admin/dto/approve-vendor.dto";
import { RejectVendorDto } from "../../admin/dto/reject-vendor.dto";
import { UpdateVendorStatusDto } from "../dto/update-vendor-status.dto";
import { AdminVendorsService } from "../services/admin-vendors.service";
export declare class AdminVendorsController {
    private readonly vendors;
    constructor(vendors: AdminVendorsService);
    list(status?: string): Promise<unknown>;
    get(id: string): Promise<unknown>;
    approve(id: string, input: ApproveVendorDto): Promise<unknown>;
    reject(id: string, input: RejectVendorDto): Promise<unknown>;
    updateStatus(id: string, input: UpdateVendorStatusDto): Promise<unknown>;
}
