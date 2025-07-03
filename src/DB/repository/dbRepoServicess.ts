import {
  FilterQuery,
  Model,
  PopulateOptions,
  Types,
  UpdateQuery,
} from 'mongoose';

export abstract class DbRepoServices<TDocument> {
  constructor(private readonly model: Model<TDocument>) {}

  async create(data: Partial<TDocument>): Promise<TDocument> {
    return await this.model.create(data);
  }

  async findOne(
    query: FilterQuery<TDocument>,
    populate?: PopulateOptions[] | PopulateOptions,
  ): Promise<TDocument | null> {
    return await this.model
      .findOne(query)
      .populate(populate || [])
      .exec();
  }

  async find(
    query: FilterQuery<TDocument>,
    populate?: PopulateOptions[] | PopulateOptions,
  ): Promise<TDocument[] | null> {
    return await this.model
      .find(query)
      .populate(populate || [])
      .exec();
  }

  async findById(
    data: Types.ObjectId,
    populate?: string[] | string | PopulateOptions | PopulateOptions[],
  ): Promise<TDocument | null> {
    if (populate)
      if (
        Array.isArray(populate) &&
        populate.every((item) => typeof item === 'object')
      ) {
        return await this.model.findById(data).populate(populate).exec();
      }
    return await this.model
      .findById(data)
      .populate(populate as string | string[])
      .exec();
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
