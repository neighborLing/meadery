import { Controller, Get } from '@nestjs/common';
import { DailyConsumptionService } from './dailyConsumption.service';

@Controller('/dailyConsumption')
export class DailyConsumptionController {
  constructor(private readonly dailyConsumptionService: DailyConsumptionService) {}

  @Get()
  getHello(): string {
    return this.dailyConsumptionService.getConsumption();
  }
}
