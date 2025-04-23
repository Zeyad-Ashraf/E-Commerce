import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class confrimPasswordConstraint implements ValidatorConstraintInterface {
  validate(cPassword: string, args: ValidationArguments) {
    return cPassword === args.object[args.constraints[0]];
  }
}

export function ConfrimPasswordDecorator(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: ['password'],
      validator: confrimPasswordConstraint,
    });
  };
}
