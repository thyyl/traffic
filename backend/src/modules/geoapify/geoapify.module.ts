import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GeoApifyService } from './geoapify.service';
import { CqrsHandlers } from './cqrs';

@Module({
  imports: [CqrsModule],
  providers: [GeoApifyService, ...CqrsHandlers],
  exports: [GeoApifyService]
})
export class GeoApifyModule {}
