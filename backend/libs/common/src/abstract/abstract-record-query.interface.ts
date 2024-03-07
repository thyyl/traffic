import {
  Query as TypeQuery,
  Command as TypedCommand
} from '@nestjs-architects/typed-cqrs';
import { FindManyOptions, FindOneOptions } from 'typeorm';

/**
 * -----------------------------
 * RECORD QUERY
 * -----------------------------
 */
// Query options
export type RecordQueryOptions = {
  nullable?: boolean;
  silence?: boolean;
  relation?: boolean;
};

export type RecordQueryWithJoinOptions<
  T = any,
  V = Record<string, any>
> = RecordQueryOptions & {
  joins?: T;
  relationRef?: V;
};

// Write Options
export type RecordMutateOptions = {
  silence?: boolean;
};

// Record response
export type RecordResponseProps<E = any> = {
  success: boolean;
  data: E | null;
  message?: string;
};

/**
 * -----------------------------
 * UTILITY TYPE
 * -----------------------------
 */

export type TypedQueryResult<QueryT extends TypeQuery<unknown>> =
  QueryT extends TypeQuery<infer ResultT> ? ResultT : never;
export type TypedCommandResult<CommandT extends TypedCommand<unknown>> =
  CommandT extends TypedCommand<infer ResultT> ? ResultT : never;

// Utility type to construct constructor params for query
export type CqrsQueryConstructorParams<
  Entity,
  Input,
  Options = RecordQueryOptions
> = Input extends undefined
  ? {
      query: FindOneOptions<Entity> | FindManyOptions<Entity>;
      options?: Options;
    }
  : { query: Input; options?: Options };

// Utility type to construct constructor params for command
export type CqrsCommandConstructorParams<
  Entity,
  Input,
  Filter = undefined,
  Options = RecordMutateOptions
> = Filter extends undefined | false
  ? { input: Input; options?: Options }
  : {
      query?: Filter extends true
        ? FindOneOptions<Entity> | FindManyOptions<Entity>
        : Filter;
      input: Input;
      options?: Options;
    };

/**
 * -----------------------------
 * FUNC
 * -----------------------------
 */
export type CqrsQueryFunc<CQRS extends TypeQuery<unknown>, Args> = (
  args: Args
) => Promise<TypedQueryResult<CQRS>>;

export type CqrsCommandFunc<CQRS extends TypedCommand<unknown>, Args> = (
  args: Args
) => Promise<TypedCommandResult<CQRS>>;
