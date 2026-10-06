import { VendorStatus } from "../enums/vendor-status.enum";
import { VendorAddressEntity } from "./vendor-address.entity";
import { VendorDocumentEntity } from "./vendor-document.entity";
export class VendorEntity {
  id!: string;
  ownerId!: string;
  businessName!: string;
  legalName!: string;
  email!: string;
  phone?: string | null;
  status!: VendorStatus;
  rejectionReason?: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  address?: VendorAddressEntity | null;
  documents!: VendorDocumentEntity[];
}
