import { Injectable } from '@nestjs/common';
import { Category, CategoryDocument } from '../index';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { DbRepoServices } from './dbRepoServicess';

@Injectable()
export class CategoryRepoServices extends DbRepoServices<CategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel);
  }

  async updateOne(
    id: Types.ObjectId,
    data: UpdateQuery<CategoryDocument>,
  ): Promise<void> {
    await this.categoryModel.updateOne({ _id: id }, data);
  }
}
