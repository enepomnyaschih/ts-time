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

class DayOfWeek {

	protected constructor(readonly value: number) {
	}

	compareTo(other: DayOfWeek) {
		return DayOfWeek.compare(this, other);
	}

	isBefore(other: DayOfWeek) {
		return DayOfWeek.isBefore(this, other);
	}

	isAfter(other: DayOfWeek) {
		return DayOfWeek.isAfter(this, other);
	}

	static of(value: number | DayOfWeek) {
		if (typeof value !== "number") {
			return value;
		}
		const dayOfWeek = DAYS_OF_WEEK[value - 1];
		if (!dayOfWeek) {
			throw new Error("Invalid day of week value.")
		}
		return dayOfWeek;
	}

	static compare(x: DayOfWeek, y: DayOfWeek) {
		return compareByNumber(x, y, t => t.value);
	}

	static isBefore(x: DayOfWeek, y: DayOfWeek) {
		return DayOfWeek.compare(x, y) < 0;
	}

	static isAfter(x: DayOfWeek, y: DayOfWeek) {
		return DayOfWeek.compare(x, y) > 0;
	}
}

class DayOfWeekConstructor extends DayOfWeek {

	constructor(value: number) {
		super(value);
	}
}

export const MONDAY: DayOfWeek = new DayOfWeekConstructor(1);
export const TUESDAY: DayOfWeek = new DayOfWeekConstructor(2);
export const WEDNESDAY: DayOfWeek = new DayOfWeekConstructor(3);
export const THURSDAY: DayOfWeek = new DayOfWeekConstructor(4);
export const FRIDAY: DayOfWeek = new DayOfWeekConstructor(5);
export const SATURDAY: DayOfWeek = new DayOfWeekConstructor(6);
export const SUNDAY: DayOfWeek = new DayOfWeekConstructor(7);

export const DAYS_OF_WEEK: DayOfWeek[] = [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY];

export default DayOfWeek;
