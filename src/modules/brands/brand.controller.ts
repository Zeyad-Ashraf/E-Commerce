import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandDto } from './dto/brandDto';
import { Auth } from 'src/common/decorators/authDecorator';
import { EnumRole, ImageAllowedExt } from 'src/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloudinary } from 'src/common/utils/multer';
import { Types } from 'mongoose';
import { FileValidationPipe } from 'src/common/pipes/filePipe';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @HttpCode(201)
  @Auth(EnumRole.admin)
  @UseInterceptors(
    FileInterceptor('logo', multerCloudinary({ allowedExt: ImageAllowedExt })),
  )
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createNewBrand(
    @Body() body: BrandDto,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<object> {
    return await this.brandService.createBrand(body, file, req['user']);
  }

  @Get(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  async findBrand(@Param('id') id: Types.ObjectId): Promise<object> {
    return await this.brandService.getBrand(id);
  }

  @Patch(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(
    FileInterceptor('logo', multerCloudinary({ allowedExt: ImageAllowedExt })),
  )
  async updateBrand(
    @Param('id') id: Types.ObjectId,
    @Body() body: Partial<BrandDto>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<object> {
    return await this.brandService.updateBrand(id, body, file);
  }

  @Delete(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  async deleteBrand(@Param('id') id: Types.ObjectId): Promise<object> {
    return await this.brandService.deleteBrand({ _id: id });
  }
}
