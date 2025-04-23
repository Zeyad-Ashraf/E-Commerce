import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { CloudinaryService } from 'src/common';
import {
  CategoryDocument,
  CategoryRepoServices,
  SubCategoryDocument,
  SubCategoryRepoServices,
  UserDocument,
} from 'src/DB';

@Injectable()
export class SubCategoryService {
  constructor(
    private readonly subCategoryRepo: SubCategoryRepoServices,
    private readonly categoryRepo: CategoryRepoServices,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createSubCategory(
    body: Partial<SubCategoryDocument>,
    user: UserDocument,
    file: Express.Multer.File,
  ): Promise<object> {
    const { name, categoryId } = body;
    if (!name || !categoryId) throw new BadRequestException('Invalid data');
    const findCategory = await this.categoryRepo.findById(categoryId);
    if (!findCategory) throw new BadRequestException('Category not found');
    const findSubCategory = await this.subCategoryRepo.findOne({ name });
    if (findSubCategory)
      throw new ConflictException('SubCategory already exists');
    let dummy: Partial<SubCategoryDocument> = {
      name,
      categoryId: new Types.ObjectId(categoryId),
      userId: user._id,
    };
    if (file) {
      const customCode = Math.random().toString(36).substring(2, 15);
      const result = await this.cloudinaryService.UploadImage(file, {
        folder: `E-Commerce/subCategories/${customCode}`,
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
    const subCategoryData = await this.subCategoryRepo.create(dummy);
    if (!subCategoryData)
      throw new BadRequestException('Failed to create subCategory');

    return {
      message: 'done',
      subCategory: subCategoryData,
    };
  }
  async getSubCategory(id: Types.ObjectId): Promise<object> {
    const category = await this.subCategoryRepo.findById(id);
    if (!category) throw new BadRequestException('Category not found');
    return { category };
  }

  async UpdateCategory(
    id: Types.ObjectId,
    query?: UpdateQuery<SubCategoryDocument>,
    file?: Express.Multer.File,
  ): Promise<object> {
    let dummy: Partial<SubCategoryDocument> = {
      categoryId: query?.categoryId as Types.ObjectId,
    };
    const subCategory = await this.subCategoryRepo.findById(id);
    if (!subCategory) throw new BadRequestException('Category not found');
    if (query?.name) {
      const findCategory = await this.subCategoryRepo.findOne({
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
      await this.cloudinaryService.DeleteImage(subCategory?.image?.public_id);
      const result = await this.cloudinaryService.UploadImage(file, {
        folder: `E-Commerce/subCategories/${subCategory?.customCode}`,
      });
      dummy = {
        ...dummy,
        image: {
          secure_url: result['secure_url'] as string,
          public_id: result['public_id'] as string,
        },
      };
    }
    await this.subCategoryRepo.updateOne(id, dummy);
    return { message: 'done' };
  }

  async deleteCategory(id: FilterQuery<CategoryDocument>): Promise<object> {
    const category = await this.subCategoryRepo.findOneAndDelete(id);
    if (!category) throw new BadRequestException('Category not found');
    if (category?.image)
      await this.cloudinaryService.DeleteImage(category?.image?.public_id);
    if (!category) throw new BadRequestException('Category not found');
    return { message: 'done' };
  }
}
