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
import { SubCategoryService } from './subCategory.service';
import { SubCategoryDto } from './Dto/subCategoryDto';
import { Auth } from 'src/common/decorators/authDecorator';
import { EnumRole, ImageAllowedExt, multerCloudinary } from 'src/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Express } from 'express';
import { FileValidationPipe } from 'src/common/pipes/filePipe';
import { Types, UpdateQuery } from 'mongoose';

@Controller('subCategory')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Post()
  @HttpCode(201)
  @Auth(EnumRole.admin)
  @UseInterceptors(
    FileInterceptor('image', multerCloudinary({ allowedExt: ImageAllowedExt })),
  )
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createSubCategory(
    @Body() body: SubCategoryDto,
    @Req() request: Request,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ): Promise<object> {
    return await this.subCategoryService.createSubCategory(
      body,
      request['user'],
      file,
    );
  }

  @Get(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  async findSubCategory(@Param('id') id: Types.ObjectId): Promise<object> {
    return await this.subCategoryService.getSubCategory(id);
  }

  @Patch(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  @UseInterceptors(
    FileInterceptor('image', multerCloudinary({ allowedExt: ImageAllowedExt })),
  )
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateSubCategory(
    @Param('id') id: Types.ObjectId,
    @Body() body: UpdateQuery<SubCategoryDto>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<object> {
    return await this.subCategoryService.UpdateCategory(id, body, file);
  }

  @Delete(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  async deleteSubCategory(@Param('id') id: Types.ObjectId): Promise<object> {
    return await this.subCategoryService.deleteCategory({ _id: id });
  }
}
