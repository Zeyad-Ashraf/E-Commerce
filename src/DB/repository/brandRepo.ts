import { Injectable } from '@nestjs/common';
import { Brands, BrandsDocument } from '../index';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { DbRepoServices } from './dbRepoServicess';

@Injectable()
export class BrandsRepoServices extends DbRepoServices<BrandsDocument> {
  constructor(
    @InjectModel(Brands.name)
    private readonly brandsModel: Model<BrandsDocument>,
  ) {
    super(brandsModel);
  }

  async updateOne(
    id: Types.ObjectId,
    data: UpdateQuery<BrandsDocument>,
  ): Promise<void> {
    await this.brandsModel.updateOne({ _id: id }, data);
  }
}
