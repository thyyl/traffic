import { BadRequestException, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

export const ConstraintErrors = {
  UQ_97672ac88f789774dd47f7c8be3: 'Email already existed!',
  UQ_3c4d4fae641bf9048ad324ee0d9: 'Value already existed!',
};
@Catch()
export class ExtendedGqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: any) {
    const { name, message } = exception;

    let errorMessage = message;
    let returnException = exception;
    if (name === 'QueryFailedError') {
      errorMessage = ConstraintErrors[exception.constraint];
      returnException = new BadRequestException({
        message: errorMessage,
      });
    }

    return returnException;
  }
}
