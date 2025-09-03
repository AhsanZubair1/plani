// src/common/validators/password-complexity.validator.ts
import { registerDecorator, ValidationOptions } from 'class-validator';

import { PASSWORD_CRITERIA_FAILED } from '@src/common/error-messages';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName,
      options: {
        message: PASSWORD_CRITERIA_FAILED,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (!value) return true; // skip if empty, handled by IsOptional
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value);
        },
      },
    });
  };
}
