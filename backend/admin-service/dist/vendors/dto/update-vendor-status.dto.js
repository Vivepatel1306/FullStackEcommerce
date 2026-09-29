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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVendorStatusDto = exports.VendorStatus = void 0;
const class_validator_1 = require("class-validator");
var VendorStatus;
(function (VendorStatus) {
    VendorStatus["PENDING"] = "PENDING";
    VendorStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    VendorStatus["APPROVED"] = "APPROVED";
    VendorStatus["REJECTED"] = "REJECTED";
    VendorStatus["SUSPENDED"] = "SUSPENDED";
})(VendorStatus || (exports.VendorStatus = VendorStatus = {}));
class UpdateVendorStatusDto {
    status;
}
exports.UpdateVendorStatusDto = UpdateVendorStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(VendorStatus),
    __metadata("design:type", String)
], UpdateVendorStatusDto.prototype, "status", void 0);
//# sourceMappingURL=update-vendor-status.dto.js.map