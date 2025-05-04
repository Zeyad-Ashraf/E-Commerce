import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { EnumPaymentMethods } from 'src/common';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  cart: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: EnumPaymentMethods;
}
