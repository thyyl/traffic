import { Query as TypeQuery } from '@nestjs-architects/typed-cqrs';
import { RecordResponseProps } from '@app/common';
import { Coordinates } from '@modules/traffic/dto/traffic.dto';

// ================ QUERY
export class GetLocationNamesQuery extends TypeQuery<
  RecordResponseProps<string[]>
> {
  constructor(readonly coordinates: Coordinates[]) {
    super();
  }
}
