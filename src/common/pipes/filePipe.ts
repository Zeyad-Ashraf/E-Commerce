import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ImageAllowedExt } from '../constants/constants';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file) throw new BadRequestException('File is required');
    return file;
  }
}
@Injectable()
export class ValidateUploadedFilesPipe implements PipeTransform {
  transform(files: {
    Images: Express.Multer.File[];
    coverImage: Express.Multer.File;
  }) {
    const allowedMimeTypes = ImageAllowedExt;

    if (!files.coverImage) {
      throw new BadRequestException('coverImage is required');
    }
    if (
      !allowedMimeTypes.includes(
        (files.coverImage[0] as Express.Multer.File).mimetype,
      )
    ) {
      throw new BadRequestException('Invalid coverImage file type');
    }

    if (!files.Images || files.Images.length === 0) {
      throw new BadRequestException('At least one image is required in Images');
    }

    for (const image of files.Images) {
      if (!allowedMimeTypes.includes(image.mimetype)) {
        throw new BadRequestException('Invalid image file type in Images');
      }
    }

    return files;
  }
}
