import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';

@Module({
  imports: [CqrsModule],
  providers: [TrafficService],
  controllers: [TrafficController],
  exports: []
})
export class TrafficModule {}
