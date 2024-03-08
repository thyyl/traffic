import { AbstractEntity } from '../abstract';
import { RelationPaths } from '../helpers/relation-path.helper';

// Query options
export type RecordQueryOptions<T extends AbstractEntity> = {
  nullable?: boolean;
  silence?: boolean;
  relations?: RelationPaths<T>;
};

export type RecordNormalQueryOptions = {
  nullable?: boolean;
  silence?: boolean;
};

// Write Options
export type RecordMutateOptions = {
  silence?: boolean;
};

// Record response
export type RecordResponseProps<E = any> = {
  success: boolean;
  data?: E;
  message?: string;
};
