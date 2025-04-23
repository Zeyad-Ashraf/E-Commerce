import { Injectable } from '@nestjs/common';
import { Coupons, CouponsDocument } from '../index';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DbRepoServices } from './dbRepoServicess';

@Injectable()
export class CouponsRepoServices extends DbRepoServices<CouponsDocument> {
  constructor(
    @InjectModel(Coupons.name)
    private readonly couponsModel: Model<CouponsDocument>,
  ) {
    super(couponsModel);
  }
}
