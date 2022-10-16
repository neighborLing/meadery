import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DailyConsumptionController } from './dailyConsumption/dailyConsumption.controller';
import { DailyConsumptionService } from './dailyConsumption/dailyConsumption.service';

@Module({
  imports: [],
  controllers: [AppController, DailyConsumptionController],
  providers: [AppService, DailyConsumptionService],
})
export class AppModule {}
