import { Query as TypeQuery } from '@nestjs-architects/typed-cqrs';
import { RecordResponseProps } from '@app/common';

// ================ QUERY
export class GetReadAsideCachedData<T> extends TypeQuery<
  RecordResponseProps<T>
> {
  constructor(
    readonly key: string,
    readonly fetchDataFn: (dateTime: string) => Promise<T>,
    readonly dateTime: string
  ) {
    super();
  }
}
