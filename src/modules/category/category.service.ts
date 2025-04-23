import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { CloudinaryService } from 'src/common';
import { CategoryDocument, CategoryRepoServices, UserDocument } from 'src/DB';

export interface UploadedImage {
  secure_url: string;
  public_id: string;
}

interface Dummy {
  name?: string | undefined;
  addedBy?: Types.ObjectId;
  image?: UploadedImage | undefined;
  customCode?: string | undefined;
}

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepoServices,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createCategory(
    body: Partial<CategoryDocument>,
    file: Express.Multer.File,
    user: UserDocument,
  ): Promise<object> {
    if (!user) throw new BadRequestException('Not logged in');
    const findCategory = await this.categoryRepo.findOne({
      name: body['name'],
    });
    if (findCategory) throw new BadRequestException('Category already exists');
    let dummy: Dummy = {
      name: body.name,
      addedBy: user._id,
    };
    if (file) {
      const customCode = Math.random().toString(36).substring(2, 15);
      const result = await this.cloudinaryService.UploadImage(file, {
        folder: `E-Commerce/categories/${customCode}`,
      });
      dummy = {
        ...dummy,
        image: {
          secure_url: result['secure_url'] as string,
          public_id: result['public_id'] as string,
        },
        customCode,
      };
    }

    const category = await this.categoryRepo.create(dummy);
    if (!category) throw new BadRequestException('Failed to create category');
    return { message: 'done', category };
  }

  async getCategory(id: Types.ObjectId): Promise<object> {
    const category = await this.categoryRepo.findById(id);
    if (!category) throw new BadRequestException('Category not found');
    return { category };
  }

  async UpdateCategory(
    id: Types.ObjectId,
    query?: UpdateQuery<CategoryDocument>,
    file?: Express.Multer.File,
  ): Promise<object> {
    let dummy: Dummy = {};
    const category = await this.categoryRepo.findById(id);
    if (!category) throw new BadRequestException('Category not found');
    if (query?.name) {
      const findCategory = await this.categoryRepo.findOne({
        name: query?.name,
      });
      if (findCategory)
        throw new BadRequestException('Category already exists');
      dummy = {
        ...dummy,
        name: query?.name as string,
      };
    }
    if (file) {
      await this.cloudinaryService.DeleteImage(category?.image?.public_id);
      const result = await this.cloudinaryService.UploadImage(file, {
        folder: `E-Commerce/categories/${category?.customCode}`,
      });
      dummy = {
        ...dummy,
        image: {
          secure_url: result['secure_url'] as string,
          public_id: result['public_id'] as string,
        },
      };
    }
    await this.categoryRepo.updateOne(id, dummy);
    return { message: 'done' };
  }

  async deleteCategory(id: FilterQuery<CategoryDocument>): Promise<object> {
    const category = await this.categoryRepo.findOneAndDelete(id);
    if (category?.image)
      await this.cloudinaryService.DeleteImage(category?.image?.public_id);
    if (!category) throw new BadRequestException('Category not found');
    return { message: 'done' };
  }
}
