import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from '../index';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  PopulateOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { DbRepoServices } from './dbRepoServicess';

interface findOptions {
  fileFilter?: FilterQuery<ProductDocument>;
  populate?: PopulateOptions[];
  sort?: string;
  select?: string;
  page?: number;
}

@Injectable()
export class ProductRepoServices extends DbRepoServices<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  async findAll({
    fileFilter = {},
    page = 1,
    sort = '',
  }: findOptions): Promise<ProductDocument[]> {
    const query = this.productModel
      .find(fileFilter)
      .select('name description coverImage price discount subPrice stock');
    if (sort) query.sort(sort.replaceAll(',', ' '));
    if (page) query.skip((page - 1) * 5).limit(5);
    return await query.exec();
  }

  async updateOne(
    id: FilterQuery<ProductDocument>,
    data: UpdateQuery<ProductDocument>,
  ): Promise<UpdateWriteOpResult> {
    return await this.productModel.updateOne(id, data).exec();
  }
}
