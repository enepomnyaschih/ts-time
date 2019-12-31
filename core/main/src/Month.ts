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

import {compareByNumber} from "./_internal";

abstract class Month {

	abstract readonly value: number;

	abstract length(leapYear: boolean): number;

	compareTo(other: Month) {
		return Month.compare(this, other);
	}

	isBefore(other: Month) {
		return Month.isBefore(this, other);
	}

	isAfter(other: Month) {
		return Month.isAfter(this, other);
	}

	static of(value: number | Month): Month {
		if (typeof value !== "number") {
			return value;
		}
		const month = MONTHS[value - 1];
		if (!month) {
			throw new Error("Invalid month value.");
		}
		return month;
	}

	static compare(x: Month, y: Month) {
		return compareByNumber(x, y, t => t.value);
	}

	static isBefore(x: Month, y: Month) {
		return Month.compare(x, y) < 0;
	}

	static isAfter(x: Month, y: Month) {
		return Month.compare(x, y) > 0;
	}
}

class February extends Month {

	get value() {
		return 2;
	}

	length(leapYear: boolean): number {
		return leapYear ? 29 : 28;
	}
}

class FixedMonth extends Month {

	constructor(readonly value: number, private len: number) {
		super();
	}

	length(_leapYear: boolean): number {
		return this.len;
	}
}

export default Month;

export const JANUARY: Month = new FixedMonth(1, 31);
export const FEBRUARY: Month = new February();
export const MARCH: Month = new FixedMonth(3, 31);
export const APRIL: Month = new FixedMonth(4, 30);
export const MAY: Month = new FixedMonth(5, 31);
export const JUNE: Month = new FixedMonth(6, 30);
export const JULY: Month = new FixedMonth(7, 31);
export const AUGUST: Month = new FixedMonth(8, 31);
export const SEPTEMBER: Month = new FixedMonth(9, 30);
export const OCTOBER: Month = new FixedMonth(10, 31);
export const NOVEMBER: Month = new FixedMonth(11, 30);
export const DECEMBER: Month = new FixedMonth(12, 31);

export const MONTHS: Month[] =
	[JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER];
