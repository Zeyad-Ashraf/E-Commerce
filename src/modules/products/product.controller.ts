import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto, ProductFilter } from './dto/productDto';
import { Auth } from 'src/common/decorators/authDecorator';
import { EnumRole, ImageAllowedExt } from 'src/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerCloudinary } from 'src/common/utils/multer';
import { Types } from 'mongoose';
import { ValidateUploadedFilesPipe } from 'src/common/pipes/filePipe';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(201)
  @Auth(EnumRole.admin)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'Images', maxCount: 5 },
      ],
      multerCloudinary({ allowedExt: ImageAllowedExt }),
    ),
  )
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createProduct(
    @Body() body: ProductDto,
    @UploadedFiles(new ValidateUploadedFilesPipe())
    files: { Images: Express.Multer.File[]; coverImage: Express.Multer.File },
    @Req() req: Request,
  ): Promise<object> {
    return await this.productService.createProduct(body, files, req['user']);
  }

  @Get(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  async findProduct(@Param('id') id: Types.ObjectId): Promise<object> {
    return await this.productService.getProduct(id);
  }

  @Get('')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  async findProducts(@Query() query: ProductFilter): Promise<object> {
    return await this.productService.getProducts(query);
  }

  @Patch(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'Images', maxCount: 5 },
      ],
      multerCloudinary({ allowedExt: ImageAllowedExt }),
    ),
  )
  async updateBrand(
    @Param('id') id: Types.ObjectId,
    @Body() body: Partial<ProductDto>,
    @UploadedFiles()
    files?: {
      Images?: Express.Multer.File[];
      coverImage?: Express.Multer.File;
    },
  ): Promise<object> {
    return await this.productService.updateProduct(id, body, files);
  }

  @Delete(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  async deleteBrand(@Param('id') id: Types.ObjectId): Promise<object> {
    return await this.productService.deleteProduct(id);
  }
}
