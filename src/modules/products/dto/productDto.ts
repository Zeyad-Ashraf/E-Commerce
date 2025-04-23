import { Query } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  price: number;

  @IsString()
  discount: number;

  @IsString()
  quantity: number;

  @IsString()
  stock: number;

  @IsMongoId()
  brand: Types.ObjectId;

  @IsMongoId()
  category: Types.ObjectId;

  @IsMongoId()
  subCategory: Types.ObjectId;
}

export class ProductFilter {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  select: string;

  @IsOptional()
  @IsString()
  sort: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  page: number;
}
