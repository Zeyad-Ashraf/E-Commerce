import { Injectable } from '@nestjs/common';
import { UserDocument, User } from '../index';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { DbRepoServices } from './dbRepoServicess';

@Injectable()
export class AuthRepoServices extends DbRepoServices<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.findOne({ email });
  }

  async findUserById(id: Types.ObjectId): Promise<UserDocument | null> {
    return await this.findById(id);
  }

  async createNewUser(query: FilterQuery<UserDocument>): Promise<UserDocument> {
    return await this.create(query);
  }
}
