import { Injectable } from '@nestjs/common';
import { Coupons, CouponsDocument } from '../index';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { DbRepoServices } from './dbRepoServicess';

@Injectable()
export class CouponsRepoServices extends DbRepoServices<CouponsDocument> {
  constructor(
    @InjectModel(Coupons.name)
    private readonly couponsModel: Model<CouponsDocument>,
  ) {
    super(couponsModel);
  }

  async findAll(
    filter: FilterQuery<CouponsDocument>,
  ): Promise<CouponsDocument[]> {
    return await this.couponsModel.find(filter).exec();
  }
}
