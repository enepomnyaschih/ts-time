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

import {utc} from "ts-time/_internal";
import {MS_PER_HOUR} from "ts-time/constants";
import {FRIDAY, MONDAY, SATURDAY, SUNDAY, TUESDAY} from "ts-time/DayOfWeek";
import Duration, {
	DAY_DURATION,
	HOUR_DURATION,
	MINUTE_DURATION,
	MS_DURATION,
	NULL_DURATION,
	SECOND_DURATION
} from "ts-time/Duration";
import {AD, BC} from "ts-time/Era";
import Instant from "ts-time/Instant";
import LocalDateTime from "ts-time/LocalDateTime";
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
} from "ts-time/Month";
import Period, {
	DAY_PERIOD,
	MONTH_PERIOD,
	NULL_PERIOD,
	QUARTER_PERIOD,
	WEEK_PERIOD,
	YEAR_PERIOD
} from "ts-time/Period";
import {UTC, ZoneId, ZoneOffset} from "ts-time/Zone";
import ZonedDateTime from "ts-time/ZonedDateTime";

describe("ZonedDateTime", () => {
	const moscow = ZoneId.of("Europe/Moscow"),
		berlin = ZoneId.of("Europe/Berlin"),
		newYork = ZoneId.of("America/New_York"),
		local = LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225),
		dateTime = ZonedDateTime.ofDateTime(local, berlin);

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
		expect(dateTime.instant.native).toEqual(utc(2019, 6, 5, 16, 30, 15, 225));
	});

	it("should return proper zone", () => {
		expect(dateTime.zone).toBe(berlin);
	});

	it("should return proper offset", () => {
		expect(dateTime.offset).toBe(ZoneOffset.ofComponents(2));
	});

	it("should return proper offset date/time", () => {
		expect(dateTime.offsetDateTime.toString()).toBe("2019-07-05T18:30:15.225+02:00");
	});

	it("should return proper year", () => {
		expect(dateTime.year).toBe(2019);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 1), berlin).year).toBe(2019);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, DECEMBER, 31, 23, 59, 59, 999), berlin).year).toBe(2018);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JANUARY, 1), berlin).year).toBe(2018);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, DECEMBER, 31, 23, 59, 59, 999), berlin).year).toBe(2017);
	});

	it("should return proper month", () => {
		expect(dateTime.month).toBe(JULY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 1), berlin).month).toBe(JULY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 30, 23, 59, 59, 999), berlin).month).toBe(JUNE);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 1), berlin).month).toBe(JANUARY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, DECEMBER, 31, 23, 59, 59, 999), berlin).month).toBe(DECEMBER);
	});

	it("should return proper day of week", () => {
		expect(dateTime.dayOfWeek).toBe(FRIDAY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 1), berlin).dayOfWeek).toBe(MONDAY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 30), berlin).dayOfWeek).toBe(SUNDAY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31), berlin).dayOfWeek).toBe(FRIDAY);
	});

	it("should return proper day of month", () => {
		expect(dateTime.dayOfMonth).toBe(5);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 1), berlin).dayOfMonth).toBe(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 30), berlin).dayOfMonth).toBe(30);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 1), berlin).dayOfMonth).toBe(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31), berlin).dayOfMonth).toBe(31);
	});

	it("should return proper day of year", () => {
		expect(dateTime.dayOfYear).toBe(31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 1), berlin).dayOfYear).toBe(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, DECEMBER, 31), berlin).dayOfYear).toBe(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 1), berlin).dayOfYear).toBe(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, DECEMBER, 31), berlin).dayOfYear).toBe(366);
	});

	it("should return proper epoch day", () => {
		expect(dateTime.epochDay).toBe(365 * 49 + 12 + dateTime.dayOfYear);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1970, JANUARY, 1), berlin).epochDay).toBe(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1970, DECEMBER, 31), berlin).epochDay).toBe(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1973, JANUARY, 1), berlin).epochDay).toBe(365 + 365 + 366 + 1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1969, DECEMBER, 31), berlin).epochDay).toBe(0);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1969, DECEMBER, 29), berlin).epochDay).toBe(-2);
	});

	it("should return proper leap year flag", () => {
		expect(dateTime.isLeapYear).toBe(false);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, SEPTEMBER, 12), berlin).isLeapYear).toBe(true);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2, MARCH, 30), berlin).isLeapYear).toBe(false);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(4, DECEMBER, 20), berlin).isLeapYear).toBe(true);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(300, MAY, 9), berlin).isLeapYear).toBe(false);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(400, JANUARY, 12), berlin).isLeapYear).toBe(true);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2000, JANUARY, 1), berlin).isLeapYear).toBe(true);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2001, JANUARY, 1), berlin).isLeapYear).toBe(false);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-300, JANUARY, 1), berlin).isLeapYear).toBe(false);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-400, JANUARY, 1), berlin).isLeapYear).toBe(true);
	});

	it("should return proper length of year", () => {
		expect(dateTime.lengthOfYear).toBe(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, SEPTEMBER, 12), berlin).lengthOfYear).toBe(366);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2, MARCH, 30), berlin).lengthOfYear).toBe(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(4, DECEMBER, 20), berlin).lengthOfYear).toBe(366);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(300, MAY, 9), berlin).lengthOfYear).toBe(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(400, JANUARY, 12), berlin).lengthOfYear).toBe(366);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2000, JANUARY, 1), berlin).lengthOfYear).toBe(366);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2001, JANUARY, 1), berlin).lengthOfYear).toBe(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-300, JANUARY, 1), berlin).lengthOfYear).toBe(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-400, JANUARY, 1), berlin).lengthOfYear).toBe(366);
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
		expect(dateTime.epochMs).toBe(Date.UTC(2019, 6, 5, 16, 30, 15, 225));
	});

	it("should return proper native date", () => {
		expect(dateTime.native).toEqual(new Date(Date.UTC(2019, 6, 5, 16, 30, 15, 225)));

		// These cases are unpredictable for non-fixed timezones, because the calendar changed a lot since then
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, JANUARY, 1, 3), ZoneOffset.ofComponents(3)).native)
			.toEqual(utc(0, 0, 1, 0, 0, 0, 0));
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, JANUARY, 1), ZoneOffset.ofComponents(3)).native)
			.toEqual(utc(-1, 11, 31, 21, 0, 0, 0));
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2014, DECEMBER, 31, 23, 59, 59, 999), berlin).native)
			.toEqual(utc(2014, 11, 31, 22, 59, 59, 999));
	});

	it("should return proper quarter of year", () => {
		expect(dateTime.quarterOfYear).toBe(3);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JANUARY, 1), berlin).quarterOfYear).toBe(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, MARCH, 31, 23, 59, 59, 999), berlin).quarterOfYear).toBe(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, APRIL, 1), berlin).quarterOfYear).toBe(2);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JUNE, 30, 23, 59, 59, 999), berlin).quarterOfYear).toBe(2);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JULY, 1), berlin).quarterOfYear).toBe(3);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, SEPTEMBER, 30, 23, 59, 59, 999), berlin).quarterOfYear).toBe(3);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, OCTOBER, 1), berlin).quarterOfYear).toBe(4);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, DECEMBER, 31, 23, 59, 59, 999), berlin).quarterOfYear).toBe(4);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 1), berlin).quarterOfYear).toBe(1);
	});

	it("should return week based fields", () => {
		expect(dateTime.dayOfWeek).toBe(FRIDAY);
		expect(dateTime.dayOfWeekBasedYear).toBe(1 + 31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(dateTime.weekBasedYear).toBe(2019);
		expect(dateTime.weekOfWeekBasedYear).toBe(27);

		const date1 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JANUARY, 1), berlin);
		expect(date1.dayOfWeek).toBe(MONDAY);
		expect(date1.weekBasedYear).toBe(2018);
		expect(date1.weekOfWeekBasedYear).toBe(1);
		expect(date1.dayOfWeekBasedYear).toBe(1);

		const date2 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, DECEMBER, 31, 23, 59, 59, 999), berlin);
		expect(date2.dayOfWeek).toBe(SUNDAY);
		expect(date2.weekBasedYear).toBe(2017);
		expect(date2.weekOfWeekBasedYear).toBe(52);
		expect(date2.dayOfWeekBasedYear).toBe(364);

		const date3 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 2), berlin);
		expect(date3.dayOfWeek).toBe(MONDAY);
		expect(date3.weekBasedYear).toBe(2017);
		expect(date3.weekOfWeekBasedYear).toBe(1);
		expect(date3.dayOfWeekBasedYear).toBe(1);

		const date4 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 1), berlin);
		expect(date4.dayOfWeek).toBe(SUNDAY);
		expect(date4.weekBasedYear).toBe(2016);
		expect(date4.weekOfWeekBasedYear).toBe(52);
		expect(date4.dayOfWeekBasedYear).toBe(364);

		const date5 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, DECEMBER, 31, 23, 59, 59, 999), berlin);
		expect(date5.dayOfWeek).toBe(SATURDAY);
		expect(date5.weekBasedYear).toBe(2016);
		expect(date5.weekOfWeekBasedYear).toBe(52);
		expect(date5.dayOfWeekBasedYear).toBe(363);

		const date6 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JANUARY, 4), berlin);
		expect(date6.dayOfWeek).toBe(MONDAY);
		expect(date6.weekBasedYear).toBe(2016);
		expect(date6.weekOfWeekBasedYear).toBe(1);
		expect(date6.dayOfWeekBasedYear).toBe(1);

		const date7 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JANUARY, 3), berlin);
		expect(date7.dayOfWeek).toBe(SUNDAY);
		expect(date7.weekBasedYear).toBe(2015);
		expect(date7.weekOfWeekBasedYear).toBe(53);
		expect(date7.dayOfWeekBasedYear).toBe(371);

		const date8 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2014, DECEMBER, 29), berlin);
		expect(date8.dayOfWeek).toBe(MONDAY);
		expect(date8.weekBasedYear).toBe(2015);
		expect(date8.weekOfWeekBasedYear).toBe(1);
		expect(date8.dayOfWeekBasedYear).toBe(1);

		const date9 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2014, DECEMBER, 28), berlin);
		expect(date9.dayOfWeek).toBe(SUNDAY);
		expect(date9.weekBasedYear).toBe(2014);
		expect(date9.weekOfWeekBasedYear).toBe(52);
		expect(date9.dayOfWeekBasedYear).toBe(364);
	});

	it("should construct from instant", () => {
		expect(ZonedDateTime.ofInstant(Instant.fromNative(utc(2019, 6, 5, 16, 30, 15, 225)), berlin).toString())
			.toBe("2019-07-05T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should construct from date/time", () => {
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin).toString())
			.toBe("2019-07-05T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should construct from string", () => {
		expect(ZonedDateTime.parse("2019-07-05T18:30:15.225Z").native)
			.toEqual(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), UTC).native);
		expect(ZonedDateTime.parse("2019-07-05T18:30+03:00").native)
			.toEqual(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30), ZoneOffset.ofComponents(3)).native);
		expect(ZonedDateTime.parse("2019-07-05T18:30:15+03:00").native)
			.toEqual(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15), ZoneOffset.ofComponents(3)).native);
		expect(ZonedDateTime.parse("2019-07-05T18:30:15.225+03:00").native)
			.toEqual(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(3)).native);
		expect(ZonedDateTime.parse("2019-07-05T18:30:15.225Z[UTC]").native)
			.toEqual(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), UTC).native);
		expect(ZonedDateTime.parse("2019-07-05T18:30+02:00[Europe/Berlin]").native)
			.toEqual(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30), berlin).native);
		expect(ZonedDateTime.parse("2019-07-05T18:30:15+02:00[Europe/Berlin]").native)
			.toEqual(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15), berlin).native);
		expect(ZonedDateTime.parse("2019-12-05T18:30:15+01:00[Europe/Berlin]").native)
			.toEqual(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, DECEMBER, 5, 18, 30, 15), berlin).native);
		expect(ZonedDateTime.parse("2019-07-05T18:30:15.225+02:00[Europe/Berlin]").native)
			.toEqual(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin).native);
	});

	it("should throw an error by invalid string", () => {
		expect(() => ZonedDateTime.parse("2019-07-05").native).toThrow(new Error("Invalid date format."));
		expect(() => ZonedDateTime.parse("2019-7-5").native).toThrow(new Error("Invalid date format."));
		expect(() => ZonedDateTime.parse("2019-07-05T18:30").native).toThrow(new Error("Invalid date format."));
		expect(() => ZonedDateTime.parse("2019-07-05T18:30:15").native).toThrow(new Error("Invalid date format."));
		expect(() => ZonedDateTime.parse("2019-07-05T18:30:15.225").native).toThrow(new Error("Invalid date format."));
		expect(() => ZonedDateTime.parse("2019-7-5T8:3:5.16").native).toThrow(new Error("Invalid date format."));
		expect(() => ZonedDateTime.parse("2019-07-05T18:30:15.225Z[Europe/Berlin]").native).toThrow(new Error("The specified offset doesn't match zone ID."));
		expect(() => ZonedDateTime.parse("2019-07-05T18:30:15.225+01:00[Europe/Berlin]").native).toThrow(new Error("The specified offset doesn't match zone ID."));
		expect(() => ZonedDateTime.parse("2019-12-05T18:30:15.225+02:00[Europe/Berlin]").native).toThrow(new Error("The specified offset doesn't match zone ID."));
		expect(() => ZonedDateTime.parse("2019-07-05T18:30:15.225+01:00[UTC]").native).toThrow(new Error("The specified offset doesn't match zone ID."));
		expect(() => ZonedDateTime.parse("abc")).toThrow(new Error("Invalid date format."));
	});

	it("should support two eras", () => {
		expect(dateTime.yearOfEra).toBe(2019);
		expect(dateTime.era).toBe(AD);

		const date1 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1, JANUARY, 1), berlin);
		expect(date1.year).toBe(1);
		expect(date1.yearOfEra).toBe(1);
		expect(date1.era).toBe(AD);
		expect(date1.month).toBe(JANUARY);
		expect(date1.dayOfMonth).toBe(1);
		expect(date1.hour).toBe(0);
		expect(date1.minute).toBe(0);
		expect(date1.second).toBe(0);
		expect(date1.ms).toBe(0);

		const date2 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, DECEMBER, 31, 23, 59, 59, 999), berlin);
		expect(date2.year).toBe(0);
		expect(date2.yearOfEra).toBe(0);
		expect(date2.era).toBe(BC);
		expect(date2.month).toBe(DECEMBER);
		expect(date2.dayOfMonth).toBe(31);
		expect(date2.hour).toBe(23);
		expect(date2.minute).toBe(59);
		expect(date2.second).toBe(59);
		expect(date2.ms).toBe(999);

		const date3 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, JANUARY, 1), berlin);
		expect(date3.year).toBe(0);
		expect(date3.yearOfEra).toBe(0);
		expect(date3.era).toBe(BC);
		expect(date3.month).toBe(JANUARY);
		expect(date3.dayOfMonth).toBe(1);
		expect(date3.hour).toBe(0);
		expect(date3.minute).toBe(0);
		expect(date3.second).toBe(0);
		expect(date3.ms).toBe(0);

		const date4 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-1, DECEMBER, 31, 23, 59, 59, 999), berlin);
		expect(date4.year).toBe(-1);
		expect(date4.yearOfEra).toBe(1);
		expect(date4.era).toBe(BC);
		expect(date4.month).toBe(DECEMBER);
		expect(date4.dayOfMonth).toBe(31);
		expect(date4.hour).toBe(23);
		expect(date4.minute).toBe(59);
		expect(date4.second).toBe(59);
		expect(date4.ms).toBe(999);

		const date5 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-1, JANUARY, 1), berlin);
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
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), UTC))).toBeGreaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), berlin))).toBeGreaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 10), berlin))).toBeGreaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 3), berlin))).toBeGreaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 4), berlin))).toBeGreaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), berlin))).toBeGreaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), berlin))).toBeGreaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), moscow))).toBeGreaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 12, 30, 15, 225), newYork))).toBeGreaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin))).toBe(0);
		expect(dateTime.compareTo(dateTime)).toBe(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 19, 30, 15, 225), moscow))).toBeLessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), newYork))).toBeLessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), berlin))).toBeLessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999), berlin))).toBeLessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 6), berlin))).toBeLessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 7), berlin))).toBeLessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, AUGUST, 1), berlin))).toBeLessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), berlin))).toBeLessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), UTC))).toBeLessThan(0);
	});

	it("should compare itself statically", () => {
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), UTC))).toBeGreaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), berlin))).toBeGreaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 10), berlin))).toBeGreaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 3), berlin))).toBeGreaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 4), berlin))).toBeGreaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), berlin))).toBeGreaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), berlin))).toBeGreaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), moscow))).toBeGreaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 12, 30, 15, 225), newYork))).toBeGreaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin))).toBe(0);
		expect(ZonedDateTime.compare(dateTime, dateTime)).toBe(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 19, 30, 15, 225), moscow))).toBeLessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), newYork))).toBeLessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), berlin))).toBeLessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999), berlin))).toBeLessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 6), berlin))).toBeLessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 7), berlin))).toBeLessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, AUGUST, 1), berlin))).toBeLessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), berlin))).toBeLessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), UTC))).toBeLessThan(0);
	});

	it("should compare itself with null", () => {
		expect(dateTime.compareTo(null)).toBeGreaterThan(0);
		expect(ZonedDateTime.compare(dateTime, null)).toBeGreaterThan(0);
		expect(ZonedDateTime.compare(null, dateTime)).toBeLessThan(0);
		expect(ZonedDateTime.compare(null, null)).toBe(0);
	});

	it("should check itself for equality", () => {
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), berlin))).toBe(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 10), berlin))).toBe(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 5), berlin))).toBe(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JULY, 5), berlin))).toBe(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), berlin))).toBe(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), berlin))).toBe(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), moscow))).toBe(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 19, 30, 15, 225), moscow))).toBe(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin))).toBe(true);
		expect(dateTime.equals(dateTime)).toBe(true);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 12, 30, 15, 225), newYork))).toBe(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), berlin))).toBe(false);
	});

	it("should check itself for equality statically", () => {
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), berlin))).toBe(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 10), berlin))).toBe(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 5), berlin))).toBe(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JULY, 5), berlin))).toBe(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), berlin))).toBe(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), berlin))).toBe(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), moscow))).toBe(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 19, 30, 15, 225), moscow))).toBe(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin))).toBe(true);
		expect(ZonedDateTime.equal(dateTime, dateTime)).toBe(true);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 12, 30, 15, 225), newYork))).toBe(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), berlin))).toBe(false);
	});

	it("should check itself for equality with null", () => {
		expect(dateTime.equals(null)).toBe(false);
		expect(ZonedDateTime.equal(dateTime, null)).toBe(false);
		expect(ZonedDateTime.equal(null, dateTime)).toBe(false);
		expect(ZonedDateTime.equal(null, null)).toBe(true);
	});

	it("should add a period", () => {
		expect(dateTime.plusPeriod(YEAR_PERIOD).toString()).toBe("2020-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(MONTH_PERIOD).toString()).toBe("2019-08-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(DAY_PERIOD).toString()).toBe("2019-07-06T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(QUARTER_PERIOD).toString()).toBe("2019-10-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(WEEK_PERIOD).toString()).toBe("2019-07-12T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should add zero period", () => {
		expect(dateTime.plusPeriod(NULL_PERIOD)).toBe(dateTime);
	});

	it("should add multiple periods", () => {
		expect(dateTime.plusPeriod(Period.ofYears(2)).toString()).toBe("2021-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofMonths(9)).toString()).toBe("2020-04-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofDays(30)).toString()).toBe("2019-08-04T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofQuarters(3)).toString()).toBe("2020-04-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofWeeks(5)).toString()).toBe("2019-08-09T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should add negative periods", () => {
		expect(dateTime.plusPeriod(Period.ofYears(-2)).toString()).toBe("2017-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofMonths(-9)).toString()).toBe("2018-10-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofDays(-30)).toString()).toBe("2019-06-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofQuarters(-3)).toString()).toBe("2018-10-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofWeeks(-5)).toString()).toBe("2019-05-31T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should adjust the added month properly", () => {
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225), berlin)
			.plusPeriod(MONTH_PERIOD).toString()).toBe("2019-06-30T18:30:15.225+02:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 31, 18, 30, 15, 225), berlin)
			.plusPeriod(MONTH_PERIOD).toString()).toBe("2019-02-28T18:30:15.225+01:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, JANUARY, 31, 18, 30, 15, 225), berlin)
			.plusPeriod(MONTH_PERIOD).toString()).toBe("2020-02-29T18:30:15.225+01:00[Europe/Berlin]");
	});

	it("should add period with respect to date/time, not instant", () => {
		const start = ZonedDateTime.parse("2019-10-27T00:00:00.000+02:00[Europe/Berlin]"),
			end = start.plusPeriod(DAY_PERIOD);
		expect(end.toString()).toBe("2019-10-28T00:00:00.000+01:00[Europe/Berlin]");
		expect(end.epochMs - start.epochMs).toBe(25 * MS_PER_HOUR);
	});

	it("should add duration", () => {
		expect(dateTime.plusDuration(MS_DURATION).toString()).toBe("2019-07-05T18:30:15.226+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(SECOND_DURATION).toString()).toBe("2019-07-05T18:30:16.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(MINUTE_DURATION).toString()).toBe("2019-07-05T18:31:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(HOUR_DURATION).toString()).toBe("2019-07-05T19:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(DAY_DURATION).toString()).toBe("2019-07-06T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.ofDays(5)).toString()).toBe("2019-07-10T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.ofDays(31)).toString()).toBe("2019-08-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.ofDays(366)).toString()).toBe("2020-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).toBe("2019-07-06T20:33:19.230+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.of(-1)).toString()).toBe("2019-07-05T18:30:15.224+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.ofDays(-365)).toString()).toBe("2018-07-05T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should add duration with respect to instant, not date/time", () => {
		const start = ZonedDateTime.parse("2019-10-27T00:00:00.000+02:00[Europe/Berlin]"),
			end = start.plusDuration(DAY_DURATION);
		expect(end.toString()).toBe("2019-10-27T23:00:00.000+01:00[Europe/Berlin]");
		expect(end.epochMs - start.epochMs).toBe(24 * MS_PER_HOUR);
	});

	it("should add zero duration", () => {
		expect(dateTime.plusDuration(NULL_DURATION)).toBe(dateTime);
	});

	it("should subtract a period", () => {
		expect(dateTime.minusPeriod(YEAR_PERIOD).toString()).toBe("2018-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(MONTH_PERIOD).toString()).toBe("2019-06-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(DAY_PERIOD).toString()).toBe("2019-07-04T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(QUARTER_PERIOD).toString()).toBe("2019-04-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(WEEK_PERIOD).toString()).toBe("2019-06-28T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should add zero duration", () => {
		expect(dateTime.minusDuration(NULL_DURATION)).toBe(dateTime);
	});

	it("should subtract zero period", () => {
		expect(dateTime.minusPeriod(NULL_PERIOD)).toBe(dateTime);
	});

	it("should subtract multiple periods", () => {
		expect(dateTime.minusPeriod(Period.ofYears(2)).toString()).toBe("2017-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofMonths(9)).toString()).toBe("2018-10-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofDays(30)).toString()).toBe("2019-06-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofQuarters(3)).toString()).toBe("2018-10-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofWeeks(5)).toString()).toBe("2019-05-31T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should subtract negative periods", () => {
		expect(dateTime.minusPeriod(Period.ofYears(-2)).toString()).toBe("2021-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofMonths(-9)).toString()).toBe("2020-04-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofDays(-30)).toString()).toBe("2019-08-04T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofQuarters(-3)).toString()).toBe("2020-04-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofWeeks(-5)).toString()).toBe("2019-08-09T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should adjust the subtracted month properly", () => {
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225), berlin)
			.minusPeriod(MONTH_PERIOD).toString()).toBe("2019-04-30T18:30:15.225+02:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MARCH, 31, 18, 30, 15, 225), berlin)
			.minusPeriod(MONTH_PERIOD).toString()).toBe("2019-02-28T18:30:15.225+01:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, MARCH, 31, 18, 30, 15, 225), berlin)
			.minusPeriod(MONTH_PERIOD).toString()).toBe("2020-02-29T18:30:15.225+01:00[Europe/Berlin]");
	});

	it("should subtract duration", () => {
		expect(dateTime.minusDuration(MS_DURATION).toString()).toBe("2019-07-05T18:30:15.224+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(SECOND_DURATION).toString()).toBe("2019-07-05T18:30:14.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(MINUTE_DURATION).toString()).toBe("2019-07-05T18:29:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(HOUR_DURATION).toString()).toBe("2019-07-05T17:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(DAY_DURATION).toString()).toBe("2019-07-04T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.ofDays(5)).toString()).toBe("2019-06-30T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.ofDays(30)).toString()).toBe("2019-06-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.ofDays(365)).toString()).toBe("2018-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).toBe("2019-07-04T16:27:11.220+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.of(-1)).toString()).toBe("2019-07-05T18:30:15.226+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.ofDays(-366)).toString()).toBe("2020-07-05T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should modify year", () => {
		expect(dateTime.withYear(1996).toString()).toBe("1996-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, FEBRUARY, 29, 18, 30, 15, 225), berlin)
			.withYear(2015).toString()).toBe("2015-02-28T18:30:15.225+01:00[Europe/Berlin]");
	});

	it("should modify month", () => {
		expect(dateTime.withMonth(NOVEMBER).toString()).toBe("2019-11-05T18:30:15.225+01:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2015, MARCH, 30, 18, 30, 15, 225), berlin)
			.withMonth(FEBRUARY).toString()).toBe("2015-02-28T18:30:15.225+01:00[Europe/Berlin]");
	});

	it("should modify day of month", () => {
		expect(dateTime.withDayOfMonth(28).toString()).toBe("2019-07-28T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should modify day of year", () => {
		expect(dateTime.withDayOfYear(31 + 8).toString()).toBe("2019-02-08T18:30:15.225+01:00[Europe/Berlin]");
	});

	it("should modify day of week", () => {
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, AUGUST, 10, 18, 30, 15, 225), berlin)
			.withDayOfWeek(TUESDAY).toString()).toBe("2019-08-06T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should modify hour", () => {
		expect(dateTime.withHour(15).toString()).toBe("2019-07-05T15:30:15.225+02:00[Europe/Berlin]");
	});

	it("should modify minute", () => {
		expect(dateTime.withMinute(15).toString()).toBe("2019-07-05T18:15:15.225+02:00[Europe/Berlin]");
	});

	it("should modify second", () => {
		expect(dateTime.withSecond(12).toString()).toBe("2019-07-05T18:30:12.225+02:00[Europe/Berlin]");
	});

	it("should modify millisecond", () => {
		expect(dateTime.withMs(15).toString()).toBe("2019-07-05T18:30:15.015+02:00[Europe/Berlin]");
	});

	it("should convert itself to string", () => {
		expect(dateTime.toString()).toBe("2019-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), UTC).toString())
			.toBe("2019-07-05T18:30:15.225Z");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 8, 3, 5, 16), berlin).toString())
			.toBe("2019-07-05T08:03:05.016+02:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(3, 15, 10)).toString())
			.toBe("2019-07-05T18:30:15.225+03:15:10");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(-3, -15, -10)).toString())
			.toBe("2019-07-05T18:30:15.225-03:15:10");
	});
});
