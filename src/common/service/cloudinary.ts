import { Injectable } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';
import { cloudinaryConfig } from 'src/common';
import { UploadedImage } from 'src/modules/category/category.service';

@Injectable()
export class CloudinaryService {
  constructor() {}

  async UploadImage(
    file: Express.Multer.File,
    options: UploadApiOptions,
  ): Promise<object> {
    const result = await cloudinaryConfig().uploader.upload(file.path, options);
    return result;
  }

  async UploadFiles(
    files: Express.Multer.File[],
    options: UploadApiOptions,
  ): Promise<UploadedImage[]> {
    const result: UploadedImage[] = [];
    for (const file of files) {
      const { secure_url, public_id } =
        await cloudinaryConfig().uploader.upload(file.path, options);
      result.push({ secure_url, public_id });
    }
    return result;
  }

  async DeleteImage(filePath: string): Promise<void> {
    await cloudinaryConfig().uploader.destroy(filePath);
  }

  async DeleteImages(filePath: string): Promise<void> {
    await cloudinaryConfig().api.delete_resources_by_prefix(filePath);
    await cloudinaryConfig().api.delete_folder(filePath);
  }
}
