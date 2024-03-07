import { registerDecorator, ValidationOptions } from 'class-validator';
import { AgentRegistrationInput } from '../dto/auth.input';
import { PhoneNumberParser } from '@app/common';

export const AgentRegistrationValidator = (
  validationOptions?: ValidationOptions
) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'agentRegistrationValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: AgentRegistrationInput) {
          // const { phoneCountryCode, phoneNumber } = value;

          // PhoneNumberParser.formatPhoneNumber({
          //   phoneCode: phoneCountryCode,
          //   phoneNumber
          // });

          // return phoneCountryCode === '+61';
          return true;
        }
      }
    });
  };
};
