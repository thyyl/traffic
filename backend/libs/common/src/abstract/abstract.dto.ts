import { ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class AbstractDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
