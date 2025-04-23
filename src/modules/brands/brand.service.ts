import { BadRequestException, Injectable } from '@nestjs/common';
import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { CloudinaryService } from 'src/common';
import {
  BrandsDocument,
  BrandsRepoServices,
  CategoryDocument,
  UserDocument,
} from 'src/DB';

export interface UploadedImage {
  secure_url: string;
  public_id: string;
}

interface Dummy {
  name?: string;
  userId?: Types.ObjectId;
  logo?: UploadedImage;
  customCode?: string;
  category?: Types.ObjectId[];
  subCategory?: Types.ObjectId[];
}

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepo: BrandsRepoServices,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createBrand(
    body: Partial<CategoryDocument>,
    file: Express.Multer.File,
    user: UserDocument,
  ): Promise<object> {
    if (!user) throw new BadRequestException('Not logged in');
    const findBrand = await this.brandRepo.findOne({
      name: body['name'],
    });
    if (findBrand) throw new BadRequestException('Brand already exists');
    let dummy: Dummy = {
      name: body['name'] as string,
      userId: user._id,
      category: body['category'] as Types.ObjectId[],
      subCategory: body['subCategory'] as Types.ObjectId[],
    };
    const customCode = Math.random().toString(36).substring(2, 15);
    const result = await this.cloudinaryService.UploadImage(file, {
      folder: `E-Commerce/brands/${customCode}`,
    });
    dummy = {
      ...dummy,
      logo: {
        secure_url: result['secure_url'] as string,
        public_id: result['public_id'] as string,
      },
      customCode,
    };
    const category = await this.brandRepo.create(dummy);
    if (!category) throw new BadRequestException('Failed to create category');
    return { message: 'done', category };
  }

  async getBrand(id: Types.ObjectId): Promise<object> {
    const brand = await this.brandRepo.findById(id, [
      'category',
      'subCategory',
    ]);
    if (!brand) throw new BadRequestException('Brand not found');
    return { brand };
  }

  async updateBrand(
    id: Types.ObjectId,
    query?: UpdateQuery<BrandsDocument>,
    file?: Express.Multer.File,
  ): Promise<object> {
    const Brand = await this.brandRepo.findById(id);
    if (!Brand) throw new BadRequestException('Brand not found');
    if (query?.name) {
      const findBrand = await this.brandRepo.findOne({
        name: query?.name,
      });
      if (findBrand) throw new BadRequestException('Brand already exists');
    }
    let dummy: Dummy = {};
    if (file) {
      await this.cloudinaryService.DeleteImage(Brand?.logo?.public_id);
      const result = await this.cloudinaryService.UploadImage(file, {
        folder: `E-Commerce/brands/${Brand?.customCode}`,
      });
      dummy = {
        logo: {
          secure_url: result['secure_url'] as string,
          public_id: result['public_id'] as string,
        },
      };
    }
    await this.brandRepo.updateOne(id, { ...query, ...dummy });
    return { message: 'done' };
  }

  async deleteBrand(id: FilterQuery<CategoryDocument>): Promise<object> {
    const Brand = await this.brandRepo.findOneAndDelete(id);
    if (Brand?.logo)
      await this.cloudinaryService.DeleteImage(Brand?.logo?.public_id);
    if (!Brand) throw new BadRequestException('Brand not found');
    return { message: 'done' };
  }
}
