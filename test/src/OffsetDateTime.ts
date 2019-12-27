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

import {utc} from "../../core/src/_internal";
import {FRIDAY, MONDAY, SATURDAY, SUNDAY, TUESDAY} from "../../core/src/DayOfWeek";
import Duration, {
	DAY_DURATION,
	HOUR_DURATION,
	MINUTE_DURATION,
	MS_DURATION,
	NULL_DURATION,
	SECOND_DURATION
} from "../../core/src/Duration";
import {AD, BC} from "../../core/src/Era";
import Instant from "../../core/src/Instant";
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
import OffsetDateTime from "../../core/src/OffsetDateTime";
import Period, {
	DAY_PERIOD,
	MONTH_PERIOD,
	NULL_PERIOD,
	QUARTER_PERIOD,
	WEEK_PERIOD,
	YEAR_PERIOD
} from "../../core/src/Period";
import {UTC, ZoneOffset} from "../../core/src/Zone";

describe("OffsetDateTime", () => {
	const offset = ZoneOffset.ofComponents(3),
		local = LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225),
		dateTime = OffsetDateTime.ofDateTime(local, offset);

	it("should return proper date/time", () => {
		expect(dateTime.dateTime.nativeUtc).toEqual(utc(2019, 6, 5, 18, 30, 15, 225));
	});

	it("should return proper date", () => {
		expect(dateTime.date.nativeUtc).toEqual(utc(2019, 6, 5, 0, 0, 0, 0));
	});

	it("should return proper time", () => {
		expect(dateTime.time.totalMs).toBe(66615225);
	});

	it("should return proper instant", () => {
		expect(dateTime.instant.native).toEqual(utc(2019, 6, 5, 15, 30, 15, 225));
	});

	it("should return proper offset", () => {
		expect(dateTime.offset).toBe(offset);
	});

	it("should return proper year", () => {
		expect(dateTime.year).toBe(2019);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 1), offset).year).toBe(2019);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, DECEMBER, 31, 23, 59, 59, 999), offset).year).toBe(2018);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JANUARY, 1), offset).year).toBe(2018);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2017, DECEMBER, 31, 23, 59, 59, 999), offset).year).toBe(2017);
	});

	it("should return proper month", () => {
		expect(dateTime.month).toBe(JULY);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 1), offset).month).toBe(JULY);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 30, 23, 59, 59, 999), offset).month).toBe(JUNE);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 1), offset).month).toBe(JANUARY);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, DECEMBER, 31, 23, 59, 59, 999), offset).month).toBe(DECEMBER);
	});

	it("should return proper day of week", () => {
		expect(dateTime.dayOfWeek).toBe(FRIDAY);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 1), offset).dayOfWeek).toBe(MONDAY);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 30), offset).dayOfWeek).toBe(SUNDAY);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31), offset).dayOfWeek).toBe(FRIDAY);
	});

	it("should return proper day of month", () => {
		expect(dateTime.dayOfMonth).toBe(5);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 1), offset).dayOfMonth).toBe(1);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 30), offset).dayOfMonth).toBe(30);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 1), offset).dayOfMonth).toBe(1);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31), offset).dayOfMonth).toBe(31);
	});

	it("should return proper day of year", () => {
		expect(dateTime.dayOfYear).toBe(31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 1), offset).dayOfYear).toBe(1);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, DECEMBER, 31), offset).dayOfYear).toBe(365);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 1), offset).dayOfYear).toBe(1);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, DECEMBER, 31), offset).dayOfYear).toBe(366);
	});

	it("should return proper epoch day", () => {
		expect(dateTime.epochDay).toBe(365 * 49 + 12 + dateTime.dayOfYear);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(1970, JANUARY, 1), offset).epochDay).toBe(1);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(1970, DECEMBER, 31), offset).epochDay).toBe(365);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(1973, JANUARY, 1), offset).epochDay).toBe(365 + 365 + 366 + 1);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(1969, DECEMBER, 31), offset).epochDay).toBe(0);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(1969, DECEMBER, 29), offset).epochDay).toBe(-2);
	});

	it("should return proper leap year flag", () => {
		expect(dateTime.isLeapYear).toBe(false);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(0, SEPTEMBER, 12), offset).isLeapYear).toBe(true);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2, MARCH, 30), offset).isLeapYear).toBe(false);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(4, DECEMBER, 20), offset).isLeapYear).toBe(true);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(300, MAY, 9), offset).isLeapYear).toBe(false);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(400, JANUARY, 12), offset).isLeapYear).toBe(true);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2000, JANUARY, 1), offset).isLeapYear).toBe(true);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2001, JANUARY, 1), offset).isLeapYear).toBe(false);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(-300, JANUARY, 1), offset).isLeapYear).toBe(false);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(-400, JANUARY, 1), offset).isLeapYear).toBe(true);
	});

	it("should return proper length of year", () => {
		expect(dateTime.lengthOfYear).toBe(365);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(0, SEPTEMBER, 12), offset).lengthOfYear).toBe(366);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2, MARCH, 30), offset).lengthOfYear).toBe(365);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(4, DECEMBER, 20), offset).lengthOfYear).toBe(366);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(300, MAY, 9), offset).lengthOfYear).toBe(365);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(400, JANUARY, 12), offset).lengthOfYear).toBe(366);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2000, JANUARY, 1), offset).lengthOfYear).toBe(366);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2001, JANUARY, 1), offset).lengthOfYear).toBe(365);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(-300, JANUARY, 1), offset).lengthOfYear).toBe(365);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(-400, JANUARY, 1), offset).lengthOfYear).toBe(366);
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
		expect(dateTime.epochMs).toBe(Date.UTC(2019, 6, 5, 15, 30, 15, 225));
	});

	it("should return proper native date", () => {
		expect(dateTime.native).toEqual(new Date(Date.UTC(2019, 6, 5, 15, 30, 15, 225)));

		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(0, JANUARY, 1, 3), offset).native)
			.toEqual(utc(0, 0, 1, 0, 0, 0, 0));
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(0, JANUARY, 1), offset).native)
			.toEqual(utc(-1, 11, 31, 21, 0, 0, 0));
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2014, DECEMBER, 31, 23, 59, 59, 999), offset).native)
			.toEqual(utc(2014, 11, 31, 20, 59, 59, 999));
	});

	it("should return proper quarter of year", () => {
		expect(dateTime.quarterOfYear).toBe(3);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JANUARY, 1), offset).quarterOfYear).toBe(1);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, MARCH, 31, 23, 59, 59, 999), offset).quarterOfYear).toBe(1);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, APRIL, 1), offset).quarterOfYear).toBe(2);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JUNE, 30, 23, 59, 59, 999), offset).quarterOfYear).toBe(2);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JULY, 1), offset).quarterOfYear).toBe(3);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, SEPTEMBER, 30, 23, 59, 59, 999), offset).quarterOfYear).toBe(3);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, OCTOBER, 1), offset).quarterOfYear).toBe(4);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, DECEMBER, 31, 23, 59, 59, 999), offset).quarterOfYear).toBe(4);
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 1), offset).quarterOfYear).toBe(1);
	});

	it("should return week based fields", () => {
		expect(dateTime.dayOfWeek).toBe(FRIDAY);
		expect(dateTime.dayOfWeekBasedYear).toBe(1 + 31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(dateTime.weekBasedYear).toBe(2019);
		expect(dateTime.weekOfWeekBasedYear).toBe(27);

		const date1 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JANUARY, 1), offset);
		expect(date1.dayOfWeek).toBe(MONDAY);
		expect(date1.weekBasedYear).toBe(2018);
		expect(date1.weekOfWeekBasedYear).toBe(1);
		expect(date1.dayOfWeekBasedYear).toBe(1);

		const date2 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2017, DECEMBER, 31, 23, 59, 59, 999), offset);
		expect(date2.dayOfWeek).toBe(SUNDAY);
		expect(date2.weekBasedYear).toBe(2017);
		expect(date2.weekOfWeekBasedYear).toBe(52);
		expect(date2.dayOfWeekBasedYear).toBe(364);

		const date3 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 2), offset);
		expect(date3.dayOfWeek).toBe(MONDAY);
		expect(date3.weekBasedYear).toBe(2017);
		expect(date3.weekOfWeekBasedYear).toBe(1);
		expect(date3.dayOfWeekBasedYear).toBe(1);

		const date4 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 1), offset);
		expect(date4.dayOfWeek).toBe(SUNDAY);
		expect(date4.weekBasedYear).toBe(2016);
		expect(date4.weekOfWeekBasedYear).toBe(52);
		expect(date4.dayOfWeekBasedYear).toBe(364);

		const date5 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, DECEMBER, 31, 23, 59, 59, 999), offset);
		expect(date5.dayOfWeek).toBe(SATURDAY);
		expect(date5.weekBasedYear).toBe(2016);
		expect(date5.weekOfWeekBasedYear).toBe(52);
		expect(date5.dayOfWeekBasedYear).toBe(363);

		const date6 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JANUARY, 4), offset);
		expect(date6.dayOfWeek).toBe(MONDAY);
		expect(date6.weekBasedYear).toBe(2016);
		expect(date6.weekOfWeekBasedYear).toBe(1);
		expect(date6.dayOfWeekBasedYear).toBe(1);

		const date7 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JANUARY, 3), offset);
		expect(date7.dayOfWeek).toBe(SUNDAY);
		expect(date7.weekBasedYear).toBe(2015);
		expect(date7.weekOfWeekBasedYear).toBe(53);
		expect(date7.dayOfWeekBasedYear).toBe(371);

		const date8 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2014, DECEMBER, 29), offset);
		expect(date8.dayOfWeek).toBe(MONDAY);
		expect(date8.weekBasedYear).toBe(2015);
		expect(date8.weekOfWeekBasedYear).toBe(1);
		expect(date8.dayOfWeekBasedYear).toBe(1);

		const date9 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2014, DECEMBER, 28), offset);
		expect(date9.dayOfWeek).toBe(SUNDAY);
		expect(date9.weekBasedYear).toBe(2014);
		expect(date9.weekOfWeekBasedYear).toBe(52);
		expect(date9.dayOfWeekBasedYear).toBe(364);
	});

	it("should construct from instant", () => {
		expect(OffsetDateTime.ofInstant(Instant.fromNative(utc(2019, 6, 5, 15, 30, 15, 225)), offset).toString())
			.toBe("2019-07-05T18:30:15.225+03:00");
	});

	it("should construct from date/time", () => {
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), offset).toString())
			.toBe("2019-07-05T18:30:15.225+03:00");
	});

	it("should construct from string", () => {
		expect(OffsetDateTime.parse("2019-07-05T18:30:15.225Z").native)
			.toEqual(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), UTC).native);
		expect(OffsetDateTime.parse("2019-07-05T18:30+03:00").native)
			.toEqual(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30), offset).native);
		expect(OffsetDateTime.parse("2019-07-05T18:30:15+03:00").native)
			.toEqual(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15), offset).native);
		expect(OffsetDateTime.parse("2019-07-05T18:30:15.225+03:00").native)
			.toEqual(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), offset).native);
	});

	it("should throw an error by invalid string", () => {
		expect(() => OffsetDateTime.parse("2019-07-05").native).toThrow(new Error("Invalid date format."));
		expect(() => OffsetDateTime.parse("2019-7-5").native).toThrow(new Error("Invalid date format."));
		expect(() => OffsetDateTime.parse("2019-07-05T18:30").native).toThrow(new Error("Invalid date format."));
		expect(() => OffsetDateTime.parse("2019-07-05T18:30:15").native).toThrow(new Error("Invalid date format."));
		expect(() => OffsetDateTime.parse("2019-07-05T18:30:15.225").native).toThrow(new Error("Invalid date format."));
		expect(() => OffsetDateTime.parse("2019-7-5T8:3:5.16").native).toThrow(new Error("Invalid date format."));
		expect(() => OffsetDateTime.parse("abc")).toThrow(new Error("Invalid date format."));
	});

	it("should support two eras", () => {
		expect(dateTime.yearOfEra).toBe(2019);
		expect(dateTime.era).toBe(AD);

		const date1 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(1, JANUARY, 1), offset);
		expect(date1.year).toBe(1);
		expect(date1.yearOfEra).toBe(1);
		expect(date1.era).toBe(AD);
		expect(date1.month).toBe(JANUARY);
		expect(date1.dayOfMonth).toBe(1);
		expect(date1.hour).toBe(0);
		expect(date1.minute).toBe(0);
		expect(date1.second).toBe(0);
		expect(date1.ms).toBe(0);

		const date2 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(0, DECEMBER, 31, 23, 59, 59, 999), offset);
		expect(date2.year).toBe(0);
		expect(date2.yearOfEra).toBe(0);
		expect(date2.era).toBe(BC);
		expect(date2.month).toBe(DECEMBER);
		expect(date2.dayOfMonth).toBe(31);
		expect(date2.hour).toBe(23);
		expect(date2.minute).toBe(59);
		expect(date2.second).toBe(59);
		expect(date2.ms).toBe(999);

		const date3 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(0, JANUARY, 1), offset);
		expect(date3.year).toBe(0);
		expect(date3.yearOfEra).toBe(0);
		expect(date3.era).toBe(BC);
		expect(date3.month).toBe(JANUARY);
		expect(date3.dayOfMonth).toBe(1);
		expect(date3.hour).toBe(0);
		expect(date3.minute).toBe(0);
		expect(date3.second).toBe(0);
		expect(date3.ms).toBe(0);

		const date4 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(-1, DECEMBER, 31, 23, 59, 59, 999), offset);
		expect(date4.year).toBe(-1);
		expect(date4.yearOfEra).toBe(1);
		expect(date4.era).toBe(BC);
		expect(date4.month).toBe(DECEMBER);
		expect(date4.dayOfMonth).toBe(31);
		expect(date4.hour).toBe(23);
		expect(date4.minute).toBe(59);
		expect(date4.second).toBe(59);
		expect(date4.ms).toBe(999);

		const date5 = OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(-1, JANUARY, 1), offset);
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
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), UTC))).toBeGreaterThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), offset))).toBeGreaterThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 10), offset))).toBeGreaterThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 3), offset))).toBeGreaterThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 4), offset))).toBeGreaterThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), offset))).toBeGreaterThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), offset))).toBeGreaterThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(4)))).toBeGreaterThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 17, 30, 15, 225), ZoneOffset.ofComponents(2)))).toBeGreaterThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), offset))).toBe(0);
		expect(dateTime.compareTo(dateTime)).toBe(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 19, 30, 15, 225), ZoneOffset.ofComponents(4)))).toBeLessThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(2)))).toBeLessThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), offset))).toBeLessThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999), offset))).toBeLessThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 6), offset))).toBeLessThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 7), offset))).toBeLessThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, AUGUST, 1), offset))).toBeLessThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), offset))).toBeLessThan(0);
		expect(dateTime.compareTo(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), UTC))).toBeLessThan(0);
	});

	it("should compare itself statically", () => {
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), UTC))).toBeGreaterThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), offset))).toBeGreaterThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 10), offset))).toBeGreaterThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 3), offset))).toBeGreaterThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 4), offset))).toBeGreaterThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), offset))).toBeGreaterThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), offset))).toBeGreaterThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(4)))).toBeGreaterThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 17, 30, 15, 225), ZoneOffset.ofComponents(2)))).toBeGreaterThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), offset))).toBe(0);
		expect(OffsetDateTime.compare(dateTime, dateTime)).toBe(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 19, 30, 15, 225), ZoneOffset.ofComponents(4)))).toBeLessThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(2)))).toBeLessThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), offset))).toBeLessThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999), offset))).toBeLessThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 6), offset))).toBeLessThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 7), offset))).toBeLessThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, AUGUST, 1), offset))).toBeLessThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), offset))).toBeLessThan(0);
		expect(OffsetDateTime.compare(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), UTC))).toBeLessThan(0);
	});

	it("should compare itself with null", () => {
		expect(dateTime.compareTo(null)).toBeGreaterThan(0);
		expect(OffsetDateTime.compare(dateTime, null)).toBeGreaterThan(0);
		expect(OffsetDateTime.compare(null, dateTime)).toBeLessThan(0);
		expect(OffsetDateTime.compare(null, null)).toBe(0);
	});

	it("should check itself for equality", () => {
		expect(dateTime.equals(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), offset))).toBe(false);
		expect(dateTime.equals(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 10), offset))).toBe(false);
		expect(dateTime.equals(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 5), offset))).toBe(false);
		expect(dateTime.equals(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JULY, 5), offset))).toBe(false);
		expect(dateTime.equals(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), offset))).toBe(false);
		expect(dateTime.equals(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), offset))).toBe(false);
		expect(dateTime.equals(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(2)))).toBe(false);
		expect(dateTime.equals(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 17, 30, 15, 225), ZoneOffset.ofComponents(2)))).toBe(false);
		expect(dateTime.equals(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), offset))).toBe(true);
		expect(dateTime.equals(dateTime)).toBe(true);
		expect(dateTime.equals(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(4)))).toBe(false);
		expect(dateTime.equals(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), offset))).toBe(false);
	});

	it("should check itself for equality statically", () => {
		expect(OffsetDateTime.equal(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), offset))).toBe(false);
		expect(OffsetDateTime.equal(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 10), offset))).toBe(false);
		expect(OffsetDateTime.equal(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 5), offset))).toBe(false);
		expect(OffsetDateTime.equal(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JULY, 5), offset))).toBe(false);
		expect(OffsetDateTime.equal(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), offset))).toBe(false);
		expect(OffsetDateTime.equal(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), offset))).toBe(false);
		expect(OffsetDateTime.equal(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(2)))).toBe(false);
		expect(OffsetDateTime.equal(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 17, 30, 15, 225), ZoneOffset.ofComponents(2)))).toBe(false);
		expect(OffsetDateTime.equal(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), offset))).toBe(true);
		expect(OffsetDateTime.equal(dateTime, dateTime)).toBe(true);
		expect(OffsetDateTime.equal(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(4)))).toBe(false);
		expect(OffsetDateTime.equal(dateTime, OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), offset))).toBe(false);
	});

	it("should check itself for equality with null", () => {
		expect(dateTime.equals(null)).toBe(false);
		expect(OffsetDateTime.equal(dateTime, null)).toBe(false);
		expect(OffsetDateTime.equal(null, dateTime)).toBe(false);
		expect(OffsetDateTime.equal(null, null)).toBe(true);
	});

	it("should add a period", () => {
		expect(dateTime.plusPeriod(YEAR_PERIOD).toString()).toBe("2020-07-05T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(MONTH_PERIOD).toString()).toBe("2019-08-05T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(DAY_PERIOD).toString()).toBe("2019-07-06T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(QUARTER_PERIOD).toString()).toBe("2019-10-05T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(WEEK_PERIOD).toString()).toBe("2019-07-12T18:30:15.225+03:00");
	});

	it("should add zero period", () => {
		expect(dateTime.plusPeriod(NULL_PERIOD)).toBe(dateTime);
	});

	it("should add multiple periods", () => {
		expect(dateTime.plusPeriod(Period.ofYears(2)).toString()).toBe("2021-07-05T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(Period.ofMonths(9)).toString()).toBe("2020-04-05T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(Period.ofDays(30)).toString()).toBe("2019-08-04T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(Period.ofQuarters(3)).toString()).toBe("2020-04-05T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(Period.ofWeeks(5)).toString()).toBe("2019-08-09T18:30:15.225+03:00");
	});

	it("should add negative periods", () => {
		expect(dateTime.plusPeriod(Period.ofYears(-2)).toString()).toBe("2017-07-05T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(Period.ofMonths(-9)).toString()).toBe("2018-10-05T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(Period.ofDays(-30)).toString()).toBe("2019-06-05T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(Period.ofQuarters(-3)).toString()).toBe("2018-10-05T18:30:15.225+03:00");
		expect(dateTime.plusPeriod(Period.ofWeeks(-5)).toString()).toBe("2019-05-31T18:30:15.225+03:00");
	});

	it("should adjust the added month properly", () => {
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225), offset)
			.plusPeriod(MONTH_PERIOD).toString()).toBe("2019-06-30T18:30:15.225+03:00");
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 31, 18, 30, 15, 225), offset)
			.plusPeriod(MONTH_PERIOD).toString()).toBe("2019-02-28T18:30:15.225+03:00");
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2020, JANUARY, 31, 18, 30, 15, 225), offset)
			.plusPeriod(MONTH_PERIOD).toString()).toBe("2020-02-29T18:30:15.225+03:00");
	});

	it("should add duration", () => {
		expect(dateTime.plusDuration(MS_DURATION).toString()).toBe("2019-07-05T18:30:15.226+03:00");
		expect(dateTime.plusDuration(SECOND_DURATION).toString()).toBe("2019-07-05T18:30:16.225+03:00");
		expect(dateTime.plusDuration(MINUTE_DURATION).toString()).toBe("2019-07-05T18:31:15.225+03:00");
		expect(dateTime.plusDuration(HOUR_DURATION).toString()).toBe("2019-07-05T19:30:15.225+03:00");
		expect(dateTime.plusDuration(DAY_DURATION).toString()).toBe("2019-07-06T18:30:15.225+03:00");
		expect(dateTime.plusDuration(Duration.ofDays(5)).toString()).toBe("2019-07-10T18:30:15.225+03:00");
		expect(dateTime.plusDuration(Duration.ofDays(31)).toString()).toBe("2019-08-05T18:30:15.225+03:00");
		expect(dateTime.plusDuration(Duration.ofDays(366)).toString()).toBe("2020-07-05T18:30:15.225+03:00");
		expect(dateTime.plusDuration(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).toBe("2019-07-06T20:33:19.230+03:00");
		expect(dateTime.plusDuration(Duration.of(-1)).toString()).toBe("2019-07-05T18:30:15.224+03:00");
		expect(dateTime.plusDuration(Duration.ofDays(-365)).toString()).toBe("2018-07-05T18:30:15.225+03:00");
	});

	it("should add zero duration", () => {
		expect(dateTime.plusDuration(NULL_DURATION)).toBe(dateTime);
	});

	it("should subtract a period", () => {
		expect(dateTime.minusPeriod(YEAR_PERIOD).toString()).toBe("2018-07-05T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(MONTH_PERIOD).toString()).toBe("2019-06-05T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(DAY_PERIOD).toString()).toBe("2019-07-04T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(QUARTER_PERIOD).toString()).toBe("2019-04-05T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(WEEK_PERIOD).toString()).toBe("2019-06-28T18:30:15.225+03:00");
	});

	it("should add zero duration", () => {
		expect(dateTime.minusDuration(NULL_DURATION)).toBe(dateTime);
	});

	it("should subtract zero period", () => {
		expect(dateTime.minusPeriod(NULL_PERIOD)).toBe(dateTime);
	});

	it("should subtract multiple periods", () => {
		expect(dateTime.minusPeriod(Period.ofYears(2)).toString()).toBe("2017-07-05T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(Period.ofMonths(9)).toString()).toBe("2018-10-05T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(Period.ofDays(30)).toString()).toBe("2019-06-05T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(Period.ofQuarters(3)).toString()).toBe("2018-10-05T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(Period.ofWeeks(5)).toString()).toBe("2019-05-31T18:30:15.225+03:00");
	});

	it("should subtract negative periods", () => {
		expect(dateTime.minusPeriod(Period.ofYears(-2)).toString()).toBe("2021-07-05T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(Period.ofMonths(-9)).toString()).toBe("2020-04-05T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(Period.ofDays(-30)).toString()).toBe("2019-08-04T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(Period.ofQuarters(-3)).toString()).toBe("2020-04-05T18:30:15.225+03:00");
		expect(dateTime.minusPeriod(Period.ofWeeks(-5)).toString()).toBe("2019-08-09T18:30:15.225+03:00");
	});

	it("should adjust the subtracted month properly", () => {
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225), offset)
			.minusPeriod(MONTH_PERIOD).toString()).toBe("2019-04-30T18:30:15.225+03:00");
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MARCH, 31, 18, 30, 15, 225), offset)
			.minusPeriod(MONTH_PERIOD).toString()).toBe("2019-02-28T18:30:15.225+03:00");
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2020, MARCH, 31, 18, 30, 15, 225), offset)
			.minusPeriod(MONTH_PERIOD).toString()).toBe("2020-02-29T18:30:15.225+03:00");
	});

	it("should subtract duration", () => {
		expect(dateTime.minusDuration(MS_DURATION).toString()).toBe("2019-07-05T18:30:15.224+03:00");
		expect(dateTime.minusDuration(SECOND_DURATION).toString()).toBe("2019-07-05T18:30:14.225+03:00");
		expect(dateTime.minusDuration(MINUTE_DURATION).toString()).toBe("2019-07-05T18:29:15.225+03:00");
		expect(dateTime.minusDuration(HOUR_DURATION).toString()).toBe("2019-07-05T17:30:15.225+03:00");
		expect(dateTime.minusDuration(DAY_DURATION).toString()).toBe("2019-07-04T18:30:15.225+03:00");
		expect(dateTime.minusDuration(Duration.ofDays(5)).toString()).toBe("2019-06-30T18:30:15.225+03:00");
		expect(dateTime.minusDuration(Duration.ofDays(30)).toString()).toBe("2019-06-05T18:30:15.225+03:00");
		expect(dateTime.minusDuration(Duration.ofDays(365)).toString()).toBe("2018-07-05T18:30:15.225+03:00");
		expect(dateTime.minusDuration(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).toBe("2019-07-04T16:27:11.220+03:00");
		expect(dateTime.minusDuration(Duration.of(-1)).toString()).toBe("2019-07-05T18:30:15.226+03:00");
		expect(dateTime.minusDuration(Duration.ofDays(-366)).toString()).toBe("2020-07-05T18:30:15.225+03:00");
	});

	it("should modify year", () => {
		expect(dateTime.withYear(1996).toString()).toBe("1996-07-05T18:30:15.225+03:00");
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2016, FEBRUARY, 29, 18, 30, 15, 225), offset)
			.withYear(2015).toString()).toBe("2015-02-28T18:30:15.225+03:00");
	});

	it("should modify month", () => {
		expect(dateTime.withMonth(NOVEMBER).toString()).toBe("2019-11-05T18:30:15.225+03:00");
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2015, MARCH, 30, 18, 30, 15, 225), offset)
			.withMonth(FEBRUARY).toString()).toBe("2015-02-28T18:30:15.225+03:00");
	});

	it("should modify day of month", () => {
		expect(dateTime.withDayOfMonth(28).toString()).toBe("2019-07-28T18:30:15.225+03:00");
	});

	it("should modify day of year", () => {
		expect(dateTime.withDayOfYear(31 + 8).toString()).toBe("2019-02-08T18:30:15.225+03:00");
	});

	it("should modify day of week", () => {
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, AUGUST, 10, 18, 30, 15, 225), offset)
			.withDayOfWeek(TUESDAY).toString()).toBe("2019-08-06T18:30:15.225+03:00");
	});

	it("should modify hour", () => {
		expect(dateTime.withHour(15).toString()).toBe("2019-07-05T15:30:15.225+03:00");
	});

	it("should modify minute", () => {
		expect(dateTime.withMinute(15).toString()).toBe("2019-07-05T18:15:15.225+03:00");
	});

	it("should modify second", () => {
		expect(dateTime.withSecond(12).toString()).toBe("2019-07-05T18:30:12.225+03:00");
	});

	it("should modify millisecond", () => {
		expect(dateTime.withMs(15).toString()).toBe("2019-07-05T18:30:15.015+03:00");
	});

	it("should convert itself to string", () => {
		expect(dateTime.toString()).toBe("2019-07-05T18:30:15.225+03:00");
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), UTC).toString())
			.toBe("2019-07-05T18:30:15.225Z");
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 8, 3, 5, 16), offset).toString())
			.toBe("2019-07-05T08:03:05.016+03:00");
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(3, 15, 10)).toString())
			.toBe("2019-07-05T18:30:15.225+03:15:10");
		expect(OffsetDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(-3, -15, -10)).toString())
			.toBe("2019-07-05T18:30:15.225-03:15:10");
	});
});
