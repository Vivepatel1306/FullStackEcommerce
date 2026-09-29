"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminVendorsController = void 0;
const common_1 = require("@nestjs/common");
const approve_vendor_dto_1 = require("../../admin/dto/approve-vendor.dto");
const reject_vendor_dto_1 = require("../../admin/dto/reject-vendor.dto");
const update_vendor_status_dto_1 = require("../dto/update-vendor-status.dto");
const admin_vendors_service_1 = require("../services/admin-vendors.service");
let AdminVendorsController = class AdminVendorsController {
    vendors;
    constructor(vendors) {
        this.vendors = vendors;
    }
    list(status) {
        return this.vendors.list(status);
    }
    get(id) {
        return this.vendors.get(id);
    }
    approve(id, input) {
        return this.vendors.approve(id, input);
    }
    reject(id, input) {
        return this.vendors.reject(id, input);
    }
    updateStatus(id, input) {
        return this.vendors.updateStatus(id, input);
    }
};
exports.AdminVendorsController = AdminVendorsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminVendorsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminVendorsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/approve"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_vendor_dto_1.ApproveVendorDto]),
    __metadata("design:returntype", void 0)
], AdminVendorsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(":id/reject"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reject_vendor_dto_1.RejectVendorDto]),
    __metadata("design:returntype", void 0)
], AdminVendorsController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vendor_status_dto_1.UpdateVendorStatusDto]),
    __metadata("design:returntype", void 0)
], AdminVendorsController.prototype, "updateStatus", null);
exports.AdminVendorsController = AdminVendorsController = __decorate([
    (0, common_1.Controller)("admin/vendors"),
    __metadata("design:paramtypes", [admin_vendors_service_1.AdminVendorsService])
], AdminVendorsController);
//# sourceMappingURL=admin-vendors.controller.js.map