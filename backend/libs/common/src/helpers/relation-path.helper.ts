import { AbstractEntity } from '../abstract';

export type RelationPaths<T extends AbstractEntity> = Array<
  EntityRelationPaths<T>
>;

export type EntityRelationPaths<T extends AbstractEntity> =
  | `customFields.${string}`
  | PathsToStringProps1<T>
  | Join<PathsToStringProps2<T>, '.'>
  | TripleDotPath;

export type EntityRelationKeys<T extends AbstractEntity> = {
  [K in Extract<keyof T, string>]: Required<T>[K] extends AbstractEntity | null
    ? K
    : Required<T>[K] extends AbstractEntity[]
    ? K
    : never;
}[Extract<keyof T, string>];

export type EntityRelations<T extends AbstractEntity> = {
  [K in EntityRelationKeys<T>]: T[K];
};

export type PathsToStringProps1<T extends AbstractEntity> = T extends string
  ? []
  : {
      [K in EntityRelationKeys<T>]: K;
    }[Extract<EntityRelationKeys<T>, string>];

export type PathsToStringProps2<T extends AbstractEntity> = T extends string
  ? never
  : {
      [K in EntityRelationKeys<T>]: T[K] extends AbstractEntity[]
        ? [K, PathsToStringProps1<T[K][number]>]
        : T[K] extends AbstractEntity | undefined
        ? [K, PathsToStringProps1<NonNullable<T[K]>>]
        : never;
    }[Extract<EntityRelationKeys<T>, string>];

export type TripleDotPath = `${string}.${string}.${string}`;

// Based on https://stackoverflow.com/a/47058976/772859
export type Join<T extends Array<string | any>, D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : // eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
  T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;
