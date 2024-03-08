import { IInferredQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GeoApifyService } from '../geoapify.service';
import { TypedQueryResult } from '@app/common/abstract/abstract-record-query.interface';
import { Logger } from '@nestjs/common';
import { GetLocationNamesQuery } from './geoapify.cqrs.input';

// ================ QUERY
@QueryHandler(GetLocationNamesQuery)
export class GetLocationNamesQueryHandler
  implements IInferredQueryHandler<GetLocationNamesQuery>
{
  constructor(readonly service: GeoApifyService) {}
  async execute(
    query: GetLocationNamesQuery
  ): Promise<TypedQueryResult<GetLocationNamesQuery>> {
    const { coordinates } = query;

    try {
      const data = await this.service.getLocationFromCoordinates(coordinates);
      return { success: true, data };
    } catch (error) {
      Logger.error(`Failed to find locations: ${error}`);
      return { success: false, message: error.message, data: null };
    }
  }
}
