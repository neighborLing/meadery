"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyConsumptionController = void 0;
const common_1 = require("@nestjs/common");
const dailyConsumption_service_1 = require("./dailyConsumption.service");
let DailyConsumptionController = class DailyConsumptionController {
    constructor(dailyConsumptionService) {
        this.dailyConsumptionService = dailyConsumptionService;
    }
    getHello() {
        return this.dailyConsumptionService.getConsumption();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], DailyConsumptionController.prototype, "getHello", null);
DailyConsumptionController = __decorate([
    (0, common_1.Controller)('/dailyConsumption'),
    __metadata("design:paramtypes", [dailyConsumption_service_1.DailyConsumptionService])
], DailyConsumptionController);
exports.DailyConsumptionController = DailyConsumptionController;
//# sourceMappingURL=dailyConsumption.controller.js.map