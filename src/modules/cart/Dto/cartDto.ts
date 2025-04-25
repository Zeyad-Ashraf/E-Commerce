import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CartDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
export class RemoveCartDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;
}
export class UpdateCartDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
