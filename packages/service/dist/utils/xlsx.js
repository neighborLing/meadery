"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSheetsFromXlsx = void 0;
const node_xlsx_1 = require("node-xlsx");
function getSheetsFromXlsx(filePath, sheetName = '') {
    const sheets = node_xlsx_1.default.parse(filePath);
    sheetName = sheetName || sheets[0].name;
    const target = sheets.find(i => i.name === sheetName);
    if (!target)
        return [];
    return target.data || [];
}
exports.getSheetsFromXlsx = getSheetsFromXlsx;
//# sourceMappingURL=xlsx.js.map