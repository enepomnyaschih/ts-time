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

import {FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY} from "../../dist/src/DayOfWeek";
import {AD, BC} from "../../dist/src/Era";
import LocalDate, {EPOCH_DATE} from "../../dist/src/LocalDate";
import LocalTime, {MIDNIGHT, NOON} from "../../dist/src/LocalTime";
import {
	APRIL,
	AUGUST,
	DECEMBER,
	FEBRUARY,
	JANUARY,
	JULY,
	JUNE,
	MARCH,
	MAY,
	NOVEMBER,
	OCTOBER,
	SEPTEMBER
} from "../../dist/src/Month";
import Period, {
	DAY_PERIOD,
	MONTH_PERIOD,
	NULL_PERIOD,
	QUARTER_PERIOD,
	WEEK_PERIOD,
	YEAR_PERIOD
} from "../../dist/src/Period";

// TODO: Add out of bounds tests (e.g. constructors)
// TODO: Add numeric month/weekday tests
describe("LocalDate", () => {
	const july5 = LocalDate.of(2019, JULY, 5);

	it("should return proper year", () => {
		expect(july5.year).toBe(2019);
		expect(LocalDate.of(2019, JANUARY, 1).year).toBe(2019);
		expect(LocalDate.of(2018, DECEMBER, 31).year).toBe(2018);
		expect(LocalDate.of(2018, JANUARY, 1).year).toBe(2018);
		expect(LocalDate.of(2017, DECEMBER, 31).year).toBe(2017);
	});

	it("should return proper month", () => {
		expect(july5.month).toBe(JULY);
		expect(LocalDate.of(2019, JULY, 1).month).toBe(JULY);
		expect(LocalDate.of(2019, JUNE, 30).month).toBe(JUNE);
		expect(LocalDate.of(2019, JANUARY, 1).month).toBe(JANUARY);
		expect(LocalDate.of(2018, DECEMBER, 31).month).toBe(DECEMBER);
	});

	it("should return proper day of week", () => {
		expect(july5.dayOfWeek).toBe(FRIDAY);
		expect(LocalDate.of(2019, JULY, 1).dayOfWeek).toBe(MONDAY);
		expect(LocalDate.of(2019, JUNE, 30).dayOfWeek).toBe(SUNDAY);
		expect(LocalDate.of(2019, JUNE, 29).dayOfWeek).toBe(SATURDAY);
		expect(LocalDate.of(2019, JUNE, 28).dayOfWeek).toBe(FRIDAY);
		expect(LocalDate.of(2019, JUNE, 27).dayOfWeek).toBe(THURSDAY);
		expect(LocalDate.of(2019, JUNE, 26).dayOfWeek).toBe(WEDNESDAY);
		expect(LocalDate.of(2019, JUNE, 25).dayOfWeek).toBe(TUESDAY);
		expect(LocalDate.of(2019, JUNE, 24).dayOfWeek).toBe(MONDAY);
		expect(LocalDate.of(2019, JUNE, 3).dayOfWeek).toBe(MONDAY);
		expect(LocalDate.of(2019, JUNE, 2).dayOfWeek).toBe(SUNDAY);
		expect(LocalDate.of(2019, JUNE, 1).dayOfWeek).toBe(SATURDAY);
		expect(LocalDate.of(2019, MAY, 31).dayOfWeek).toBe(FRIDAY);
	});

	it("should return proper day of month", () => {
		expect(july5.dayOfMonth).toBe(5);
		expect(LocalDate.of(2019, JULY, 1).dayOfMonth).toBe(1);
		expect(LocalDate.of(2019, JUNE, 30).dayOfMonth).toBe(30);
		expect(LocalDate.of(2019, JUNE, 1).dayOfMonth).toBe(1);
		expect(LocalDate.of(2019, MAY, 31).dayOfMonth).toBe(31);
	});

	it("should return proper day of year", () => {
		expect(july5.dayOfYear).toBe(31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(LocalDate.of(2019, JANUARY, 1).dayOfYear).toBe(1);
		expect(LocalDate.of(2018, DECEMBER, 31).dayOfYear).toBe(365);
		expect(LocalDate.of(2017, JANUARY, 1).dayOfYear).toBe(1);
		expect(LocalDate.of(2016, DECEMBER, 31).dayOfYear).toBe(366);
	});

	it("should return proper epoch day", () => {
		expect(july5.epochDay).toBe(365 * 49 + 12 + july5.dayOfYear);
		expect(LocalDate.of(1970, JANUARY, 1).epochDay).toBe(1);
		expect(LocalDate.of(1970, DECEMBER, 31).epochDay).toBe(365);
		expect(LocalDate.of(1971, JANUARY, 1).epochDay).toBe(366);
		expect(LocalDate.of(1971, DECEMBER, 31).epochDay).toBe(365 + 365);
		expect(LocalDate.of(1972, JANUARY, 1).epochDay).toBe(365 + 365 + 1);
		expect(LocalDate.of(1972, DECEMBER, 31).epochDay).toBe(365 + 365 + 366);
		expect(LocalDate.of(1973, JANUARY, 1).epochDay).toBe(365 + 365 + 366 + 1);
		expect(LocalDate.of(1969, DECEMBER, 31).epochDay).toBe(0);
		expect(LocalDate.of(1969, DECEMBER, 30).epochDay).toBe(-1);
		expect(LocalDate.of(1969, DECEMBER, 29).epochDay).toBe(-2);
	});

	it("should return proper leap year flag", () => {
		expect(july5.isLeapYear).toBe(false);
		expect(LocalDate.of(0, SEPTEMBER, 12).isLeapYear).toBe(true);
		expect(LocalDate.of(1, OCTOBER, 15).isLeapYear).toBe(false);
		expect(LocalDate.of(2, MARCH, 30).isLeapYear).toBe(false);
		expect(LocalDate.of(3, JANUARY, 16).isLeapYear).toBe(false);
		expect(LocalDate.of(4, DECEMBER, 20).isLeapYear).toBe(true);
		expect(LocalDate.of(5, JULY, 1).isLeapYear).toBe(false);
		expect(LocalDate.of(6, JUNE, 5).isLeapYear).toBe(false);
		expect(LocalDate.of(7, FEBRUARY, 10).isLeapYear).toBe(false);
		expect(LocalDate.of(8, JANUARY, 7).isLeapYear).toBe(true);
		expect(LocalDate.of(100, NOVEMBER, 2).isLeapYear).toBe(false);
		expect(LocalDate.of(200, AUGUST, 8).isLeapYear).toBe(false);
		expect(LocalDate.of(300, MAY, 9).isLeapYear).toBe(false);
		expect(LocalDate.of(400, JANUARY, 12).isLeapYear).toBe(true);
		expect(LocalDate.of(2000, JANUARY, 1).isLeapYear).toBe(true);
		expect(LocalDate.of(2001, JANUARY, 1).isLeapYear).toBe(false);
		expect(LocalDate.of(2002, JANUARY, 1).isLeapYear).toBe(false);
		expect(LocalDate.of(2003, JANUARY, 1).isLeapYear).toBe(false);
		expect(LocalDate.of(2004, JANUARY, 1).isLeapYear).toBe(true);
		expect(LocalDate.of(-1, JANUARY, 1).isLeapYear).toBe(false);
		expect(LocalDate.of(-2, JANUARY, 1).isLeapYear).toBe(false);
		expect(LocalDate.of(-3, JANUARY, 1).isLeapYear).toBe(false);
		expect(LocalDate.of(-4, JANUARY, 1).isLeapYear).toBe(true);
		expect(LocalDate.of(-100, JANUARY, 1).isLeapYear).toBe(false);
		expect(LocalDate.of(-200, JANUARY, 1).isLeapYear).toBe(false);
		expect(LocalDate.of(-300, JANUARY, 1).isLeapYear).toBe(false);
		expect(LocalDate.of(-400, JANUARY, 1).isLeapYear).toBe(true);
	});

	it("should return proper length of year", () => {
		expect(july5.lengthOfYear).toBe(365);
		expect(LocalDate.of(0, SEPTEMBER, 12).lengthOfYear).toBe(366);
		expect(LocalDate.of(1, OCTOBER, 15).lengthOfYear).toBe(365);
		expect(LocalDate.of(2, MARCH, 30).lengthOfYear).toBe(365);
		expect(LocalDate.of(3, JANUARY, 16).lengthOfYear).toBe(365);
		expect(LocalDate.of(4, DECEMBER, 20).lengthOfYear).toBe(366);
		expect(LocalDate.of(5, JULY, 1).lengthOfYear).toBe(365);
		expect(LocalDate.of(6, JUNE, 5).lengthOfYear).toBe(365);
		expect(LocalDate.of(7, FEBRUARY, 10).lengthOfYear).toBe(365);
		expect(LocalDate.of(8, JANUARY, 7).lengthOfYear).toBe(366);
		expect(LocalDate.of(100, NOVEMBER, 2).lengthOfYear).toBe(365);
		expect(LocalDate.of(200, AUGUST, 8).lengthOfYear).toBe(365);
		expect(LocalDate.of(300, MAY, 9).lengthOfYear).toBe(365);
		expect(LocalDate.of(400, JANUARY, 12).lengthOfYear).toBe(366);
		expect(LocalDate.of(2000, JANUARY, 1).lengthOfYear).toBe(366);
		expect(LocalDate.of(2001, JANUARY, 1).lengthOfYear).toBe(365);
		expect(LocalDate.of(2002, JANUARY, 1).lengthOfYear).toBe(365);
		expect(LocalDate.of(2003, JANUARY, 1).lengthOfYear).toBe(365);
		expect(LocalDate.of(2004, JANUARY, 1).lengthOfYear).toBe(366);
		expect(LocalDate.of(-1, JANUARY, 1).lengthOfYear).toBe(365);
		expect(LocalDate.of(-2, JANUARY, 1).lengthOfYear).toBe(365);
		expect(LocalDate.of(-3, JANUARY, 1).lengthOfYear).toBe(365);
		expect(LocalDate.of(-4, JANUARY, 1).lengthOfYear).toBe(366);
		expect(LocalDate.of(-100, JANUARY, 1).lengthOfYear).toBe(365);
		expect(LocalDate.of(-200, JANUARY, 1).lengthOfYear).toBe(365);
		expect(LocalDate.of(-300, JANUARY, 1).lengthOfYear).toBe(365);
		expect(LocalDate.of(-400, JANUARY, 1).lengthOfYear).toBe(366);
	});

	it("should return proper native UTC date", () => {
		expect(july5.nativeUtc).toEqual(new Date(Date.UTC(2019, 6, 5)));

		const date = new Date(Date.UTC(0, 0, 1));
		date.setUTCFullYear(0);
		expect(LocalDate.of(0, JANUARY, 1).nativeUtc).toEqual(date);
		expect(LocalDate.of(2014, DECEMBER, 31).nativeUtc).toEqual(new Date(Date.UTC(2014, 11, 31)));
	});

	// Note: This test is environment-dependent, as local time zone may differ
	it("should return proper native local date", () => {
		expect(july5.nativeLocal).toEqual(new Date(2019, 6, 5));
		expect(LocalDate.of(0, JANUARY, 1).nativeLocal).toEqual(new Date(0, 0, 1));
		expect(LocalDate.of(2014, DECEMBER, 31).nativeLocal).toEqual(new Date(2014, 11, 31));
	});

	it("should return proper quarter of year", () => {
		expect(july5.quarterOfYear).toBe(3);
		expect(LocalDate.of(2016, JANUARY, 1).quarterOfYear).toBe(1);
		expect(LocalDate.of(2016, MARCH, 31).quarterOfYear).toBe(1);
		expect(LocalDate.of(2016, APRIL, 1).quarterOfYear).toBe(2);
		expect(LocalDate.of(2016, JUNE, 30).quarterOfYear).toBe(2);
		expect(LocalDate.of(2016, JULY, 1).quarterOfYear).toBe(3);
		expect(LocalDate.of(2016, SEPTEMBER, 30).quarterOfYear).toBe(3);
		expect(LocalDate.of(2016, OCTOBER, 1).quarterOfYear).toBe(4);
		expect(LocalDate.of(2016, DECEMBER, 31).quarterOfYear).toBe(4);
		expect(LocalDate.of(2017, JANUARY, 1).quarterOfYear).toBe(1);
	});

	it("should return week based fields", () => {
		expect(july5.dayOfWeek).toBe(FRIDAY);
		expect(july5.dayOfWeekBasedYear).toBe(1 + 31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(july5.weekBasedYear).toBe(2019);
		expect(july5.weekOfWeekBasedYear).toBe(27);

		const date1 = LocalDate.of(2018, JANUARY, 1);
		expect(date1.dayOfWeek).toBe(MONDAY);
		expect(date1.weekBasedYear).toBe(2018);
		expect(date1.weekOfWeekBasedYear).toBe(1);
		expect(date1.dayOfWeekBasedYear).toBe(1);

		const date2 = LocalDate.of(2017, DECEMBER, 31);
		expect(date2.dayOfWeek).toBe(SUNDAY);
		expect(date2.weekBasedYear).toBe(2017);
		expect(date2.weekOfWeekBasedYear).toBe(52);
		expect(date2.dayOfWeekBasedYear).toBe(364);

		const date3 = LocalDate.of(2017, JANUARY, 2);
		expect(date3.dayOfWeek).toBe(MONDAY);
		expect(date3.weekBasedYear).toBe(2017);
		expect(date3.weekOfWeekBasedYear).toBe(1);
		expect(date3.dayOfWeekBasedYear).toBe(1);

		const date4 = LocalDate.of(2017, JANUARY, 1);
		expect(date4.dayOfWeek).toBe(SUNDAY);
		expect(date4.weekBasedYear).toBe(2016);
		expect(date4.weekOfWeekBasedYear).toBe(52);
		expect(date4.dayOfWeekBasedYear).toBe(364);

		const date5 = LocalDate.of(2016, DECEMBER, 31);
		expect(date5.dayOfWeek).toBe(SATURDAY);
		expect(date5.weekBasedYear).toBe(2016);
		expect(date5.weekOfWeekBasedYear).toBe(52);
		expect(date5.dayOfWeekBasedYear).toBe(363);

		const date6 = LocalDate.of(2016, JANUARY, 4);
		expect(date6.dayOfWeek).toBe(MONDAY);
		expect(date6.weekBasedYear).toBe(2016);
		expect(date6.weekOfWeekBasedYear).toBe(1);
		expect(date6.dayOfWeekBasedYear).toBe(1);

		const date7 = LocalDate.of(2016, JANUARY, 3);
		expect(date7.dayOfWeek).toBe(SUNDAY);
		expect(date7.weekBasedYear).toBe(2015);
		expect(date7.weekOfWeekBasedYear).toBe(53);
		expect(date7.dayOfWeekBasedYear).toBe(371);

		const date8 = LocalDate.of(2014, DECEMBER, 29);
		expect(date8.dayOfWeek).toBe(MONDAY);
		expect(date8.weekBasedYear).toBe(2015);
		expect(date8.weekOfWeekBasedYear).toBe(1);
		expect(date8.dayOfWeekBasedYear).toBe(1);

		const date9 = LocalDate.of(2014, DECEMBER, 28);
		expect(date9.dayOfWeek).toBe(SUNDAY);
		expect(date9.weekBasedYear).toBe(2014);
		expect(date9.weekOfWeekBasedYear).toBe(52);
		expect(date9.dayOfWeekBasedYear).toBe(364);
	});

	it("should provide epoch date", () => {
		expect(EPOCH_DATE.year).toBe(1970);
		expect(EPOCH_DATE.month).toBe(JANUARY);
		expect(EPOCH_DATE.dayOfYear).toBe(1);
	});

	it("should construct from epoch day", () => {
		const date = LocalDate.ofEpochDay(1000); // 365 + 365 + (31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 26)
		expect(date.year).toBe(1972);
		expect(date.month).toBe(SEPTEMBER);
		expect(date.dayOfMonth).toBe(26);
		expect(date.epochDay).toBe(1000);

		expect(LocalDate.ofEpochDay(1).epochDay).toBe(1);
		expect(LocalDate.ofEpochDay(0).epochDay).toBe(0);
		expect(LocalDate.ofEpochDay(-1).epochDay).toBe(-1);
		expect(LocalDate.ofEpochDay(1000).epochDay).toBe(1000);
		expect(LocalDate.ofEpochDay(-1000).epochDay).toBe(-1000);
		expect(LocalDate.ofEpochDay(100000).epochDay).toBe(100000);
	});

	it("should construct from year day", () => {
		expect(LocalDate.ofYearDay(2018, 1).nativeUtc).toEqual(LocalDate.of(2018, JANUARY, 1).nativeUtc);
		expect(LocalDate.ofYearDay(2017, 365).nativeUtc).toEqual(LocalDate.of(2017, DECEMBER, 31).nativeUtc);
		expect(LocalDate.ofYearDay(2017, 1).nativeUtc).toEqual(LocalDate.of(2017, JANUARY, 1).nativeUtc);
		expect(LocalDate.ofYearDay(2016, 366).nativeUtc).toEqual(LocalDate.of(2016, DECEMBER, 31).nativeUtc);
		expect(LocalDate.ofYearDay(2016, 1).nativeUtc).toEqual(LocalDate.of(2016, JANUARY, 1).nativeUtc);
		expect(LocalDate.ofYearDay(2015, 365).nativeUtc).toEqual(LocalDate.of(2015, DECEMBER, 31).nativeUtc);
		expect(LocalDate.ofYearDay(2015, 1).nativeUtc).toEqual(LocalDate.of(2015, JANUARY, 1).nativeUtc);
		expect(LocalDate.ofYearDay(2014, 365).nativeUtc).toEqual(LocalDate.of(2014, DECEMBER, 31).nativeUtc);
	});

	it("should construct from week", () => {
		expect(LocalDate.ofWeek(2018, 1, MONDAY).nativeUtc).toEqual(LocalDate.of(2018, JANUARY, 1).nativeUtc);
		expect(LocalDate.ofWeek(2017, 52, SUNDAY).nativeUtc).toEqual(LocalDate.of(2017, DECEMBER, 31).nativeUtc);
		expect(LocalDate.ofWeek(2017, 1, MONDAY).nativeUtc).toEqual(LocalDate.of(2017, JANUARY, 2).nativeUtc);
		expect(LocalDate.ofWeek(2016, 52, SUNDAY).nativeUtc).toEqual(LocalDate.of(2017, JANUARY, 1).nativeUtc);
		expect(LocalDate.ofWeek(2016, 52, SATURDAY).nativeUtc).toEqual(LocalDate.of(2016, DECEMBER, 31).nativeUtc);
		expect(LocalDate.ofWeek(2016, 1, MONDAY).nativeUtc).toEqual(LocalDate.of(2016, JANUARY, 4).nativeUtc);
		expect(LocalDate.ofWeek(2015, 53, SUNDAY).nativeUtc).toEqual(LocalDate.of(2016, JANUARY, 3).nativeUtc);
		expect(LocalDate.ofWeek(2015, 1, MONDAY).nativeUtc).toEqual(LocalDate.of(2014, DECEMBER, 29).nativeUtc);
		expect(LocalDate.ofWeek(2014, 52, SUNDAY).nativeUtc).toEqual(LocalDate.of(2014, DECEMBER, 28).nativeUtc);
	});

	it("should construct from week based year day", () => {
		expect(LocalDate.ofWeekBasedYearDay(2018, 1).nativeUtc).toEqual(LocalDate.of(2018, JANUARY, 1).nativeUtc);
		expect(LocalDate.ofWeekBasedYearDay(2017, 364).nativeUtc).toEqual(LocalDate.of(2017, DECEMBER, 31).nativeUtc);
		expect(LocalDate.ofWeekBasedYearDay(2017, 1).nativeUtc).toEqual(LocalDate.of(2017, JANUARY, 2).nativeUtc);
		expect(LocalDate.ofWeekBasedYearDay(2016, 364).nativeUtc).toEqual(LocalDate.of(2017, JANUARY, 1).nativeUtc);
		expect(LocalDate.ofWeekBasedYearDay(2016, 363).nativeUtc).toEqual(LocalDate.of(2016, DECEMBER, 31).nativeUtc);
		expect(LocalDate.ofWeekBasedYearDay(2016, 1).nativeUtc).toEqual(LocalDate.of(2016, JANUARY, 4).nativeUtc);
		expect(LocalDate.ofWeekBasedYearDay(2015, 371).nativeUtc).toEqual(LocalDate.of(2016, JANUARY, 3).nativeUtc);
		expect(LocalDate.ofWeekBasedYearDay(2015, 1).nativeUtc).toEqual(LocalDate.of(2014, DECEMBER, 29).nativeUtc);
		expect(LocalDate.ofWeekBasedYearDay(2014, 364).nativeUtc).toEqual(LocalDate.of(2014, DECEMBER, 28).nativeUtc);
	});

	// Note: This test is environment-dependent, as local time zone may differ
	it("should construct from native local", () => {
		expect(LocalDate.fromNativeLocal(new Date(2019, 6, 5))).toEqual(LocalDate.of(2019, JULY, 5));
	});

	it("should construct from native UTC", () => {
		expect(LocalDate.fromNativeUtc(new Date(Date.UTC(2019, 6, 5)))).toEqual(LocalDate.of(2019, JULY, 5));
	});

	it("should construct from string", () => {
		expect(LocalDate.parse("2019-07-05")).toEqual(LocalDate.of(2019, JULY, 5));
	});

	it("should support two eras", () => {
		expect(july5.yearOfEra).toBe(2019);
		expect(july5.era).toBe(AD);

		const date1 = LocalDate.of(1, JANUARY, 1);
		expect(date1.year).toBe(1);
		expect(date1.yearOfEra).toBe(1);
		expect(date1.era).toBe(AD);
		expect(date1.month).toBe(JANUARY);
		expect(date1.dayOfMonth).toBe(1);

		const date2 = LocalDate.of(0, DECEMBER, 31);
		expect(date2.year).toBe(0);
		expect(date2.yearOfEra).toBe(0);
		expect(date2.era).toBe(BC);
		expect(date2.month).toBe(DECEMBER);
		expect(date2.dayOfMonth).toBe(31);

		const date3 = LocalDate.of(0, JANUARY, 1);
		expect(date3.year).toBe(0);
		expect(date3.yearOfEra).toBe(0);
		expect(date3.era).toBe(BC);
		expect(date3.month).toBe(JANUARY);
		expect(date3.dayOfMonth).toBe(1);

		const date4 = LocalDate.of(-1, DECEMBER, 31);
		expect(date4.year).toBe(-1);
		expect(date4.yearOfEra).toBe(1);
		expect(date4.era).toBe(BC);
		expect(date4.month).toBe(DECEMBER);
		expect(date4.dayOfMonth).toBe(31);

		const date5 = LocalDate.of(-1, JANUARY, 1);
		expect(date5.year).toBe(-1);
		expect(date5.yearOfEra).toBe(1);
		expect(date5.era).toBe(BC);
		expect(date5.month).toBe(JANUARY);
		expect(date5.dayOfMonth).toBe(1);
	});

	it("should compare itself", () => {
		expect(july5.compareTo(LocalDate.of(2018, SEPTEMBER, 10))).toBeGreaterThan(0);
		expect(july5.compareTo(LocalDate.of(2019, JUNE, 10))).toBeGreaterThan(0);
		expect(july5.compareTo(LocalDate.of(2019, JULY, 3))).toBeGreaterThan(0);
		expect(july5.compareTo(LocalDate.of(2019, JULY, 4))).toBeGreaterThan(0);
		expect(july5.compareTo(LocalDate.of(2019, JULY, 5))).toBe(0);
		expect(july5.compareTo(july5)).toBe(0);
		expect(july5.compareTo(LocalDate.of(2019, JULY, 6))).toBeLessThan(0);
		expect(july5.compareTo(LocalDate.of(2019, JULY, 7))).toBeLessThan(0);
		expect(july5.compareTo(LocalDate.of(2019, AUGUST, 1))).toBeLessThan(0);
		expect(july5.compareTo(LocalDate.of(2020, FEBRUARY, 1))).toBeLessThan(0);
	});

	it("should compare itself statically", () => {
		expect(LocalDate.compare(july5, LocalDate.of(2018, SEPTEMBER, 10))).toBeGreaterThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JUNE, 10))).toBeGreaterThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JULY, 3))).toBeGreaterThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JULY, 4))).toBeGreaterThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JULY, 5))).toBe(0);
		expect(LocalDate.compare(july5, july5)).toBe(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JULY, 6))).toBeLessThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JULY, 7))).toBeLessThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, AUGUST, 1))).toBeLessThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2020, FEBRUARY, 1))).toBeLessThan(0);
	});

	it("should compare itself with null", () => {
		expect(july5.compareTo(null)).toBeGreaterThan(0);
		expect(LocalDate.compare(july5, null)).toBeGreaterThan(0);
		expect(LocalDate.compare(null, july5)).toBeLessThan(0);
		expect(LocalDate.compare(null, null)).toBe(0);
	});

	it("should check itself for equality", () => {
		expect(july5.equals(LocalDate.of(2018, SEPTEMBER, 10))).toBe(false);
		expect(july5.equals(LocalDate.of(2019, JULY, 10))).toBe(false);
		expect(july5.equals(LocalDate.of(2019, JUNE, 5))).toBe(false);
		expect(july5.equals(LocalDate.of(2018, JULY, 5))).toBe(false);
		expect(july5.equals(LocalDate.of(2019, JULY, 5))).toBe(true);
		expect(july5.equals(july5)).toBe(true);
	});

	it("should check itself for equality statically", () => {
		expect(LocalDate.equal(july5, LocalDate.of(2018, SEPTEMBER, 10))).toBe(false);
		expect(LocalDate.equal(july5, LocalDate.of(2019, JULY, 10))).toBe(false);
		expect(LocalDate.equal(july5, LocalDate.of(2019, JUNE, 5))).toBe(false);
		expect(LocalDate.equal(july5, LocalDate.of(2018, JULY, 5))).toBe(false);
		expect(LocalDate.equal(july5, LocalDate.of(2019, JULY, 5))).toBe(true);
		expect(LocalDate.equal(july5, july5)).toBe(true);
	});

	it("should check itself for equality with null", () => {
		expect(july5.equals(null)).toBe(false);
		expect(LocalDate.equal(july5, null)).toBe(false);
		expect(LocalDate.equal(null, july5)).toBe(false);
		expect(LocalDate.equal(null, null)).toBe(true);
	});

	it("should compare itself with isBefore method", () => {
		expect(july5.isBefore(LocalDate.of(2018, SEPTEMBER, 10))).toBe(false);
		expect(july5.isBefore(LocalDate.of(2019, JUNE, 10))).toBe(false);
		expect(july5.isBefore(LocalDate.of(2019, JULY, 3))).toBe(false);
		expect(july5.isBefore(LocalDate.of(2019, JULY, 4))).toBe(false);
		expect(july5.isBefore(LocalDate.of(2019, JULY, 5))).toBe(false);
		expect(july5.isBefore(july5)).toBe(false);
		expect(july5.isBefore(LocalDate.of(2019, JULY, 6))).toBe(true);
		expect(july5.isBefore(LocalDate.of(2019, JULY, 7))).toBe(true);
		expect(july5.isBefore(LocalDate.of(2019, AUGUST, 1))).toBe(true);
		expect(july5.isBefore(LocalDate.of(2020, FEBRUARY, 1))).toBe(true);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(LocalDate.isBefore(july5, LocalDate.of(2018, SEPTEMBER, 10))).toBe(false);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JUNE, 10))).toBe(false);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JULY, 3))).toBe(false);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JULY, 4))).toBe(false);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JULY, 5))).toBe(false);
		expect(LocalDate.isBefore(july5, july5)).toBe(false);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JULY, 6))).toBe(true);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JULY, 7))).toBe(true);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, AUGUST, 1))).toBe(true);
		expect(LocalDate.isBefore(july5, LocalDate.of(2020, FEBRUARY, 1))).toBe(true);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(july5.isBefore(null)).toBe(false);
		expect(LocalDate.isBefore(july5, null)).toBe(false);
		expect(LocalDate.isBefore(null, july5)).toBe(true);
		expect(LocalDate.isBefore(null, null)).toBe(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(july5.isAfter(LocalDate.of(2018, SEPTEMBER, 10))).toBe(true);
		expect(july5.isAfter(LocalDate.of(2019, JUNE, 10))).toBe(true);
		expect(july5.isAfter(LocalDate.of(2019, JULY, 3))).toBe(true);
		expect(july5.isAfter(LocalDate.of(2019, JULY, 4))).toBe(true);
		expect(july5.isAfter(LocalDate.of(2019, JULY, 5))).toBe(false);
		expect(july5.isAfter(july5)).toBe(false);
		expect(july5.isAfter(LocalDate.of(2019, JULY, 6))).toBe(false);
		expect(july5.isAfter(LocalDate.of(2019, JULY, 7))).toBe(false);
		expect(july5.isAfter(LocalDate.of(2019, AUGUST, 1))).toBe(false);
		expect(july5.isAfter(LocalDate.of(2020, FEBRUARY, 1))).toBe(false);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(LocalDate.isAfter(july5, LocalDate.of(2018, SEPTEMBER, 10))).toBe(true);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JUNE, 10))).toBe(true);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JULY, 3))).toBe(true);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JULY, 4))).toBe(true);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JULY, 5))).toBe(false);
		expect(LocalDate.isAfter(july5, july5)).toBe(false);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JULY, 6))).toBe(false);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JULY, 7))).toBe(false);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, AUGUST, 1))).toBe(false);
		expect(LocalDate.isAfter(july5, LocalDate.of(2020, FEBRUARY, 1))).toBe(false);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(july5.isAfter(null)).toBe(true);
		expect(LocalDate.isAfter(july5, null)).toBe(true);
		expect(LocalDate.isAfter(null, july5)).toBe(false);
		expect(LocalDate.isAfter(null, null)).toBe(false);
	});

	it("should create proper start of day (atStartOfDay)", () => {
		expect(july5.atStartOfDay.nativeUtc).toEqual(new Date(Date.UTC(2019, 6, 5, 0, 0, 0, 0)));
	});

	it("should create proper moment of day (atTime)", () => {
		expect(july5.atTime(MIDNIGHT).nativeUtc).toEqual(new Date(Date.UTC(2019, 6, 5, 0, 0, 0, 0)));
		expect(july5.atTime(NOON).nativeUtc).toEqual(new Date(Date.UTC(2019, 6, 5, 12, 0, 0, 0)));
		expect(july5.atTime(LocalTime.of(1, 2, 3, 4)).nativeUtc).toEqual(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4)));
	});

	it("should add a period", () => {
		expect(july5.plus(YEAR_PERIOD).nativeUtc).toEqual(LocalDate.of(2020, JULY, 5).nativeUtc);
		expect(july5.plus(MONTH_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, AUGUST, 5).nativeUtc);
		expect(july5.plus(DAY_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, JULY, 6).nativeUtc);
		expect(july5.plus(QUARTER_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, OCTOBER, 5).nativeUtc);
		expect(july5.plus(WEEK_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, JULY, 12).nativeUtc);
	});

	it("should add zero period", () => {
		expect(july5.plus(NULL_PERIOD)).toBe(july5);
	});

	it("should add multiple periods", () => {
		expect(july5.plus(Period.ofYears(2)).nativeUtc).toEqual(LocalDate.of(2021, JULY, 5).nativeUtc);
		expect(july5.plus(Period.ofMonths(9)).nativeUtc).toEqual(LocalDate.of(2020, APRIL, 5).nativeUtc);
		expect(july5.plus(Period.ofDays(30)).nativeUtc).toEqual(LocalDate.of(2019, AUGUST, 4).nativeUtc);
		expect(july5.plus(Period.ofQuarters(3)).nativeUtc).toEqual(LocalDate.of(2020, APRIL, 5).nativeUtc);
		expect(july5.plus(Period.ofWeeks(5)).nativeUtc).toEqual(LocalDate.of(2019, AUGUST, 9).nativeUtc);
	});

	it("should add negative periods", () => {
		expect(july5.plus(Period.ofYears(-2)).nativeUtc).toEqual(LocalDate.of(2017, JULY, 5).nativeUtc);
		expect(july5.plus(Period.ofMonths(-9)).nativeUtc).toEqual(LocalDate.of(2018, OCTOBER, 5).nativeUtc);
		expect(july5.plus(Period.ofDays(-30)).nativeUtc).toEqual(LocalDate.of(2019, JUNE, 5).nativeUtc);
		expect(july5.plus(Period.ofQuarters(-3)).nativeUtc).toEqual(LocalDate.of(2018, OCTOBER, 5).nativeUtc);
		expect(july5.plus(Period.ofWeeks(-5)).nativeUtc).toEqual(LocalDate.of(2019, MAY, 31).nativeUtc);
	});

	it("should adjust the added month properly", () => {
		expect(LocalDate.of(2019, MAY, 31).plus(MONTH_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, JUNE, 30).nativeUtc);
		expect(LocalDate.of(2019, JANUARY, 31).plus(MONTH_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, FEBRUARY, 28).nativeUtc);
		expect(LocalDate.of(2020, JANUARY, 31).plus(MONTH_PERIOD).nativeUtc).toEqual(LocalDate.of(2020, FEBRUARY, 29).nativeUtc);
	});

	it("should subtract a period", () => {
		expect(july5.minus(YEAR_PERIOD).nativeUtc).toEqual(LocalDate.of(2018, JULY, 5).nativeUtc);
		expect(july5.minus(MONTH_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, JUNE, 5).nativeUtc);
		expect(july5.minus(DAY_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, JULY, 4).nativeUtc);
		expect(july5.minus(QUARTER_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, APRIL, 5).nativeUtc);
		expect(july5.minus(WEEK_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, JUNE, 28).nativeUtc);
	});

	it("should subtract zero period", () => {
		expect(july5.minus(NULL_PERIOD)).toBe(july5);
	});

	it("should subtract multiple periods", () => {
		expect(july5.minus(Period.ofYears(2)).nativeUtc).toEqual(LocalDate.of(2017, JULY, 5).nativeUtc);
		expect(july5.minus(Period.ofMonths(9)).nativeUtc).toEqual(LocalDate.of(2018, OCTOBER, 5).nativeUtc);
		expect(july5.minus(Period.ofDays(30)).nativeUtc).toEqual(LocalDate.of(2019, JUNE, 5).nativeUtc);
		expect(july5.minus(Period.ofQuarters(3)).nativeUtc).toEqual(LocalDate.of(2018, OCTOBER, 5).nativeUtc);
		expect(july5.minus(Period.ofWeeks(5)).nativeUtc).toEqual(LocalDate.of(2019, MAY, 31).nativeUtc);
	});

	it("should subtract negative periods", () => {
		expect(july5.minus(Period.ofYears(-2)).nativeUtc).toEqual(LocalDate.of(2021, JULY, 5).nativeUtc);
		expect(july5.minus(Period.ofMonths(-9)).nativeUtc).toEqual(LocalDate.of(2020, APRIL, 5).nativeUtc);
		expect(july5.minus(Period.ofDays(-30)).nativeUtc).toEqual(LocalDate.of(2019, AUGUST, 4).nativeUtc);
		expect(july5.minus(Period.ofQuarters(-3)).nativeUtc).toEqual(LocalDate.of(2020, APRIL, 5).nativeUtc);
		expect(july5.minus(Period.ofWeeks(-5)).nativeUtc).toEqual(LocalDate.of(2019, AUGUST, 9).nativeUtc);
	});

	it("should adjust the added month properly", () => {
		expect(LocalDate.of(2019, MAY, 31).minus(MONTH_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, APRIL, 30).nativeUtc);
		expect(LocalDate.of(2019, MARCH, 31).minus(MONTH_PERIOD).nativeUtc).toEqual(LocalDate.of(2019, FEBRUARY, 28).nativeUtc);
		expect(LocalDate.of(2020, MARCH, 31).minus(MONTH_PERIOD).nativeUtc).toEqual(LocalDate.of(2020, FEBRUARY, 29).nativeUtc);
	});
});
