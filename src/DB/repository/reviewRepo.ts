import { Injectable } from '@nestjs/common';
import { Review, ReviewDocument } from '../index';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { DbRepoServices } from './dbRepoServicess';

@Injectable()
export class ReviewRepoServices extends DbRepoServices<ReviewDocument> {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {
    super(reviewModel);
  }

  async createNewReview(
    query: FilterQuery<ReviewDocument>,
  ): Promise<ReviewDocument> {
    return await this.create(query);
  }
}
