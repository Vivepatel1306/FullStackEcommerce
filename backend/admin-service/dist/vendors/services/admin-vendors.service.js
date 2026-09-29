"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminVendorsService = void 0;
const common_1 = require("@nestjs/common");
let AdminVendorsService = class AdminVendorsService {
    vendorServiceUrl = process.env.VENDOR_SERVICE_URL ?? "http://localhost:3001";
    list(status) {
        const url = new URL("/vendors", this.vendorServiceUrl);
        if (status)
            url.searchParams.set("status", status);
        return this.request(url);
    }
    get(id) {
        return this.request(new URL(`/vendors/${id}`, this.vendorServiceUrl));
    }
    approve(id, input) {
        return this.review(id, { status: "APPROVED", ...input });
    }
    reject(id, input) {
        return this.review(id, {
            status: "REJECTED",
            rejectionReason: input.reason,
        });
    }
    updateStatus(id, input) {
        return this.review(id, { status: input.status });
    }
    review(id, body) {
        return this.request(new URL(`/vendors/${id}/review`, this.vendorServiceUrl), {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "content-type": "application/json" },
        });
    }
    async request(url, init) {
        let response;
        try {
            response = await fetch(url, init);
        }
        catch {
            throw new common_1.BadGatewayException("Vendor service is unavailable");
        }
        const payload = await response.json().catch(() => undefined);
        if (!response.ok) {
            throw new common_1.BadGatewayException({
                message: "Vendor service request failed",
                statusCode: response.status,
                details: payload,
            });
        }
        return payload;
    }
};
exports.AdminVendorsService = AdminVendorsService;
exports.AdminVendorsService = AdminVendorsService = __decorate([
    (0, common_1.Injectable)()
], AdminVendorsService);
//# sourceMappingURL=admin-vendors.service.js.map