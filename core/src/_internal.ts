export interface Dictionary<T> {
	[key: string]: T;
}

export class Enum<T> {

	readonly dict: Dictionary<T> = {};

	constructor(readonly array: T[], indexer: (value: T) => string) {
		for (let value of array) {
			this.dict[indexer(value)] = value;
		}
	}
}

export function compare(x: any, y: any) {
	return x > y ? 1 : x < y ? -1 : 0;
}

export function compareBy<T>(x: T, y: T, by: (t: T) => any) {
	return x && y ? compare(by(x), by(y)) : compare(x != null, y != null);
}

export function compareByNumber<T>(x: T, y: T, by: (t: T) => number) {
	return x && y ? by(x) - by(y) : compare(x != null, y != null);
}

export function equalBy<T>(x: T, y: T, by: (t: T) => any) {
	return x && y ? by(x) === by(y) : x == y;
}

export function pad(value: number, length: number, forceSign: boolean = false) {
	const sign = value < 0 ? "-" : forceSign ? "+" : "";
	let abs = Math.floor(Math.abs(value)),
		result = "";
	while (length > 0) {
		result = String(abs % 10) + result;
		abs = Math.floor(abs / 10);
		--length;
	}
	if (abs !== 0) {
		result = abs + result;
	}
	return sign + result;
}

export function spread(value: number, ...sizes: number[]): number[] {
	const sgn = value < 0 ? -1 : 1;
	const result: number[] = [];
	value = Math.abs(value);
	for (let size of sizes) {
		result.push(value % size);
		value = Math.floor(value / size);
	}
	result.push(sgn * value);
	result.reverse();
	return result;
}

export function mod(value: number, size: number) {
	return value - size * Math.floor(value / size);
}

export function toInt(value: number) {
	return value < 0 ? Math.ceil(value) : Math.floor(value);
}

// Same as Date.UTC, but without REALLY STUPID special case for years from 0 to 99.
export function utc(year: number, month: number, dayOfMonth: number, hour: number, minute: number, second: number, ms: number) {
	const date = new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second, ms));
	if (year >= 0 && year <= 99) {
		// Work around a REALLY STUPID feature of Date.UTC to treat 00-99 years as 1900-1999
		date.setUTCFullYear(year);
	}
	return date;
}
