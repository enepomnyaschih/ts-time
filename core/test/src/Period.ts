/*
MIT License

Copyright (c) 2019-2022 Egor Nepomnyaschih

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

import {expect} from "chai";
import LocalDate from "ts-time/LocalDate";
import {APRIL, AUGUST, DECEMBER, FEBRUARY, JULY, JUNE, MARCH, MAY, OCTOBER, SEPTEMBER} from "ts-time/Month";
import Period, {
	DAY_PERIOD,
	MONTH_PERIOD,
	NULL_PERIOD,
	QUARTER_PERIOD,
	WEEK_PERIOD,
	YEAR_PERIOD
} from "ts-time/Period";

describe("Period", () => {
	const date = LocalDate.of(2019, JULY, 5),
		future = LocalDate.of(2021, SEPTEMBER, 2),
		day5 = Period.ofDays(5),
		week5 = Period.ofWeeks(5),
		month5 = Period.ofMonths(5),
		quarter5 = Period.ofQuarters(5),
		year5 = Period.ofYears(5);

	it("should add itself once to a date", () => {
		expect(DAY_PERIOD.addToDate(date, 1).nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 6).nativeUtc.getTime());
		expect(WEEK_PERIOD.addToDate(date, 1).nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 12).nativeUtc.getTime());
		expect(MONTH_PERIOD.addToDate(date, 1).nativeUtc.getTime()).equal(LocalDate.of(2019, AUGUST, 5).nativeUtc.getTime());
		expect(QUARTER_PERIOD.addToDate(date, 1).nativeUtc.getTime()).equal(LocalDate.of(2019, OCTOBER, 5).nativeUtc.getTime());
		expect(YEAR_PERIOD.addToDate(date, 1).nativeUtc.getTime()).equal(LocalDate.of(2020, JULY, 5).nativeUtc.getTime());
	});

	it("should add itself multiple times to a date", () => {
		expect(DAY_PERIOD.addToDate(date, 5).nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 10).nativeUtc.getTime());
		expect(WEEK_PERIOD.addToDate(date, 5).nativeUtc.getTime()).equal(LocalDate.of(2019, AUGUST, 9).nativeUtc.getTime());
		expect(MONTH_PERIOD.addToDate(date, 5).nativeUtc.getTime()).equal(LocalDate.of(2019, DECEMBER, 5).nativeUtc.getTime());
		expect(QUARTER_PERIOD.addToDate(date, 5).nativeUtc.getTime()).equal(LocalDate.of(2020, OCTOBER, 5).nativeUtc.getTime());
		expect(YEAR_PERIOD.addToDate(date, 5).nativeUtc.getTime()).equal(LocalDate.of(2024, JULY, 5).nativeUtc.getTime());
	});

	it("should add itself negative times to a date", () => {
		expect(DAY_PERIOD.addToDate(date, -5).nativeUtc.getTime()).equal(LocalDate.of(2019, JUNE, 30).nativeUtc.getTime());
		expect(WEEK_PERIOD.addToDate(date, -5).nativeUtc.getTime()).equal(LocalDate.of(2019, MAY, 31).nativeUtc.getTime());
		expect(MONTH_PERIOD.addToDate(date, -5).nativeUtc.getTime()).equal(LocalDate.of(2019, FEBRUARY, 5).nativeUtc.getTime());
		expect(QUARTER_PERIOD.addToDate(date, -5).nativeUtc.getTime()).equal(LocalDate.of(2018, APRIL, 5).nativeUtc.getTime());
		expect(YEAR_PERIOD.addToDate(date, -5).nativeUtc.getTime()).equal(LocalDate.of(2014, JULY, 5).nativeUtc.getTime());
	});

	it("should add negative itself to a date", () => {
		expect(DAY_PERIOD.multiply(-1).addToDate(date, 5).nativeUtc.getTime()).equal(LocalDate.of(2019, JUNE, 30).nativeUtc.getTime());
		expect(WEEK_PERIOD.multiply(-1).addToDate(date, 5).nativeUtc.getTime()).equal(LocalDate.of(2019, MAY, 31).nativeUtc.getTime());
		expect(MONTH_PERIOD.multiply(-1).addToDate(date, 5).nativeUtc.getTime()).equal(LocalDate.of(2019, FEBRUARY, 5).nativeUtc.getTime());
		expect(QUARTER_PERIOD.multiply(-1).addToDate(date, 5).nativeUtc.getTime()).equal(LocalDate.of(2018, APRIL, 5).nativeUtc.getTime());
		expect(YEAR_PERIOD.multiply(-1).addToDate(date, 5).nativeUtc.getTime()).equal(LocalDate.of(2014, JULY, 5).nativeUtc.getTime());
	});

	it("should prefer earlier day when ambiguous", () => {
		expect(MONTH_PERIOD.addToDate(LocalDate.of(2019, JULY, 31), 2).nativeUtc.getTime())
			.equal(LocalDate.of(2019, SEPTEMBER, 30).nativeUtc.getTime());
		expect(MONTH_PERIOD.addToDate(LocalDate.of(2019, JULY, 31), -1).nativeUtc.getTime())
			.equal(LocalDate.of(2019, JUNE, 30).nativeUtc.getTime());
		expect(MONTH_PERIOD.addToDate(LocalDate.of(2019, JUNE, 30), -4).nativeUtc.getTime())
			.equal(LocalDate.of(2019, FEBRUARY, 28).nativeUtc.getTime());
		expect(MONTH_PERIOD.addToDate(LocalDate.of(2019, JUNE, 30), 8).nativeUtc.getTime())
			.equal(LocalDate.of(2020, FEBRUARY, 29).nativeUtc.getTime());
	});

	it("should return the same date instance when adding null period", () => {
		expect(NULL_PERIOD.addToDate(date, 0)).equal(date);
		expect(NULL_PERIOD.addToDate(date, 1)).equal(date);
		expect(NULL_PERIOD.addToDate(date, -1)).equal(date);
		expect(NULL_PERIOD.addToDate(date, 100)).equal(date);
		expect(DAY_PERIOD.addToDate(date, 0)).equal(date);
		expect(WEEK_PERIOD.addToDate(date, 0)).equal(date);
		expect(MONTH_PERIOD.addToDate(date, 0)).equal(date);
		expect(QUARTER_PERIOD.addToDate(date, 0)).equal(date);
		expect(YEAR_PERIOD.addToDate(date, 0)).equal(date);
		expect(day5.addToDate(date, 0)).equal(date);
		expect(week5.addToDate(date, 0)).equal(date);
		expect(month5.addToDate(date, 0)).equal(date);
		expect(quarter5.addToDate(date, 0)).equal(date);
		expect(year5.addToDate(date, 0)).equal(date);
	});

	it("should return null period when multiplying by 0", () => {
		expect(NULL_PERIOD.multiply(5)).equal(NULL_PERIOD);
		expect(DAY_PERIOD.multiply(0)).equal(NULL_PERIOD);
	});

	it("should return itself when multiplying by 1", () => {
		expect(DAY_PERIOD.multiply(1)).equal(DAY_PERIOD);
		expect(WEEK_PERIOD.multiply(1)).equal(WEEK_PERIOD);
	});

	it("should return 0 between equal dates", () => {
		expect(DAY_PERIOD.between(date, date)).equal(0);
		expect(WEEK_PERIOD.between(date, date)).equal(0);
		expect(MONTH_PERIOD.between(date, date)).equal(0);
		expect(QUARTER_PERIOD.between(date, date)).equal(0);
		expect(YEAR_PERIOD.between(date, date)).equal(0);
		expect(day5.between(date, date)).equal(0);
		expect(week5.between(date, date)).equal(0);
		expect(month5.between(date, date)).equal(0);
		expect(quarter5.between(date, date)).equal(0);
		expect(year5.between(date, date)).equal(0);
	});

	it("should return proper value between two dates", () => {
		expect(DAY_PERIOD.between(date, future)).equal(365 + 366 + 26 + 31 + 2);
		expect(WEEK_PERIOD.between(date, future)).equal(Math.floor((365 + 366 + 26 + 31 + 2) / 7));
		expect(MONTH_PERIOD.between(date, future)).equal(25);
		expect(QUARTER_PERIOD.between(date, future)).equal(8);
		expect(YEAR_PERIOD.between(date, future)).equal(2);
		expect(day5.between(date, future)).equal(Math.floor((365 + 366 + 26 + 31 + 2) / 5));
		expect(week5.between(date, future)).equal(Math.floor((365 + 366 + 26 + 31 + 2) / 35));
		expect(month5.between(date, future)).equal(5);
		expect(quarter5.between(date, future)).equal(1);
		expect(year5.between(date, future)).equal(0);
	});

	it("should return negative value between two reverse dates", () => {
		expect(DAY_PERIOD.between(future, date)).equal(-(365 + 366 + 26 + 31 + 2));
		expect(WEEK_PERIOD.between(future, date)).equal(-Math.floor((365 + 366 + 26 + 31 + 2) / 7));
		expect(MONTH_PERIOD.between(future, date)).equal(-25);
		expect(QUARTER_PERIOD.between(future, date)).equal(-8);
		expect(YEAR_PERIOD.between(future, date)).equal(-2);
		expect(day5.between(future, date)).equal(-Math.floor((365 + 366 + 26 + 31 + 2) / 5));
		expect(week5.between(future, date)).equal(-Math.floor((365 + 366 + 26 + 31 + 2) / 35));
		expect(month5.between(future, date)).equal(-5);
		expect(quarter5.between(future, date)).equal(-1);
		expect(year5.between(future, date)).equal(0);
	});

	it("should return negative value between two dates for negative periods", () => {
		expect(DAY_PERIOD.multiply(-1).between(date, future)).equal(-(365 + 366 + 26 + 31 + 2));
		expect(WEEK_PERIOD.multiply(-1).between(date, future)).equal(-Math.floor((365 + 366 + 26 + 31 + 2) / 7));
		expect(MONTH_PERIOD.multiply(-1).between(date, future)).equal(-25);
		expect(QUARTER_PERIOD.multiply(-1).between(date, future)).equal(-8);
		expect(YEAR_PERIOD.multiply(-1).between(date, future)).equal(-2);
		expect(day5.multiply(-1).between(date, future)).equal(-Math.floor((365 + 366 + 26 + 31 + 2) / 5));
		expect(week5.multiply(-1).between(date, future)).equal(-Math.floor((365 + 366 + 26 + 31 + 2) / 35));
		expect(month5.multiply(-1).between(date, future)).equal(-5);
		expect(quarter5.multiply(-1).between(date, future)).equal(-1);
		expect(year5.multiply(-1).between(date, future)).equal(0);
	});

	it("should return full value between two dates", () => {
		expect(YEAR_PERIOD.between(date, LocalDate.of(2023, MARCH, 31))).equal(3);
	});

	it("should return NaN between two dates for null period", () => {
		expect(NULL_PERIOD.between(date, date)).NaN;
		expect(NULL_PERIOD.between(date, future)).NaN;
	});
});
