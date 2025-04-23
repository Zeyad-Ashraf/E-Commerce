import { Injectable } from '@nestjs/common';
import { Cart, CartDocument } from '../index';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { DbRepoServices } from './dbRepoServicess';

@Injectable()
export class CartRepoServices extends DbRepoServices<CartDocument> {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
  ) {
    super(cartModel);
  }

  async createNewCart(query: FilterQuery<CartDocument>): Promise<CartDocument> {
    return await this.create(query);
  }
}
