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

import LocalDate from "../../main/src/LocalDate";
import {APRIL, AUGUST, DECEMBER, FEBRUARY, JULY, JUNE, MARCH, MAY, OCTOBER, SEPTEMBER} from "../../main/src/Month";
import Period, {
	DAY_PERIOD,
	MONTH_PERIOD,
	NULL_PERIOD,
	QUARTER_PERIOD,
	WEEK_PERIOD,
	YEAR_PERIOD
} from "../../main/src/Period";

describe("Period", () => {
	const date = LocalDate.of(2019, JULY, 5),
		future = LocalDate.of(2021, SEPTEMBER, 2),
		day5 = Period.ofDays(5),
		week5 = Period.ofWeeks(5),
		month5 = Period.ofMonths(5),
		quarter5 = Period.ofQuarters(5),
		year5 = Period.ofYears(5);

	it("should add itself once to a date", () => {
		expect(DAY_PERIOD.addToDate(date, 1).nativeUtc).toEqual(LocalDate.of(2019, JULY, 6).nativeUtc);
		expect(WEEK_PERIOD.addToDate(date, 1).nativeUtc).toEqual(LocalDate.of(2019, JULY, 12).nativeUtc);
		expect(MONTH_PERIOD.addToDate(date, 1).nativeUtc).toEqual(LocalDate.of(2019, AUGUST, 5).nativeUtc);
		expect(QUARTER_PERIOD.addToDate(date, 1).nativeUtc).toEqual(LocalDate.of(2019, OCTOBER, 5).nativeUtc);
		expect(YEAR_PERIOD.addToDate(date, 1).nativeUtc).toEqual(LocalDate.of(2020, JULY, 5).nativeUtc);
	});

	it("should add itself multiple times to a date", () => {
		expect(DAY_PERIOD.addToDate(date, 5).nativeUtc).toEqual(LocalDate.of(2019, JULY, 10).nativeUtc);
		expect(WEEK_PERIOD.addToDate(date, 5).nativeUtc).toEqual(LocalDate.of(2019, AUGUST, 9).nativeUtc);
		expect(MONTH_PERIOD.addToDate(date, 5).nativeUtc).toEqual(LocalDate.of(2019, DECEMBER, 5).nativeUtc);
		expect(QUARTER_PERIOD.addToDate(date, 5).nativeUtc).toEqual(LocalDate.of(2020, OCTOBER, 5).nativeUtc);
		expect(YEAR_PERIOD.addToDate(date, 5).nativeUtc).toEqual(LocalDate.of(2024, JULY, 5).nativeUtc);
	});

	it("should add itself negative times to a date", () => {
		expect(DAY_PERIOD.addToDate(date, -5).nativeUtc).toEqual(LocalDate.of(2019, JUNE, 30).nativeUtc);
		expect(WEEK_PERIOD.addToDate(date, -5).nativeUtc).toEqual(LocalDate.of(2019, MAY, 31).nativeUtc);
		expect(MONTH_PERIOD.addToDate(date, -5).nativeUtc).toEqual(LocalDate.of(2019, FEBRUARY, 5).nativeUtc);
		expect(QUARTER_PERIOD.addToDate(date, -5).nativeUtc).toEqual(LocalDate.of(2018, APRIL, 5).nativeUtc);
		expect(YEAR_PERIOD.addToDate(date, -5).nativeUtc).toEqual(LocalDate.of(2014, JULY, 5).nativeUtc);
	});

	it("should add negative itself to a date", () => {
		expect(DAY_PERIOD.multiply(-1).addToDate(date, 5).nativeUtc).toEqual(LocalDate.of(2019, JUNE, 30).nativeUtc);
		expect(WEEK_PERIOD.multiply(-1).addToDate(date, 5).nativeUtc).toEqual(LocalDate.of(2019, MAY, 31).nativeUtc);
		expect(MONTH_PERIOD.multiply(-1).addToDate(date, 5).nativeUtc).toEqual(LocalDate.of(2019, FEBRUARY, 5).nativeUtc);
		expect(QUARTER_PERIOD.multiply(-1).addToDate(date, 5).nativeUtc).toEqual(LocalDate.of(2018, APRIL, 5).nativeUtc);
		expect(YEAR_PERIOD.multiply(-1).addToDate(date, 5).nativeUtc).toEqual(LocalDate.of(2014, JULY, 5).nativeUtc);
	});

	it("should prefer earlier day when ambiguous", () => {
		expect(MONTH_PERIOD.addToDate(LocalDate.of(2019, JULY, 31), 2).nativeUtc)
			.toEqual(LocalDate.of(2019, SEPTEMBER, 30).nativeUtc);
		expect(MONTH_PERIOD.addToDate(LocalDate.of(2019, JULY, 31), -1).nativeUtc)
			.toEqual(LocalDate.of(2019, JUNE, 30).nativeUtc);
		expect(MONTH_PERIOD.addToDate(LocalDate.of(2019, JUNE, 30), -4).nativeUtc)
			.toEqual(LocalDate.of(2019, FEBRUARY, 28).nativeUtc);
		expect(MONTH_PERIOD.addToDate(LocalDate.of(2019, JUNE, 30), 8).nativeUtc)
			.toEqual(LocalDate.of(2020, FEBRUARY, 29).nativeUtc);
	});

	it("should return the same date instance when adding null period", () => {
		expect(NULL_PERIOD.addToDate(date, 0)).toBe(date);
		expect(NULL_PERIOD.addToDate(date, 1)).toBe(date);
		expect(NULL_PERIOD.addToDate(date, -1)).toBe(date);
		expect(NULL_PERIOD.addToDate(date, 100)).toBe(date);
		expect(DAY_PERIOD.addToDate(date, 0)).toBe(date);
		expect(WEEK_PERIOD.addToDate(date, 0)).toBe(date);
		expect(MONTH_PERIOD.addToDate(date, 0)).toBe(date);
		expect(QUARTER_PERIOD.addToDate(date, 0)).toBe(date);
		expect(YEAR_PERIOD.addToDate(date, 0)).toBe(date);
		expect(day5.addToDate(date, 0)).toBe(date);
		expect(week5.addToDate(date, 0)).toBe(date);
		expect(month5.addToDate(date, 0)).toBe(date);
		expect(quarter5.addToDate(date, 0)).toBe(date);
		expect(year5.addToDate(date, 0)).toBe(date);
	});

	it("should return null period when multiplying by 0", () => {
		expect(NULL_PERIOD.multiply(5)).toBe(NULL_PERIOD);
		expect(DAY_PERIOD.multiply(0)).toBe(NULL_PERIOD);
	});

	it("should return itself when multiplying by 1", () => {
		expect(DAY_PERIOD.multiply(1)).toBe(DAY_PERIOD);
		expect(WEEK_PERIOD.multiply(1)).toBe(WEEK_PERIOD);
	});

	it("should return 0 between equal dates", () => {
		expect(DAY_PERIOD.between(date, date)).toBe(0);
		expect(WEEK_PERIOD.between(date, date)).toBe(0);
		expect(MONTH_PERIOD.between(date, date)).toBe(0);
		expect(QUARTER_PERIOD.between(date, date)).toBe(0);
		expect(YEAR_PERIOD.between(date, date)).toBe(0);
		expect(day5.between(date, date)).toBe(0);
		expect(week5.between(date, date)).toBe(0);
		expect(month5.between(date, date)).toBe(0);
		expect(quarter5.between(date, date)).toBe(0);
		expect(year5.between(date, date)).toBe(0);
	});

	it("should return proper value between two dates", () => {
		expect(DAY_PERIOD.between(date, future)).toBe(365 + 366 + 26 + 31 + 2);
		expect(WEEK_PERIOD.between(date, future)).toBe(Math.floor((365 + 366 + 26 + 31 + 2) / 7));
		expect(MONTH_PERIOD.between(date, future)).toBe(25);
		expect(QUARTER_PERIOD.between(date, future)).toBe(8);
		expect(YEAR_PERIOD.between(date, future)).toBe(2);
		expect(day5.between(date, future)).toBe(Math.floor((365 + 366 + 26 + 31 + 2) / 5));
		expect(week5.between(date, future)).toBe(Math.floor((365 + 366 + 26 + 31 + 2) / 35));
		expect(month5.between(date, future)).toBe(5);
		expect(quarter5.between(date, future)).toBe(1);
		expect(year5.between(date, future)).toBe(0);
	});

	it("should return negative value between two reverse dates", () => {
		expect(DAY_PERIOD.between(future, date)).toBe(-(365 + 366 + 26 + 31 + 2));
		expect(WEEK_PERIOD.between(future, date)).toBe(-Math.floor((365 + 366 + 26 + 31 + 2) / 7));
		expect(MONTH_PERIOD.between(future, date)).toBe(-25);
		expect(QUARTER_PERIOD.between(future, date)).toBe(-8);
		expect(YEAR_PERIOD.between(future, date)).toBe(-2);
		expect(day5.between(future, date)).toBe(-Math.floor((365 + 366 + 26 + 31 + 2) / 5));
		expect(week5.between(future, date)).toBe(-Math.floor((365 + 366 + 26 + 31 + 2) / 35));
		expect(month5.between(future, date)).toBe(-5);
		expect(quarter5.between(future, date)).toBe(-1);
		expect(year5.between(future, date)).toBe(0);
	});

	it("should return negative value between two dates for negative periods", () => {
		expect(DAY_PERIOD.multiply(-1).between(date, future)).toBe(-(365 + 366 + 26 + 31 + 2));
		expect(WEEK_PERIOD.multiply(-1).between(date, future)).toBe(-Math.floor((365 + 366 + 26 + 31 + 2) / 7));
		expect(MONTH_PERIOD.multiply(-1).between(date, future)).toBe(-25);
		expect(QUARTER_PERIOD.multiply(-1).between(date, future)).toBe(-8);
		expect(YEAR_PERIOD.multiply(-1).between(date, future)).toBe(-2);
		expect(day5.multiply(-1).between(date, future)).toBe(-Math.floor((365 + 366 + 26 + 31 + 2) / 5));
		expect(week5.multiply(-1).between(date, future)).toBe(-Math.floor((365 + 366 + 26 + 31 + 2) / 35));
		expect(month5.multiply(-1).between(date, future)).toBe(-5);
		expect(quarter5.multiply(-1).between(date, future)).toBe(-1);
		expect(year5.multiply(-1).between(date, future)).toBe(0);
	});

	it("should return full value between two dates", () => {
		expect(YEAR_PERIOD.between(date, LocalDate.of(2023, MARCH, 31))).toBe(3);
	});

	it("should return NaN between two dates for null period", () => {
		expect(NULL_PERIOD.between(date, date)).toBeNaN();
		expect(NULL_PERIOD.between(date, future)).toBeNaN();
	});
});
