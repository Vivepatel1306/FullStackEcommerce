declare module "class-validator" {
  type ValidationOptions = Record<string, any>;

  export function IsString(
    validationOptions?: ValidationOptions,
  ): (target: any, key: string) => void;
  export function IsEmail(
    validationOptions?: ValidationOptions,
  ): (target: any, key: string) => void;
  export function IsOptional(
    validationOptions?: ValidationOptions,
  ): (target: any, key: string) => void;
  export function ValidateNested(
    validationOptions?: ValidationOptions,
  ): (target: any, key: string) => void;
  export function IsEnum(
    enumType: object,
    validationOptions?: ValidationOptions,
  ): (target: any, key: string) => void;
}
