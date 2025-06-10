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
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/categoryDto';
import { Auth } from 'src/common/decorators/authDecorator';
import { EnumRole, ImageAllowedExt } from 'src/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloudinary } from 'src/common/utils/multer';
import { Types } from 'mongoose';
import { FileValidationPipe } from 'src/common/pipes/filePipe';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  @UseInterceptors(
    FileInterceptor('image', multerCloudinary({ allowedExt: ImageAllowedExt })),
  )
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createCategory(
    @Body() body: CategoryDto,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<object> {
    return await this.categoryService.createCategory(body, file, req['user']);
  }

  @Get(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  async findCategory(@Param('id') id: Types.ObjectId): Promise<object> {
    return await this.categoryService.getCategory(id);
  }

  @Patch(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(
    FileInterceptor('image', multerCloudinary({ allowedExt: ImageAllowedExt })),
  )
  async updateCategory(
    @Param('id') id: Types.ObjectId,
    @Body() body: { name: string },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<object> {
    return await this.categoryService.UpdateCategory(id, body, file);
  }

  @Delete(':id')
  @HttpCode(201)
  @Auth(EnumRole.admin)
  async deleteCategory(@Param('id') id: Types.ObjectId): Promise<object> {
    return await this.categoryService.deleteCategory({ _id: id });
  }
}
