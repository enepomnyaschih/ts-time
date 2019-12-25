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

import {MS_PER_DAY} from "../../core/src/constants";
import {FRIDAY, MONDAY, SATURDAY, SUNDAY, TUESDAY} from "../../core/src/DayOfWeek";
import Duration, {
	DAY_DURATION,
	HOUR_DURATION,
	MINUTE_DURATION,
	MS_DURATION,
	SECOND_DURATION
} from "../../core/src/Duration";
import {AD, BC} from "../../core/src/Era";
import LocalDateTime from "../../core/src/LocalDateTime";
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
} from "../../core/src/Month";
import Period, {
	DAY_PERIOD,
	MONTH_PERIOD,
	NULL_PERIOD,
	QUARTER_PERIOD,
	WEEK_PERIOD,
	YEAR_PERIOD
} from "../../core/src/Period";
import {UTC, ZoneId, ZoneOffset} from "../../core/src/Zone";

describe("LocalDateTime", () => {
	const dateTime = LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225);

	it("should return proper year", () => {
		expect(dateTime.year).toBe(2019);
		expect(LocalDateTime.ofComponents(2019, JANUARY, 1).year).toBe(2019);
		expect(LocalDateTime.ofComponents(2018, DECEMBER, 31, 23, 59, 59, 999).year).toBe(2018);
		expect(LocalDateTime.ofComponents(2018, JANUARY, 1).year).toBe(2018);
		expect(LocalDateTime.ofComponents(2017, DECEMBER, 31, 23, 59, 59, 999).year).toBe(2017);
	});

	it("should return proper month", () => {
		expect(dateTime.month).toBe(JULY);
		expect(LocalDateTime.ofComponents(2019, JULY, 1).month).toBe(JULY);
		expect(LocalDateTime.ofComponents(2019, JUNE, 30, 23, 59, 59, 999).month).toBe(JUNE);
		expect(LocalDateTime.ofComponents(2019, JANUARY, 1).month).toBe(JANUARY);
		expect(LocalDateTime.ofComponents(2018, DECEMBER, 31, 23, 59, 59, 999).month).toBe(DECEMBER);
	});

	it("should return proper day of week", () => {
		expect(dateTime.dayOfWeek).toBe(FRIDAY);
		expect(LocalDateTime.ofComponents(2019, JULY, 1).dayOfWeek).toBe(MONDAY);
		expect(LocalDateTime.ofComponents(2019, JUNE, 30).dayOfWeek).toBe(SUNDAY);
		expect(LocalDateTime.ofComponents(2019, MAY, 31).dayOfWeek).toBe(FRIDAY);
	});

	it("should return proper day of month", () => {
		expect(dateTime.dayOfMonth).toBe(5);
		expect(LocalDateTime.ofComponents(2019, JULY, 1).dayOfMonth).toBe(1);
		expect(LocalDateTime.ofComponents(2019, JUNE, 30).dayOfMonth).toBe(30);
		expect(LocalDateTime.ofComponents(2019, JUNE, 1).dayOfMonth).toBe(1);
		expect(LocalDateTime.ofComponents(2019, MAY, 31).dayOfMonth).toBe(31);
	});

	it("should return proper day of year", () => {
		expect(dateTime.dayOfYear).toBe(31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(LocalDateTime.ofComponents(2019, JANUARY, 1).dayOfYear).toBe(1);
		expect(LocalDateTime.ofComponents(2018, DECEMBER, 31).dayOfYear).toBe(365);
		expect(LocalDateTime.ofComponents(2017, JANUARY, 1).dayOfYear).toBe(1);
		expect(LocalDateTime.ofComponents(2016, DECEMBER, 31).dayOfYear).toBe(366);
	});

	it("should return proper epoch day", () => {
		expect(dateTime.epochDay).toBe(365 * 49 + 12 + dateTime.dayOfYear);
		expect(LocalDateTime.ofComponents(1970, JANUARY, 1).epochDay).toBe(1);
		expect(LocalDateTime.ofComponents(1970, DECEMBER, 31).epochDay).toBe(365);
		expect(LocalDateTime.ofComponents(1973, JANUARY, 1).epochDay).toBe(365 + 365 + 366 + 1);
		expect(LocalDateTime.ofComponents(1969, DECEMBER, 31).epochDay).toBe(0);
		expect(LocalDateTime.ofComponents(1969, DECEMBER, 29).epochDay).toBe(-2);
	});

	it("should return proper leap year flag", () => {
		expect(dateTime.isLeapYear).toBe(false);
		expect(LocalDateTime.ofComponents(0, SEPTEMBER, 12).isLeapYear).toBe(true);
		expect(LocalDateTime.ofComponents(2, MARCH, 30).isLeapYear).toBe(false);
		expect(LocalDateTime.ofComponents(4, DECEMBER, 20).isLeapYear).toBe(true);
		expect(LocalDateTime.ofComponents(300, MAY, 9).isLeapYear).toBe(false);
		expect(LocalDateTime.ofComponents(400, JANUARY, 12).isLeapYear).toBe(true);
		expect(LocalDateTime.ofComponents(2000, JANUARY, 1).isLeapYear).toBe(true);
		expect(LocalDateTime.ofComponents(2001, JANUARY, 1).isLeapYear).toBe(false);
		expect(LocalDateTime.ofComponents(-300, JANUARY, 1).isLeapYear).toBe(false);
		expect(LocalDateTime.ofComponents(-400, JANUARY, 1).isLeapYear).toBe(true);
	});

	it("should return proper length of year", () => {
		expect(dateTime.lengthOfYear).toBe(365);
		expect(LocalDateTime.ofComponents(0, SEPTEMBER, 12).lengthOfYear).toBe(366);
		expect(LocalDateTime.ofComponents(2, MARCH, 30).lengthOfYear).toBe(365);
		expect(LocalDateTime.ofComponents(4, DECEMBER, 20).lengthOfYear).toBe(366);
		expect(LocalDateTime.ofComponents(300, MAY, 9).lengthOfYear).toBe(365);
		expect(LocalDateTime.ofComponents(400, JANUARY, 12).lengthOfYear).toBe(366);
		expect(LocalDateTime.ofComponents(2000, JANUARY, 1).lengthOfYear).toBe(366);
		expect(LocalDateTime.ofComponents(2001, JANUARY, 1).lengthOfYear).toBe(365);
		expect(LocalDateTime.ofComponents(-300, JANUARY, 1).lengthOfYear).toBe(365);
		expect(LocalDateTime.ofComponents(-400, JANUARY, 1).lengthOfYear).toBe(366);
	});

	it("should return proper hour", () => {
		expect(dateTime.hour).toBe(18);
	});

	it("should return proper minute", () => {
		expect(dateTime.minute).toBe(30);
	});

	it("should return proper second", () => {
		expect(dateTime.second).toBe(15);
	});

	it("should return proper millisecond", () => {
		expect(dateTime.ms).toBe(225);
	});

	it("should return proper total millisecond", () => {
		expect(dateTime.epochMsUtc).toBe(Date.UTC(2019, 6, 5, 18, 30, 15, 225));
	});

	it("should return proper native UTC date", () => {
		expect(dateTime.nativeUtc).toEqual(new Date(Date.UTC(2019, 6, 5, 18, 30, 15, 225)));

		const date = new Date(Date.UTC(0, 0, 1));
		date.setUTCFullYear(0);
		expect(LocalDateTime.ofComponents(0, JANUARY, 1).nativeUtc).toEqual(date);
		expect(LocalDateTime.ofComponents(2014, DECEMBER, 31, 23, 59, 59, 999).nativeUtc)
			.toEqual(new Date(Date.UTC(2014, 11, 31, 23, 59, 59, 999)));
	});

	// Note: This test is environment-dependent, as local time zone may differ
	it("should return proper native local date", () => {
		expect(dateTime.nativeLocal).toEqual(new Date(2019, 6, 5, 18, 30, 15, 225));
		expect(LocalDateTime.ofComponents(0, JANUARY, 1).nativeLocal).toEqual(new Date(0, 0, 1));
		expect(LocalDateTime.ofComponents(2014, DECEMBER, 31, 23, 59, 59, 999).nativeLocal)
			.toEqual(new Date(2014, 11, 31, 23, 59, 59, 999));
	});

	it("should return proper quarter of year", () => {
		expect(dateTime.quarterOfYear).toBe(3);
		expect(LocalDateTime.ofComponents(2016, JANUARY, 1).quarterOfYear).toBe(1);
		expect(LocalDateTime.ofComponents(2016, MARCH, 31, 23, 59, 59, 999).quarterOfYear).toBe(1);
		expect(LocalDateTime.ofComponents(2016, APRIL, 1).quarterOfYear).toBe(2);
		expect(LocalDateTime.ofComponents(2016, JUNE, 30, 23, 59, 59, 999).quarterOfYear).toBe(2);
		expect(LocalDateTime.ofComponents(2016, JULY, 1).quarterOfYear).toBe(3);
		expect(LocalDateTime.ofComponents(2016, SEPTEMBER, 30, 23, 59, 59, 999).quarterOfYear).toBe(3);
		expect(LocalDateTime.ofComponents(2016, OCTOBER, 1).quarterOfYear).toBe(4);
		expect(LocalDateTime.ofComponents(2016, DECEMBER, 31, 23, 59, 59, 999).quarterOfYear).toBe(4);
		expect(LocalDateTime.ofComponents(2017, JANUARY, 1).quarterOfYear).toBe(1);
	});

	it("should return week based fields", () => {
		expect(dateTime.dayOfWeek).toBe(FRIDAY);
		expect(dateTime.dayOfWeekBasedYear).toBe(1 + 31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(dateTime.weekBasedYear).toBe(2019);
		expect(dateTime.weekOfWeekBasedYear).toBe(27);

		const date1 = LocalDateTime.ofComponents(2018, JANUARY, 1);
		expect(date1.dayOfWeek).toBe(MONDAY);
		expect(date1.weekBasedYear).toBe(2018);
		expect(date1.weekOfWeekBasedYear).toBe(1);
		expect(date1.dayOfWeekBasedYear).toBe(1);

		const date2 = LocalDateTime.ofComponents(2017, DECEMBER, 31, 23, 59, 59, 999);
		expect(date2.dayOfWeek).toBe(SUNDAY);
		expect(date2.weekBasedYear).toBe(2017);
		expect(date2.weekOfWeekBasedYear).toBe(52);
		expect(date2.dayOfWeekBasedYear).toBe(364);

		const date3 = LocalDateTime.ofComponents(2017, JANUARY, 2);
		expect(date3.dayOfWeek).toBe(MONDAY);
		expect(date3.weekBasedYear).toBe(2017);
		expect(date3.weekOfWeekBasedYear).toBe(1);
		expect(date3.dayOfWeekBasedYear).toBe(1);

		const date4 = LocalDateTime.ofComponents(2017, JANUARY, 1);
		expect(date4.dayOfWeek).toBe(SUNDAY);
		expect(date4.weekBasedYear).toBe(2016);
		expect(date4.weekOfWeekBasedYear).toBe(52);
		expect(date4.dayOfWeekBasedYear).toBe(364);

		const date5 = LocalDateTime.ofComponents(2016, DECEMBER, 31, 23, 59, 59, 999);
		expect(date5.dayOfWeek).toBe(SATURDAY);
		expect(date5.weekBasedYear).toBe(2016);
		expect(date5.weekOfWeekBasedYear).toBe(52);
		expect(date5.dayOfWeekBasedYear).toBe(363);

		const date6 = LocalDateTime.ofComponents(2016, JANUARY, 4);
		expect(date6.dayOfWeek).toBe(MONDAY);
		expect(date6.weekBasedYear).toBe(2016);
		expect(date6.weekOfWeekBasedYear).toBe(1);
		expect(date6.dayOfWeekBasedYear).toBe(1);

		const date7 = LocalDateTime.ofComponents(2016, JANUARY, 3);
		expect(date7.dayOfWeek).toBe(SUNDAY);
		expect(date7.weekBasedYear).toBe(2015);
		expect(date7.weekOfWeekBasedYear).toBe(53);
		expect(date7.dayOfWeekBasedYear).toBe(371);

		const date8 = LocalDateTime.ofComponents(2014, DECEMBER, 29);
		expect(date8.dayOfWeek).toBe(MONDAY);
		expect(date8.weekBasedYear).toBe(2015);
		expect(date8.weekOfWeekBasedYear).toBe(1);
		expect(date8.dayOfWeekBasedYear).toBe(1);

		const date9 = LocalDateTime.ofComponents(2014, DECEMBER, 28);
		expect(date9.dayOfWeek).toBe(SUNDAY);
		expect(date9.weekBasedYear).toBe(2014);
		expect(date9.weekOfWeekBasedYear).toBe(52);
		expect(date9.dayOfWeekBasedYear).toBe(364);
	});

	it("should construct from epoch ms in UTC", () => {
		const dateTime = LocalDateTime.ofEpochMsUtc(1000 * MS_PER_DAY + 66615225);
		expect(dateTime.year).toBe(1972);
		expect(dateTime.month).toBe(SEPTEMBER);
		expect(dateTime.dayOfMonth).toBe(26);
		expect(dateTime.epochDay).toBe(1000);
		expect(dateTime.hour).toBe(18);
		expect(dateTime.minute).toBe(30);
		expect(dateTime.second).toBe(15);
		expect(dateTime.ms).toBe(225);

		expect(LocalDateTime.ofEpochMsUtc(1).epochDay).toBe(0);
		expect(LocalDateTime.ofEpochMsUtc(0).epochDay).toBe(0);
		expect(LocalDateTime.ofEpochMsUtc(-1).epochDay).toBe(-1);
		expect(LocalDateTime.ofEpochMsUtc(1000).epochDay).toBe(0);
		expect(LocalDateTime.ofEpochMsUtc(-1000).epochDay).toBe(-1);
		expect(LocalDateTime.ofEpochMsUtc(100000).epochDay).toBe(0);

		expect(LocalDateTime.ofEpochMsUtc(1).time.totalMs).toBe(1);
		expect(LocalDateTime.ofEpochMsUtc(0).time.totalMs).toBe(0);
		expect(LocalDateTime.ofEpochMsUtc(-1).time.totalMs).toBe(MS_PER_DAY - 1);
		expect(LocalDateTime.ofEpochMsUtc(1000).time.totalMs).toBe(1000);
		expect(LocalDateTime.ofEpochMsUtc(-1000).time.totalMs).toBe(MS_PER_DAY - 1000);
		expect(LocalDateTime.ofEpochMsUtc(100000).time.totalMs).toBe(100000);

		expect(LocalDateTime.ofEpochMsUtc(MS_PER_DAY).epochDay).toBe(1);
		expect(LocalDateTime.ofEpochMsUtc(-MS_PER_DAY).epochDay).toBe(-1);
		expect(LocalDateTime.ofEpochMsUtc(1000 * MS_PER_DAY).epochDay).toBe(1000);
		expect(LocalDateTime.ofEpochMsUtc(-1000 * MS_PER_DAY).epochDay).toBe(-1000);
		expect(LocalDateTime.ofEpochMsUtc(100000 * MS_PER_DAY).epochDay).toBe(100000);
	});

	// Note: This test is environment-dependent, as local time zone may differ
	it("should construct from native local", () => {
		expect(LocalDateTime.fromNativeLocal(new Date(2019, 6, 5, 18, 30, 15, 225)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225).nativeUtc);
	});

	it("should return null by native local null", () => {
		expect(LocalDateTime.fromNativeLocal(null)).toBeNull(null);
	});

	it("should construct from native UTC", () => {
		expect(LocalDateTime.fromNativeUtc(new Date(Date.UTC(2019, 6, 5, 18, 30, 15, 225))).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225).nativeUtc);
	});

	it("should return null by native UTC null", () => {
		expect(LocalDateTime.fromNativeUtc(null)).toBeNull(null);
	});

	it("should construct from string", () => {
		expect(LocalDateTime.parse("2019-07-05").nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 5).nativeUtc);
		expect(LocalDateTime.parse("2019-7-5").nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 5).nativeUtc);
		expect(LocalDateTime.parse("2019-07-05T18:30").nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30).nativeUtc);
		expect(LocalDateTime.parse("2019-07-05T18:30:15").nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15).nativeUtc);
		expect(LocalDateTime.parse("2019-07-05T18:30:15.225").nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225).nativeUtc);
		expect(LocalDateTime.parse("2019-7-5T8:3:5.16").nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 5, 8, 3, 5, 16).nativeUtc);
	});

	it("should throw an error by invalid string", () => {
		expect(() => LocalDateTime.parse("abc")).toThrow(new Error("Invalid date format."));
	});

	it("should support two eras", () => {
		expect(dateTime.yearOfEra).toBe(2019);
		expect(dateTime.era).toBe(AD);

		const date1 = LocalDateTime.ofComponents(1, JANUARY, 1);
		expect(date1.year).toBe(1);
		expect(date1.yearOfEra).toBe(1);
		expect(date1.era).toBe(AD);
		expect(date1.month).toBe(JANUARY);
		expect(date1.dayOfMonth).toBe(1);
		expect(date1.hour).toBe(0);
		expect(date1.minute).toBe(0);
		expect(date1.second).toBe(0);
		expect(date1.ms).toBe(0);

		const date2 = LocalDateTime.ofComponents(0, DECEMBER, 31, 23, 59, 59, 999);
		expect(date2.year).toBe(0);
		expect(date2.yearOfEra).toBe(0);
		expect(date2.era).toBe(BC);
		expect(date2.month).toBe(DECEMBER);
		expect(date2.dayOfMonth).toBe(31);
		expect(date2.hour).toBe(23);
		expect(date2.minute).toBe(59);
		expect(date2.second).toBe(59);
		expect(date2.ms).toBe(999);

		const date3 = LocalDateTime.ofComponents(0, JANUARY, 1);
		expect(date3.year).toBe(0);
		expect(date3.yearOfEra).toBe(0);
		expect(date3.era).toBe(BC);
		expect(date3.month).toBe(JANUARY);
		expect(date3.dayOfMonth).toBe(1);
		expect(date3.hour).toBe(0);
		expect(date3.minute).toBe(0);
		expect(date3.second).toBe(0);
		expect(date3.ms).toBe(0);

		const date4 = LocalDateTime.ofComponents(-1, DECEMBER, 31, 23, 59, 59, 999);
		expect(date4.year).toBe(-1);
		expect(date4.yearOfEra).toBe(1);
		expect(date4.era).toBe(BC);
		expect(date4.month).toBe(DECEMBER);
		expect(date4.dayOfMonth).toBe(31);
		expect(date4.hour).toBe(23);
		expect(date4.minute).toBe(59);
		expect(date4.second).toBe(59);
		expect(date4.ms).toBe(999);

		const date5 = LocalDateTime.ofComponents(-1, JANUARY, 1);
		expect(date5.year).toBe(-1);
		expect(date5.yearOfEra).toBe(1);
		expect(date5.era).toBe(BC);
		expect(date5.month).toBe(JANUARY);
		expect(date5.dayOfMonth).toBe(1);
		expect(date5.hour).toBe(0);
		expect(date5.minute).toBe(0);
		expect(date5.second).toBe(0);
		expect(date5.ms).toBe(0);
	});

	it("should compare itself", () => {
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).toBeGreaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JUNE, 10))).toBeGreaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 3))).toBeGreaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 4))).toBeGreaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 5))).toBeGreaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).toBeGreaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).toBe(0);
		expect(dateTime.compareTo(dateTime)).toBe(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).toBeLessThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).toBeLessThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 6))).toBeLessThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 7))).toBeLessThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, AUGUST, 1))).toBeLessThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2020, FEBRUARY, 1))).toBeLessThan(0);
	});

	it("should compare itself statically", () => {
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).toBeGreaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JUNE, 10))).toBeGreaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 3))).toBeGreaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 4))).toBeGreaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 5))).toBeGreaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).toBeGreaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).toBe(0);
		expect(LocalDateTime.compare(dateTime, dateTime)).toBe(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).toBeLessThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).toBeLessThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 6))).toBeLessThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 7))).toBeLessThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, AUGUST, 1))).toBeLessThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2020, FEBRUARY, 1))).toBeLessThan(0);
	});

	it("should compare itself with null", () => {
		expect(dateTime.compareTo(null)).toBeGreaterThan(0);
		expect(LocalDateTime.compare(dateTime, null)).toBeGreaterThan(0);
		expect(LocalDateTime.compare(null, dateTime)).toBeLessThan(0);
		expect(LocalDateTime.compare(null, null)).toBe(0);
	});

	it("should check itself for equality", () => {
		expect(dateTime.equals(LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).toBe(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JULY, 10))).toBe(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JUNE, 5))).toBe(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2018, JULY, 5))).toBe(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JULY, 5))).toBe(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).toBe(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).toBe(true);
		expect(dateTime.equals(dateTime)).toBe(true);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).toBe(false);
	});

	it("should check itself for equality statically", () => {
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).toBe(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JULY, 10))).toBe(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JUNE, 5))).toBe(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2018, JULY, 5))).toBe(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JULY, 5))).toBe(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).toBe(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).toBe(true);
		expect(LocalDateTime.equal(dateTime, dateTime)).toBe(true);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).toBe(false);
	});

	it("should check itself for equality with null", () => {
		expect(dateTime.equals(null)).toBe(false);
		expect(LocalDateTime.equal(dateTime, null)).toBe(false);
		expect(LocalDateTime.equal(null, dateTime)).toBe(false);
		expect(LocalDateTime.equal(null, null)).toBe(true);
	});

	it("should compare itself with isBefore method", () => {
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).toBe(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JUNE, 10))).toBe(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 3))).toBe(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 4))).toBe(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 5))).toBe(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).toBe(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).toBe(false);
		expect(dateTime.isBefore(dateTime)).toBe(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).toBe(true);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).toBe(true);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 6))).toBe(true);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 7))).toBe(true);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, AUGUST, 1))).toBe(true);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2020, FEBRUARY, 1))).toBe(true);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).toBe(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JUNE, 10))).toBe(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 3))).toBe(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 4))).toBe(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 5))).toBe(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).toBe(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).toBe(false);
		expect(LocalDateTime.isBefore(dateTime, dateTime)).toBe(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).toBe(true);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).toBe(true);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 6))).toBe(true);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 7))).toBe(true);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, AUGUST, 1))).toBe(true);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2020, FEBRUARY, 1))).toBe(true);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(dateTime.isBefore(null)).toBe(false);
		expect(LocalDateTime.isBefore(dateTime, null)).toBe(false);
		expect(LocalDateTime.isBefore(null, dateTime)).toBe(true);
		expect(LocalDateTime.isBefore(null, null)).toBe(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).toBe(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JUNE, 10))).toBe(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 3))).toBe(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 4))).toBe(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 5))).toBe(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).toBe(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).toBe(false);
		expect(dateTime.isAfter(dateTime)).toBe(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).toBe(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).toBe(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 6))).toBe(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 7))).toBe(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, AUGUST, 1))).toBe(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2020, FEBRUARY, 1))).toBe(false);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).toBe(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JUNE, 10))).toBe(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 3))).toBe(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 4))).toBe(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 5))).toBe(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).toBe(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).toBe(false);
		expect(LocalDateTime.isAfter(dateTime, dateTime)).toBe(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).toBe(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).toBe(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 6))).toBe(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 7))).toBe(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, AUGUST, 1))).toBe(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2020, FEBRUARY, 1))).toBe(false);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(dateTime.isAfter(null)).toBe(true);
		expect(LocalDateTime.isAfter(dateTime, null)).toBe(true);
		expect(LocalDateTime.isAfter(null, dateTime)).toBe(false);
		expect(LocalDateTime.isAfter(null, null)).toBe(false);
	});

	it("should add a period", () => {
		expect(dateTime.plusPeriod(YEAR_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2020, JULY, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(MONTH_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, AUGUST, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(DAY_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 6, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(QUARTER_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, OCTOBER, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(WEEK_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 12, 18, 30, 15, 225).nativeUtc);
	});

	it("should add zero period", () => {
		expect(dateTime.plusPeriod(NULL_PERIOD)).toBe(dateTime);
	});

	it("should add multiple periods", () => {
		expect(dateTime.plusPeriod(Period.ofYears(2)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2021, JULY, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(Period.ofMonths(9)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2020, APRIL, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(Period.ofDays(30)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, AUGUST, 4, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(Period.ofQuarters(3)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2020, APRIL, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(Period.ofWeeks(5)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, AUGUST, 9, 18, 30, 15, 225).nativeUtc);
	});

	it("should add negative periods", () => {
		expect(dateTime.plusPeriod(Period.ofYears(-2)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2017, JULY, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(Period.ofMonths(-9)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2018, OCTOBER, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(Period.ofDays(-30)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JUNE, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(Period.ofQuarters(-3)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2018, OCTOBER, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.plusPeriod(Period.ofWeeks(-5)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225).nativeUtc);
	});

	it("should adjust the added month properly", () => {
		expect(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225).plusPeriod(MONTH_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JUNE, 30, 18, 30, 15, 225).nativeUtc);
		expect(LocalDateTime.ofComponents(2019, JANUARY, 31, 18, 30, 15, 225).plusPeriod(MONTH_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, FEBRUARY, 28, 18, 30, 15, 225).nativeUtc);
		expect(LocalDateTime.ofComponents(2020, JANUARY, 31, 18, 30, 15, 225).plusPeriod(MONTH_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2020, FEBRUARY, 29, 18, 30, 15, 225).nativeUtc);
	});

	it("should add duration", () => {
		expect(dateTime.plusDuration(MS_DURATION).toString()).toBe("2019-07-05T18:30:15.226");
		expect(dateTime.plusDuration(SECOND_DURATION).toString()).toBe("2019-07-05T18:30:16.225");
		expect(dateTime.plusDuration(MINUTE_DURATION).toString()).toBe("2019-07-05T18:31:15.225");
		expect(dateTime.plusDuration(HOUR_DURATION).toString()).toBe("2019-07-05T19:30:15.225");
		expect(dateTime.plusDuration(DAY_DURATION).toString()).toBe("2019-07-06T18:30:15.225");
		expect(dateTime.plusDuration(Duration.ofDays(5)).toString()).toBe("2019-07-10T18:30:15.225");
		expect(dateTime.plusDuration(Duration.ofDays(31)).toString()).toBe("2019-08-05T18:30:15.225");
		expect(dateTime.plusDuration(Duration.ofDays(366)).toString()).toBe("2020-07-05T18:30:15.225");
		expect(dateTime.plusDuration(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).toBe("2019-07-06T20:33:19.230");
		expect(dateTime.plusDuration(Duration.of(-1)).toString()).toBe("2019-07-05T18:30:15.224");
		expect(dateTime.plusDuration(Duration.ofDays(-365)).toString()).toBe("2018-07-05T18:30:15.225");
	});

	it("should subtract a period", () => {
		expect(dateTime.minusPeriod(YEAR_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2018, JULY, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(MONTH_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JUNE, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(DAY_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 4, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(QUARTER_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, APRIL, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(WEEK_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JUNE, 28, 18, 30, 15, 225).nativeUtc);
	});

	it("should subtract zero period", () => {
		expect(dateTime.minusPeriod(NULL_PERIOD)).toBe(dateTime);
	});

	it("should subtract multiple periods", () => {
		expect(dateTime.minusPeriod(Period.ofYears(2)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2017, JULY, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(Period.ofMonths(9)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2018, OCTOBER, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(Period.ofDays(30)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JUNE, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(Period.ofQuarters(3)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2018, OCTOBER, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(Period.ofWeeks(5)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225).nativeUtc);
	});

	it("should subtract negative periods", () => {
		expect(dateTime.minusPeriod(Period.ofYears(-2)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2021, JULY, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(Period.ofMonths(-9)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2020, APRIL, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(Period.ofDays(-30)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, AUGUST, 4, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(Period.ofQuarters(-3)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2020, APRIL, 5, 18, 30, 15, 225).nativeUtc);
		expect(dateTime.minusPeriod(Period.ofWeeks(-5)).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, AUGUST, 9, 18, 30, 15, 225).nativeUtc);
	});

	it("should adjust the subtracted month properly", () => {
		expect(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225).minusPeriod(MONTH_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, APRIL, 30, 18, 30, 15, 225).nativeUtc);
		expect(LocalDateTime.ofComponents(2019, MARCH, 31, 18, 30, 15, 225).minusPeriod(MONTH_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, FEBRUARY, 28, 18, 30, 15, 225).nativeUtc);
		expect(LocalDateTime.ofComponents(2020, MARCH, 31, 18, 30, 15, 225).minusPeriod(MONTH_PERIOD).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2020, FEBRUARY, 29, 18, 30, 15, 225).nativeUtc);
	});

	it("should subtract duration", () => {
		expect(dateTime.minusDuration(MS_DURATION).toString()).toBe("2019-07-05T18:30:15.224");
		expect(dateTime.minusDuration(SECOND_DURATION).toString()).toBe("2019-07-05T18:30:14.225");
		expect(dateTime.minusDuration(MINUTE_DURATION).toString()).toBe("2019-07-05T18:29:15.225");
		expect(dateTime.minusDuration(HOUR_DURATION).toString()).toBe("2019-07-05T17:30:15.225");
		expect(dateTime.minusDuration(DAY_DURATION).toString()).toBe("2019-07-04T18:30:15.225");
		expect(dateTime.minusDuration(Duration.ofDays(5)).toString()).toBe("2019-06-30T18:30:15.225");
		expect(dateTime.minusDuration(Duration.ofDays(30)).toString()).toBe("2019-06-05T18:30:15.225");
		expect(dateTime.minusDuration(Duration.ofDays(365)).toString()).toBe("2018-07-05T18:30:15.225");
		expect(dateTime.minusDuration(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).toBe("2019-07-04T16:27:11.220");
		expect(dateTime.minusDuration(Duration.of(-1)).toString()).toBe("2019-07-05T18:30:15.226");
		expect(dateTime.minusDuration(Duration.ofDays(-366)).toString()).toBe("2020-07-05T18:30:15.225");
	});

	it("should modify year", () => {
		expect(dateTime.withYear(1996).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(1996, JULY, 5, 18, 30, 15, 225).nativeUtc);
		expect(LocalDateTime.ofComponents(2016, FEBRUARY, 29, 18, 30, 15, 225).withYear(2015).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2015, FEBRUARY, 28, 18, 30, 15, 225).nativeUtc);
	});

	it("should modify month", () => {
		expect(dateTime.withMonth(NOVEMBER).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, NOVEMBER, 5, 18, 30, 15, 225).nativeUtc);
		expect(LocalDateTime.ofComponents(2015, MARCH, 30, 18, 30, 15, 225).withMonth(FEBRUARY).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2015, FEBRUARY, 28, 18, 30, 15, 225).nativeUtc);
	});

	it("should modify day of month", () => {
		expect(dateTime.withDayOfMonth(28).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 28, 18, 30, 15, 225).nativeUtc);
	});

	it("should modify day of year", () => {
		expect(dateTime.withDayOfYear(31 + 8).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, FEBRUARY, 8, 18, 30, 15, 225).nativeUtc);
	});

	it("should modify day of week", () => {
		expect(LocalDateTime.ofComponents(2019, AUGUST, 10, 18, 30, 15, 225).withDayOfWeek(TUESDAY).nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, AUGUST, 6, 18, 30, 15, 225).nativeUtc);
	});

	it("should modify hour", () => {
		expect(dateTime.withHour(15).toString()).toBe("2019-07-05T15:30:15.225");
	});

	it("should modify minute", () => {
		expect(dateTime.withMinute(15).toString()).toBe("2019-07-05T18:15:15.225");
	});

	it("should modify second", () => {
		expect(dateTime.withSecond(12).toString()).toBe("2019-07-05T18:30:12.225");
	});

	it("should modify millisecond", () => {
		expect(dateTime.withMs(15).toString()).toBe("2019-07-05T18:30:15.015");
	});

	it("should truncate itself to year", () => {
		expect(dateTime.truncateToYear.nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JANUARY, 1).nativeUtc);
	});

	it("should truncate itself to week based year", () => {
		expect(dateTime.truncateToWeekBasedYear.nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2018, DECEMBER, 31).nativeUtc);
		expect(LocalDateTime.ofComponents(2017, JULY, 5).truncateToWeekBasedYear.nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2017, JANUARY, 2).nativeUtc);
	});

	it("should truncate itself to month", () => {
		expect(dateTime.truncateToMonth.nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 1).nativeUtc);
		expect(LocalDateTime.ofComponents(2019, AUGUST, 5).truncateToMonth.nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, AUGUST, 1).nativeUtc);
	});

	it("should truncate itself to week", () => {
		expect(dateTime.truncateToWeek.nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 1).nativeUtc);
		expect(LocalDateTime.ofComponents(2019, JULY, 29).truncateToWeek.nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 29).nativeUtc);
		expect(LocalDateTime.ofComponents(2019, AUGUST, 1).truncateToWeek.nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 29).nativeUtc);
		expect(LocalDateTime.ofComponents(2019, AUGUST, 4).truncateToWeek.nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, JULY, 29).nativeUtc);
		expect(LocalDateTime.ofComponents(2019, AUGUST, 5).truncateToWeek.nativeUtc)
			.toEqual(LocalDateTime.ofComponents(2019, AUGUST, 5).nativeUtc);
	});

	it("should truncate itself to hour", () => {
		expect(dateTime.truncateToHour.toString()).toBe("2019-07-05T18:00:00.000");
	});

	it("should truncate itself to minute", () => {
		expect(dateTime.truncateToMinute.toString()).toBe("2019-07-05T18:30:00.000");
	});

	it("should truncate itself to second", () => {
		expect(dateTime.truncateToSecond.toString()).toBe("2019-07-05T18:30:15.000");
	});

	it("should convert itself to string", () => {
		expect(dateTime.toString()).toBe("2019-07-05T18:30:15.225");
		expect(LocalDateTime.ofComponents(2019, JULY, 5, 8, 3, 5, 16).toString()).toBe("2019-07-05T08:03:05.016");
	});

	it("should create proper offset date/time (atOffset)", () => {
		expect(dateTime.atOffset(UTC).toString()).toBe("2019-07-05T18:30:15.225Z");
		expect(dateTime.atOffset(ZoneOffset.ofComponents(3)).toString()).toBe("2019-07-05T18:30:15.225+03:00");
		expect(dateTime.atOffset(ZoneOffset.ofComponents(-3)).toString()).toBe("2019-07-05T18:30:15.225-03:00");
	});

	it("should create proper zoned date/time (atZone)", () => {
		expect(dateTime.atZone(UTC).toString()).toBe("2019-07-05T18:30:15.225Z");
		expect(dateTime.atZone(ZoneId.of("Europe/Berlin")).toString()).toBe("2019-07-05T18:30:15.225+02:00[Europe/Berlin]");
	});
});
