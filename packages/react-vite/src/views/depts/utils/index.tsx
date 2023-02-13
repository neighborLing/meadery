import moment from 'moment';
import { Data } from './index.d';

function getMonth(payDay?: string): number {
    return moment(payDay).month();
}

export function formatPrice(price: string | number): string {
    return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getYear(payDay?: string): number {
    return moment(payDay).year();
}

function isSameMonth(payDay: number, pickTime?: string): boolean {
    pickTime = moment().format('YYYYMMDD');
    if (!(getYear() === getYear(`${payDay}`))) return false;
    return getMonth(pickTime) === getMonth(`${payDay}`);
}

// 所有待还
export function getRest(data: Data) {
    const rest = data.reduce((r: number, item) => {
        r += item.pay;

        return parseInt(`${r}`);
    }, 0);

    return formatPrice(rest);
}

// 当月待还
export function getMonthPay(data: Data, pickTime?: string) {
    const monthPay = data.reduce((r: number, item) => {
        const { payDay, pay } = item;
        if (isSameMonth(payDay, pickTime)) {
            {
                r += pay;
            }
        }

        return parseInt(`${r}`);
    }, 0)

    return formatPrice(monthPay);
}

export type TypeArr = Array<{
    rest: number,
    monthPay: number,
    name: string,
}>;

// 各类型当月待还以及总额
export function getTypePay(data: Data, pickTime?: string): TypeArr {
    const typeObject: {
        [propName: string]: {
            rest: number,
            monthPay: number,
        }
    } = {};

    data.forEach((item) => {
        const { payDay, pay, amount, lendingInstitution } = item;
        typeObject[lendingInstitution] =
            typeObject[lendingInstitution] ?
                typeObject[lendingInstitution] :
                { rest: 0, monthPay: 0 };

        if (!typeObject[lendingInstitution].rest) {
            typeObject[lendingInstitution].rest += amount || 0;
        }

        if (isSameMonth(payDay, pickTime)) {
            typeObject[lendingInstitution].monthPay += pay;
        }
    })

    const names = Object.keys(typeObject);
    const typeArr = names.map((name) => {
        const { rest, monthPay } = typeObject[name];

        return {
            rest,
            monthPay,
            name
        };
    });

    return typeArr;
}

// 各类型当月代还
export function getPieData(data: TypeArr) {
    return data.map(({ name, monthPay }) => ({
        name,
        value: monthPay
    })).filter(i => i.value);
}

// 获取每个月的还款总金额
export function getEveryMonthPay(data: Data) {
    const everyMonthMap = data.reduce((r: {
        [propName: string]: number
    }, item) => {
        const { payDay, pay } = item;
        const payTime = moment(`${payDay}`).format('YYYYMM01');
        r[payTime] = parseInt(`${(r[payTime] || 0) + pay}`);

        return r;
    }, {});

    const times = Object.keys(everyMonthMap);
    times.sort((x, y) => moment(x).unix() - moment(y).unix());

    const everyMonthPay = times.map(time => ({
        name: moment(time).format('YYYY-MM'),
        value: everyMonthMap[time]
    }))

    return everyMonthPay;
}