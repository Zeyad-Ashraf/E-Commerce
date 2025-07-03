import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class OpenDto {
  @IsNotEmpty()
  @IsMongoId()
  subCategory: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @Min(1)
  price: number;
}
