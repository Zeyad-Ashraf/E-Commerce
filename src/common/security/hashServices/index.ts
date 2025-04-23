import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashingServices {
  private static instance: HashingServices;
  constructor() {}

  static getInstance(): HashingServices {
    if (!HashingServices.instance) {
      HashingServices.instance = new HashingServices();
    }
    return HashingServices.instance;
  }

  async Hashing(key: string): Promise<string> {
    return await bcrypt.hash(key, Number(process.env.SALT_ROUNDS));
  }

  async Comparing(key: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(key, hashed);
  }
}
