import {
  Query as TypeQuery,
  Command as TypedCommand
} from '@nestjs-architects/typed-cqrs';
import {
  CqrsCommandConstructorParams,
  CqrsQueryConstructorParams,
  RecordMutateOptions,
  RecordQueryOptions,
  RecordResponseProps
} from './abstract-record-query.interface';

/**
 * ==================================================================================================================================
 * CQRS QUERY
 * ==================================================================================================================================
 */
/**
   * -----------------------------
   * Abstract CQRS Query
   * -----------------------------
   * @param Entity main entity query interact with
   * @param Input custom input for the query, default to `Query<Entity>`
   * @param Options custom query options, default to `RecordQueryOptions`
   * @param Response custom query response, default to `Entity`
   *
   * @example
  ```
  // sample usage
  export class FindOneXxxQuery extends AbstractCqrsQueryInput<XxxxEntity> {}
  
  // custom query
  export class FindOneXxxQuery extends AbstractCqrsQueryInput<XxxxEntity, { someParams: boolean }> {}
  }
  ```
   */
export abstract class AbstractCqrsQueryInput<
  Entity,
  Input = undefined,
  Options = RecordQueryOptions,
  Response = undefined
> extends TypeQuery<
  RecordResponseProps<Response extends undefined ? Entity : Response>
> {
  constructor(
    readonly args: CqrsQueryConstructorParams<Entity, Input, Options>
  ) {
    super();
  }
}

/**
 * ==================================================================================================================================
 * CQRS COMMAND
 * ==================================================================================================================================
 */
/**
   * -----------------------------
   * Abstract CQRS Command
   * -----------------------------
   * @param Entity main entity command interact with
   * @param Input the input for the command
   * @param Filter custom filter options, default to `undefined`
   * @param Options custom command options, default to `RecordMutateOptions`
   * @param Response custom command response, default to `Entity`
   *
   * @example
  ```
  // sample usage
  type SampleInput = { firstName: string; lastName: string; }
  export class UpdateXxxCommand extends AbstractCqrsCommandInput<
    XxxxEntity,
    SampleInput
  > {}
  
  export class UpdateXxxCommand extends AbstractCqrsCommandInput<
    XxxxEntity,
    number, // the input is a number
    false // doesn't wants to have filter
  > {}
  ```
   */
export abstract class AbstractCqrsCommandInput<
  Entity,
  Input,
  Filter = undefined,
  Options = RecordMutateOptions,
  Response = undefined
> extends TypedCommand<
  RecordResponseProps<Response extends undefined ? Entity : Response>
> {
  constructor(
    readonly args: CqrsCommandConstructorParams<Entity, Input, Filter, Options>
  ) {
    super();
  }
}
