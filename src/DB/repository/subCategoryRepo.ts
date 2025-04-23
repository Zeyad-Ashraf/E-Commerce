import { Injectable } from '@nestjs/common';
import { SubCategory, SubCategoryDocument } from '../index';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { DbRepoServices } from './dbRepoServicess';

@Injectable()
export class SubCategoryRepoServices extends DbRepoServices<SubCategoryDocument> {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategoryDocument>,
  ) {
    super(subCategoryModel);
  }

  async updateOne(id: Types.ObjectId, data: UpdateQuery<SubCategoryDocument>) {
    return await this.subCategoryModel.updateOne({ _id: id }, data);
  }
}
