import { Injectable } from '@nestjs/common';
import { Orders, OrdersDocument } from '../index';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { DbRepoServices } from './dbRepoServicess';

@Injectable()
export class OrdersRepoServices extends DbRepoServices<OrdersDocument> {
  constructor(
    @InjectModel(Orders.name)
    private readonly ordersModel: Model<OrdersDocument>,
  ) {
    super(ordersModel);
  }

  async createNewOrders(
    query: FilterQuery<OrdersDocument>,
  ): Promise<OrdersDocument> {
    return await this.create(query);
  }
}
