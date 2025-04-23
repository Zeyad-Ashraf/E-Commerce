import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  IsDate,
  Matches,
} from 'class-validator';
import { ConfrimPasswordDecorator, EnumGender } from 'src/common/index';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ConfrimPasswordDecorator({ message: 'Passwords do not match' })
  cPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(11)
  @MaxLength(11)
  @Matches(/^01[0125][0-9]{8}$/, {
    message: 'Phone number must be in the format 01X XXX XXXX',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EnumGender)
  gender: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  DOB: Date;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class confrimDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
