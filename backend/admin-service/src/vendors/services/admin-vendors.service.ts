import { BadGatewayException, Injectable } from "@nestjs/common";
import { ApproveVendorDto } from "../../admin/dto/approve-vendor.dto";
import { RejectVendorDto } from "../../admin/dto/reject-vendor.dto";
import { UpdateVendorStatusDto } from "../dto/update-vendor-status.dto";

@Injectable()
export class AdminVendorsService {
  private readonly vendorServiceUrl =
    process.env.VENDOR_SERVICE_URL ?? "http://localhost:3001";

  list(status?: string) {
    const url = new URL("/vendors", this.vendorServiceUrl);
    if (status) url.searchParams.set("status", status);
    return this.request(url);
  }

  get(id: string) {
    return this.request(new URL(`/vendors/${id}`, this.vendorServiceUrl));
  }

  approve(id: string, input: ApproveVendorDto) {
    return this.review(id, { status: "APPROVED", ...input });
  }

  reject(id: string, input: RejectVendorDto) {
    return this.review(id, {
      status: "REJECTED",
      rejectionReason: input.reason,
    });
  }

  updateStatus(id: string, input: UpdateVendorStatusDto) {
    return this.review(id, { status: input.status });
  }

  private review(id: string, body: Record<string, string>) {
    return this.request(
      new URL(`/vendors/${id}/review`, this.vendorServiceUrl),
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
      },
    );
  }

  private async request(url: URL, init?: RequestInit) {
    let response: Response;
    try {
      response = await fetch(url, init);
    } catch {
      throw new BadGatewayException("Vendor service is unavailable");
    }

    const payload: unknown = await response.json().catch(() => undefined);
    if (!response.ok) {
      throw new BadGatewayException({
        message: "Vendor service request failed",
        statusCode: response.status,
        details: payload,
      });
    }
    return payload;
  }
}
