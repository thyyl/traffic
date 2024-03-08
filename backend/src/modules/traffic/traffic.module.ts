import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Injector } from '@app/common/helpers/injector.helper';

@Module({
  imports: [CqrsModule],
  providers: [TrafficService],
  controllers: [TrafficController],
  exports: []
})
export class TrafficModule implements OnApplicationBootstrap {
  constructor(
    private configService: ConfigService,
    private moduleRef: ModuleRef
  ) {}

  async onApplicationBootstrap() {
    await this.initInjectableStrategies();
  }

  private async initInjectableStrategies() {
    const injector = new Injector(this.moduleRef);
    for (const strategy of this.getInjectableStrategies()) {
      if (typeof strategy.init === 'function') {
        await strategy.init(injector);
      }
    }
  }

  private getInjectableStrategies() {
    return this.configService.get('strategy').locations;
  }
}
