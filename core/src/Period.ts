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

import {DAYS_PER_WEEK, MONTHS_PER_QUARTER, MONTHS_PER_YEAR, MS_PER_DAY} from "./constants";
import LocalDate from "./LocalDate";
import Month from "./Month";

abstract class Period {

	abstract addToDate(date: LocalDate, amount: number): LocalDate;

	abstract between(start: LocalDate, end: LocalDate): number;

	multiply(multiplier: number): Period {
		return (multiplier === 0) ? NULL_PERIOD : (multiplier == 1) ? this : new MultipliedPeriod(this, multiplier);
	}

	get empty() {
		return false;
	}

	static ofYears(years: number): Period {
		return YEAR_PERIOD.multiply(years);
	}

	static ofQuarters(quarters: number): Period {
		return QUARTER_PERIOD.multiply(quarters);
	}

	static ofMonths(months: number): Period {
		return MONTH_PERIOD.multiply(months);
	}

	static ofWeeks(weeks: number): Period {
		return WEEK_PERIOD.multiply(weeks);
	}

	static ofDays(days: number): Period {
		return DAY_PERIOD.multiply(days);
	}
}

class NullPeriod extends Period {

	addToDate(date: LocalDate, _amount: number): LocalDate {
		return date;
	}

	between(_start: LocalDate, _end: LocalDate): number {
		return NaN;
	}

	multiply(_multiplier: number): Period {
		return this;
	}

	get empty() {
		return true;
	}
}

class DayPeriod extends Period {

	addToDate(date: LocalDate, amount: number): LocalDate {
		return LocalDate.of(date.year, date.month, date.dayOfMonth + amount);
	}

	between(start: LocalDate, end: LocalDate): number {
		return Math.floor((end.nativeUtc.getTime() - start.nativeUtc.getTime()) / MS_PER_DAY);
	}
}

class MonthPeriod extends Period {

	addToDate(date: LocalDate, amount: number): LocalDate {
		const value = date.month.value + amount - 1, // month values are 1-based, but we need a 0-based value
			yearShift = Math.floor(value / MONTHS_PER_YEAR),
			year = date.year + yearShift,
			month = Month.of(value - yearShift * MONTHS_PER_YEAR + 1); // back to 1-based
		return LocalDate.of(year, month, date.dayOfMonth)._normalizeMonth(date);
	}

	between(start: LocalDate, end: LocalDate): number {
		const provisionalResult = 12 * (end.year - start.year) + end.month.value - start.month.value;
		return provisionalResult - (this.addToDate(start, provisionalResult).isAfter(end) ? 1 : 0);
	}
}

class YearPeriod extends Period {

	addToDate(date: LocalDate, amount: number): LocalDate {
		return LocalDate.of(date.year + amount, date.month, date.dayOfMonth)._normalizeMonth(date);
	}

	between(start: LocalDate, end: LocalDate): number {
		const provisionalResult = end.year - start.year;
		return provisionalResult - (this.addToDate(start, provisionalResult).isAfter(end) ? 1 : 0);
	}
}

class MultipliedPeriod extends Period {

	constructor(private nested: Period, private multiplier: number) {
		super();
	}

	addToDate(date: LocalDate, amount: number): LocalDate {
		return this.nested.addToDate(date, amount * this.multiplier);
	}

	between(start: LocalDate, end: LocalDate): number {
		return Math.floor(this.nested.between(start, end) / this.multiplier);
	}

	multiply(multiplier: number): Period {
		return (multiplier === 0) ? NULL_PERIOD : (multiplier == 1) ? this
			: new MultipliedPeriod(this.nested, this.multiplier * multiplier);
	}
}

export default Period;

export const NULL_PERIOD: Period = new NullPeriod();
export const DAY_PERIOD: Period = new DayPeriod();
export const WEEK_PERIOD: Period = DAY_PERIOD.multiply(DAYS_PER_WEEK);
export const MONTH_PERIOD: Period = new MonthPeriod();
export const QUARTER_PERIOD: Period = MONTH_PERIOD.multiply(MONTHS_PER_QUARTER);
export const YEAR_PERIOD: Period = new YearPeriod();
