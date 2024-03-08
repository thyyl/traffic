import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GeoApifyService } from './geoapify.service';

@Module({
  imports: [CqrsModule],
  providers: [GeoApifyService],
  exports: [GeoApifyService]
})
export class GeoApifyModule {}
