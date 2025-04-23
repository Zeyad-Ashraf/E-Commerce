import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionServices {
  private static instance: EncryptionServices;
  constructor() {}

  static getInstance(): EncryptionServices {
    if (!EncryptionServices.instance) {
      EncryptionServices.instance = new EncryptionServices();
    }
    return EncryptionServices.instance;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async Encryption(key: string): Promise<string> {
    return CryptoJS.AES.encrypt(
      key,
      process.env.ENCRYPTION_KEY as string,
    ).toString();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async Decryption(key: string): Promise<string> {
    return CryptoJS.AES.decrypt(
      key,
      process.env.ENCRYPTION_KEY as string,
    ).toString(CryptoJS.enc.Utf8);
  }
}
