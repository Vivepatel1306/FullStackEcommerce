import { DocumentStatus } from "../enums/document-status.enum";
export class VendorDocumentEntity {
  id!: string;
  vendorId!: string;
  documentType!: string;
  objectKey!: string;
  fileName!: string;
  status!: DocumentStatus;
  reviewedAt?: Date | null;
  createdAt!: Date;
}
