import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsDateValid implements ValidatorConstraintInterface {
  validate(fromDate: Date) {
    return fromDate >= new Date();
  }
  defaultMessage(): string {
    return 'startDate must be greater than or equal to the current date';
  }
}

@ValidatorConstraint({ async: true })
export class toDateValid implements ValidatorConstraintInterface {
  validate(expireAt: Date, arg: ValidationArguments) {
    return expireAt > arg.object['fromDate'];
  }
  defaultMessage(): string {
    return 'expireDate must be greater than startDate';
  }
}

export class CouponDto {
  @IsString()
  @IsNotEmpty()
  @Length(8)
  code: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  amount: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @Validate(IsDateValid)
  fromDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @Validate(toDateValid)
  expireAt: Date;
}
