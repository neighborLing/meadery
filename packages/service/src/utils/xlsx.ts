import xlsx from 'node-xlsx';
import { SheetContent, SheetObject, RowContent, OutParams, XlsxData, XlsxObject } from './xlsx.d';

export function getSheetsFromXlsx(filePath: string, sheetName: string = ''): SheetContent {
    const sheets = xlsx.parse(filePath);
    sheetName = sheetName || sheets[0].name;
    const target = (sheets as Array<SheetObject>).find(i => i.name === sheetName);

    if (!target) return [];

    return (target as SheetObject).data || [];
}