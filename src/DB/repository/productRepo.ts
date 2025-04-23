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
    populate = [],
    page = 1,
    sort = '',
    select = '',
  }: findOptions): Promise<ProductDocument[]> {
    const query = this.productModel.find(fileFilter);
    if (populate.length > 0) query.populate(populate);
    if (sort) query.sort(sort.replaceAll(',', ' '));
    if (select) query.select(select.replaceAll(',', ' '));
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
