import { Injectable } from '@nestjs/common';
import { getSheetsFromXlsx } from '../utils/xlsx';
import * as path from 'path';

@Injectable()
export class DailyConsumptionService {
  getConsumption(
  //   {
  //   data
  // }: {
  //   data?: string
  // }
  ): string {
    const filePath = path.resolve(__dirname, './data/data.xlsx');
    const xlsxData = getSheetsFromXlsx(filePath);

    return JSON.stringify(xlsxData);
  }
}