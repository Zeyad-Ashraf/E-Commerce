import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { CloudinaryService } from 'src/common';
import {
  ProductDocument,
  ProductRepoServices,
  UserDocument,
  BrandsRepoServices,
  SubCategoryRepoServices,
} from 'src/DB';
import { ProductFilter } from './dto/productDto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export interface UploadedImage {
  secure_url: string;
  public_id: string;
}

interface Dummy {
  name?: string;
  description?: string;
  coverImage?: UploadedImage;
  Images?: UploadedImage[];
  price?: number;
  discount?: number;
  subPrice?: number;
  quantity?: number;
  stock?: number;
  customCode?: string;
  brand?: Types.ObjectId;
  category?: Types.ObjectId;
  subCategory?: Types.ObjectId;
  userId?: Types.ObjectId;
}

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepoServices,
    private readonly subCategoryRepo: SubCategoryRepoServices,
    private readonly brandRepo: BrandsRepoServices,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createProduct(
    body: Partial<ProductDocument>,
    files: { Images: Express.Multer.File[]; coverImage: Express.Multer.File },
    user: UserDocument,
  ): Promise<object> {
    const { price, discount } = body;
    const findBrand = await this.brandRepo.findOne({
      _id: body['brand'],
    });
    if (!findBrand) throw new BadRequestException('Brand not found');

    const findCategory = await this.subCategoryRepo.findOne(
      {
        _id: body['subCategory'],
      },
      [{ path: 'categoryId' }],
    );
    if (!findCategory || !findCategory.categoryId)
      throw new BadRequestException(
        'Category not found or subCategory not found',
      );
    const subPrice =
      (price as number) - (price as number) * ((discount || 0) / 100);
    const customCode = Math.random().toString(36).substring(2, 15);
    let dummy: Dummy = {
      name: body['name'] as string,
      description: body['description'] as string,
      price: body['price'] as number,
      discount: body['discount'] as number,
      quantity: body['quantity'] as number,
      stock: body['stock'] as number,
      userId: user._id,
      brand: new Types.ObjectId(body['brand']),
      category: new Types.ObjectId(body['category']),
      subCategory: new Types.ObjectId(body['subCategory']),
      customCode,
      subPrice,
    };
    const result = await this.cloudinaryService.UploadFiles(files.Images, {
      folder: `E-Commerce/Products/${customCode}/Images`,
    });
    const coverImages = await this.cloudinaryService.UploadImage(
      files.coverImage[0],
      {
        folder: `E-Commerce/Products/${customCode}/coverImage`,
      },
    );
    dummy = {
      ...dummy,
      Images: [...result],
      coverImage: {
        secure_url: coverImages['secure_url'] as string,
        public_id: coverImages['public_id'] as string,
      },
    };
    for (let i = 0; i < 10; i++) {
      const product = await this.productRepo.create(dummy);
      if (!product) throw new BadRequestException('Failed to create category');
    }
    return { message: 'done' };
  }

  async getProduct(id: Types.ObjectId): Promise<object> {
    const product = await this.productRepo.findById(id, [
      'category',
      'subCategory',
      'brand',
    ]);
    if (!product) throw new BadRequestException('Brand not found');
    return { product };
  }

  async getProducts(query: ProductFilter): Promise<object> {
    const { name, sort, page } = query;
    let fileFilter: FilterQuery<ProductDocument> = {};
    if (name) {
      fileFilter = {
        $or: [
          { name: { $regex: name, $options: 'i' } },
          { slug: { $regex: name, $options: 'i' } },
        ],
      };
    }
    const products = await this.cacheManager.get('products');
    if (products) return { products };
    const product = await this.productRepo.findAll({
      fileFilter,
      sort,
      page,
    });
    if (!product) throw new BadRequestException('Brand not found');
    await this.cacheManager.set('products', product, 2000);
    return { product };
  }
  async updateProduct(
    id: Types.ObjectId,
    query?: UpdateQuery<ProductDocument>,
    files?: {
      Images?: Express.Multer.File[];
      coverImage?: Express.Multer.File;
    },
  ): Promise<object> {
    const product = await this.productRepo.findById(id, [
      'brand',
      'category',
      'subCategory',
    ]);
    if (!product) throw new BadRequestException('Brand not found');
    if (query?.category && query?.subCategory) {
      const findCategory = await this.subCategoryRepo.findOne(
        {
          _id: query['subCategory'],
        },
        [{ path: 'categoryId' }],
      );
      if (!findCategory || !findCategory.categoryId)
        throw new BadRequestException(
          'Category not found or subCategory not found',
        );
    }
    if (query?.brand) {
      const findBrand = await this.brandRepo.findOne({
        _id: query['brand'],
      });
      if (!findBrand) throw new BadRequestException('Brand not found');
    }
    if (query?.category) {
      if (product.subCategory?.['categoryId'] !== query['category'])
        throw new BadRequestException(
          `You Must select the same category as the subCategory's category or Change both of them`,
        );
    }
    if (query?.subCategory) {
      if (product.category?.['_id'] !== query['subCategory'])
        throw new BadRequestException(
          `You Must select the same subCategory as the category's subCategory or Change both of them`,
        );
    }
    let dummy: Dummy = {
      ...query,
    };
    if (files?.Images) {
      await this.cloudinaryService.DeleteImages(
        `E-Commerce/Products/${product.customCode}/Images`,
      );
      const result = await this.cloudinaryService.UploadFiles(files.Images, {
        folder: `E-Commerce/Products/${product.customCode}/Images`,
      });
      dummy = {
        ...dummy,
        Images: [...result],
      };
    }
    if (files?.coverImage) {
      await this.cloudinaryService.DeleteImage(
        (product?.coverImage as UploadedImage)?.public_id,
      );
      const result = await this.cloudinaryService.UploadImage(
        files.coverImage[0],
        {
          folder: `E-Commerce/Products/${product.customCode}/coverImage`,
        },
      );
      dummy = {
        ...dummy,
        coverImage: {
          secure_url: result['secure_url'] as string,
          public_id: result['public_id'] as string,
        },
      };
    }
    if (query?.price && query?.discount) {
      dummy.subPrice =
        query.price - (query.price * (query.discount || 0)) / 100;
    } else if (query?.price) {
      dummy.subPrice =
        (query.price as number) -
        ((query.price as number) * product.discount) / 100;
    } else if (query?.discount) {
      dummy.subPrice =
        product.price - (product.price * (query.discount || 0)) / 100;
    }
    const updatedProduct = await this.productRepo.updateOne({ _id: id }, dummy);
    if (updatedProduct?.['modifiedCount'] === 0)
      throw new BadRequestException('Failed to update product');
    return { message: 'done' };
  }
  async deleteProduct(id: Types.ObjectId): Promise<object> {
    const Product = await this.productRepo.findById(id);
    if (!Product) throw new BadRequestException('Product not found');
    await this.cloudinaryService.DeleteImages(
      `E-Commerce/Products/${Product?.customCode}`,
    );
    await this.productRepo.findOneAndDelete({ _id: id });
    return { message: 'done' };
  }
}
