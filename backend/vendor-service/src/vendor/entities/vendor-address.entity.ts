export class VendorAddressEntity {
  id!: string;
  vendorId!: string;
  line1!: string;
  line2?: string | null;
  city!: string;
  state!: string;
  postalCode!: string;
  country!: string;
}
