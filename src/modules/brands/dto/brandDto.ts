import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class BrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(
    ({ value }) => (Array.isArray(value) ? value : [value]) as string[],
  )
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  category: Types.ObjectId[];

  @Transform(
    ({ value }) => (Array.isArray(value) ? value : [value]) as string[],
  )
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  subCategory: Types.ObjectId[];
}
