/*
MIT License

Copyright (c) 2019 Egor Nepomnyaschih

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export interface Dictionary<T> {
	[key: string]: T;
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

// Same as Date.UTC, but without special case for years from 0 to 99.
export function utc(year: number, month: number, dayOfMonth: number, hour: number, minute: number, second: number, ms: number) {
	const date = new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second, ms));
	if (year >= 0 && year <= 99) {
		date.setUTCFullYear(date.getUTCFullYear() - 1900);
		// Note: we can't simply assign (year), because, say, utc(9, 0, -2) should lead to 8th year, not 9th
	}
	return date;
}

export function parseMs(ms: string) {
	if (!ms) {
		return 0;
	}
	ms = ms.substr(0, 3);
	while (ms.length < 3) {
		ms += "0";
	}
	return +ms;
}
