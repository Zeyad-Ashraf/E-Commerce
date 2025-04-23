import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class DbRepoServices<TDocument> {
  constructor(private readonly model: Model<TDocument>) {}

  async create(data: Partial<TDocument>): Promise<TDocument> {
    return await this.model.create(data);
  }

  async findOne(
    query: FilterQuery<TDocument>,
    populate?: string[] | string,
  ): Promise<TDocument | null> {
    const queryBuilder = this.model.findOne(query);
    if (populate) return await queryBuilder.populate(populate);
    else return await queryBuilder.exec();
  }

  async findById(
    data: Types.ObjectId,
    populate?: string[] | string,
  ): Promise<TDocument | null> {
    if (populate)
      return await this.model.findById(data).populate(populate).exec();
    return this.model.findById(data).exec();
  }

  async findOneAndUpdate(
    query: FilterQuery<TDocument>,
    data: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findOneAndUpdate(query, data, { new: true }).exec();
  }

  async findOneAndDelete(
    query: FilterQuery<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findByIdAndDelete(query).exec();
  }
}
