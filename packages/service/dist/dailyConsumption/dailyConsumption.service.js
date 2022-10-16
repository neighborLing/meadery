"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyConsumptionService = void 0;
const common_1 = require("@nestjs/common");
const xlsx_1 = require("../utils/xlsx");
const path = require("path");
let DailyConsumptionService = class DailyConsumptionService {
    getConsumption() {
        const filePath = path.resolve(__dirname, './data/data.xlsx');
        const xlsxData = (0, xlsx_1.getSheetsFromXlsx)(filePath);
        return JSON.stringify(xlsxData);
    }
};
DailyConsumptionService = __decorate([
    (0, common_1.Injectable)()
], DailyConsumptionService);
exports.DailyConsumptionService = DailyConsumptionService;
//# sourceMappingURL=dailyConsumption.service.js.map