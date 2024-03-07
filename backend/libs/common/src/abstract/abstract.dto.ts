import { FilterableField } from '@nestjs-query/query-graphql';
import { ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class AbstractDto {
  @FilterableField(() => ID)
  id: string;

  @FilterableField()
  createdAt: Date;

  @FilterableField()
  updatedAt: Date;
}
