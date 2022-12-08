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
import Period, {DAY_PERIOD, MONTH_PERIOD, NULL_PERIOD, QUARTER_PERIOD, WEEK_PERIOD, YEAR_PERIOD} from "ts-time/Period";
import {isTimeZoneSupport} from "ts-time/utils";
import {UTC, ZoneId, ZoneOffset} from "ts-time/Zone";
import ZonedDateTime from "ts-time/ZonedDateTime";

isTimeZoneSupport() && describe("ZonedDateTime", () => {
	const moscow = ZoneId.of("Europe/Moscow"),
		berlin = ZoneId.of("Europe/Berlin"),
		newYork = ZoneId.of("America/New_York"),
		local = LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225),
		dateTime = ZonedDateTime.ofDateTime(local, berlin);

	it("should return proper date/time", () => {
		expect(dateTime.dateTime.nativeUtc.getTime()).equal(utc(2019, 6, 5, 18, 30, 15, 225).getTime());
	});

	it("should return proper date", () => {
		expect(dateTime.date.nativeUtc.getTime()).equal(utc(2019, 6, 5, 0, 0, 0, 0).getTime());
	});

	it("should return proper time", () => {
		expect(dateTime.time.totalMs).equal(66615225);
	});

	it("should return proper instant", () => {
		expect(dateTime.instant.native.getTime()).equal(utc(2019, 6, 5, 16, 30, 15, 225).getTime());
	});

	it("should return proper zone", () => {
		expect(dateTime.zone).equal(berlin);
	});

	it("should return proper offset", () => {
		expect(dateTime.offset).equal(ZoneOffset.ofComponents(2));
	});

	it("should return proper offset date/time", () => {
		expect(dateTime.offsetDateTime.toString()).equal("2019-07-05T18:30:15.225+02:00");
	});

	it("should return proper year", () => {
		expect(dateTime.year).equal(2019);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 1), berlin).year).equal(2019);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, DECEMBER, 31, 23, 59, 59, 999), berlin).year).equal(2018);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JANUARY, 1), berlin).year).equal(2018);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, DECEMBER, 31, 23, 59, 59, 999), berlin).year).equal(2017);
	});

	it("should return proper month", () => {
		expect(dateTime.month).equal(JULY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 1), berlin).month).equal(JULY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 30, 23, 59, 59, 999), berlin).month).equal(JUNE);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 1), berlin).month).equal(JANUARY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, DECEMBER, 31, 23, 59, 59, 999), berlin).month).equal(DECEMBER);
	});

	it("should return proper day of week", () => {
		expect(dateTime.dayOfWeek).equal(FRIDAY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 1), berlin).dayOfWeek).equal(MONDAY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 30), berlin).dayOfWeek).equal(SUNDAY);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31), berlin).dayOfWeek).equal(FRIDAY);
	});

	it("should return proper day of month", () => {
		expect(dateTime.dayOfMonth).equal(5);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 1), berlin).dayOfMonth).equal(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 30), berlin).dayOfMonth).equal(30);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 1), berlin).dayOfMonth).equal(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31), berlin).dayOfMonth).equal(31);
	});

	it("should return proper day of year", () => {
		expect(dateTime.dayOfYear).equal(31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 1), berlin).dayOfYear).equal(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, DECEMBER, 31), berlin).dayOfYear).equal(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 1), berlin).dayOfYear).equal(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, DECEMBER, 31), berlin).dayOfYear).equal(366);
	});

	it("should return proper epoch day", () => {
		expect(dateTime.epochDay).equal(365 * 49 + 12 + dateTime.dayOfYear);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1970, JANUARY, 1), berlin).epochDay).equal(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1970, DECEMBER, 31), berlin).epochDay).equal(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1973, JANUARY, 1), berlin).epochDay).equal(365 + 365 + 366 + 1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1969, DECEMBER, 31), berlin).epochDay).equal(0);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1969, DECEMBER, 29), berlin).epochDay).equal(-2);
	});

	it("should return proper leap year flag", () => {
		expect(dateTime.isLeapYear).equal(false);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, SEPTEMBER, 12), berlin).isLeapYear).equal(true);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2, MARCH, 30), berlin).isLeapYear).equal(false);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(4, DECEMBER, 20), berlin).isLeapYear).equal(true);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(300, MAY, 9), berlin).isLeapYear).equal(false);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(400, JANUARY, 12), berlin).isLeapYear).equal(true);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2000, JANUARY, 1), berlin).isLeapYear).equal(true);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2001, JANUARY, 1), berlin).isLeapYear).equal(false);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-300, JANUARY, 1), berlin).isLeapYear).equal(false);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-400, JANUARY, 1), berlin).isLeapYear).equal(true);
	});

	it("should return proper length of year", () => {
		expect(dateTime.lengthOfYear).equal(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, SEPTEMBER, 12), berlin).lengthOfYear).equal(366);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2, MARCH, 30), berlin).lengthOfYear).equal(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(4, DECEMBER, 20), berlin).lengthOfYear).equal(366);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(300, MAY, 9), berlin).lengthOfYear).equal(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(400, JANUARY, 12), berlin).lengthOfYear).equal(366);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2000, JANUARY, 1), berlin).lengthOfYear).equal(366);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2001, JANUARY, 1), berlin).lengthOfYear).equal(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-300, JANUARY, 1), berlin).lengthOfYear).equal(365);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-400, JANUARY, 1), berlin).lengthOfYear).equal(366);
	});

	it("should return proper hour", () => {
		expect(dateTime.hour).equal(18);
	});

	it("should return proper minute", () => {
		expect(dateTime.minute).equal(30);
	});

	it("should return proper second", () => {
		expect(dateTime.second).equal(15);
	});

	it("should return proper millisecond", () => {
		expect(dateTime.ms).equal(225);
	});

	it("should return proper total millisecond", () => {
		expect(dateTime.epochMs).equal(Date.UTC(2019, 6, 5, 16, 30, 15, 225));
	});

	it("should return proper native date", () => {
		expect(dateTime.native.getTime()).equal(Date.UTC(2019, 6, 5, 16, 30, 15, 225));

		// These cases are unpredictable for non-fixed timezones, because the calendar changed a lot since then
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, JANUARY, 1, 3), ZoneOffset.ofComponents(3)).native.getTime())
			.equal(utc(0, 0, 1, 0, 0, 0, 0).getTime());
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, JANUARY, 1), ZoneOffset.ofComponents(3)).native.getTime())
			.equal(utc(-1, 11, 31, 21, 0, 0, 0).getTime());
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2014, DECEMBER, 31, 23, 59, 59, 999), berlin).native.getTime())
			.equal(utc(2014, 11, 31, 22, 59, 59, 999).getTime());
	});

	it("should return proper quarter of year", () => {
		expect(dateTime.quarterOfYear).equal(3);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JANUARY, 1), berlin).quarterOfYear).equal(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, MARCH, 31, 23, 59, 59, 999), berlin).quarterOfYear).equal(1);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, APRIL, 1), berlin).quarterOfYear).equal(2);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JUNE, 30, 23, 59, 59, 999), berlin).quarterOfYear).equal(2);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JULY, 1), berlin).quarterOfYear).equal(3);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, SEPTEMBER, 30, 23, 59, 59, 999), berlin).quarterOfYear).equal(3);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, OCTOBER, 1), berlin).quarterOfYear).equal(4);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, DECEMBER, 31, 23, 59, 59, 999), berlin).quarterOfYear).equal(4);
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 1), berlin).quarterOfYear).equal(1);
	});

	it("should return week based fields", () => {
		expect(dateTime.dayOfWeek).equal(FRIDAY);
		expect(dateTime.dayOfWeekBasedYear).equal(1 + 31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(dateTime.weekBasedYear).equal(2019);
		expect(dateTime.weekOfWeekBasedYear).equal(27);

		const date1 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JANUARY, 1), berlin);
		expect(date1.dayOfWeek).equal(MONDAY);
		expect(date1.weekBasedYear).equal(2018);
		expect(date1.weekOfWeekBasedYear).equal(1);
		expect(date1.dayOfWeekBasedYear).equal(1);

		const date2 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, DECEMBER, 31, 23, 59, 59, 999), berlin);
		expect(date2.dayOfWeek).equal(SUNDAY);
		expect(date2.weekBasedYear).equal(2017);
		expect(date2.weekOfWeekBasedYear).equal(52);
		expect(date2.dayOfWeekBasedYear).equal(364);

		const date3 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 2), berlin);
		expect(date3.dayOfWeek).equal(MONDAY);
		expect(date3.weekBasedYear).equal(2017);
		expect(date3.weekOfWeekBasedYear).equal(1);
		expect(date3.dayOfWeekBasedYear).equal(1);

		const date4 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2017, JANUARY, 1), berlin);
		expect(date4.dayOfWeek).equal(SUNDAY);
		expect(date4.weekBasedYear).equal(2016);
		expect(date4.weekOfWeekBasedYear).equal(52);
		expect(date4.dayOfWeekBasedYear).equal(364);

		const date5 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, DECEMBER, 31, 23, 59, 59, 999), berlin);
		expect(date5.dayOfWeek).equal(SATURDAY);
		expect(date5.weekBasedYear).equal(2016);
		expect(date5.weekOfWeekBasedYear).equal(52);
		expect(date5.dayOfWeekBasedYear).equal(363);

		const date6 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JANUARY, 4), berlin);
		expect(date6.dayOfWeek).equal(MONDAY);
		expect(date6.weekBasedYear).equal(2016);
		expect(date6.weekOfWeekBasedYear).equal(1);
		expect(date6.dayOfWeekBasedYear).equal(1);

		const date7 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, JANUARY, 3), berlin);
		expect(date7.dayOfWeek).equal(SUNDAY);
		expect(date7.weekBasedYear).equal(2015);
		expect(date7.weekOfWeekBasedYear).equal(53);
		expect(date7.dayOfWeekBasedYear).equal(371);

		const date8 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2014, DECEMBER, 29), berlin);
		expect(date8.dayOfWeek).equal(MONDAY);
		expect(date8.weekBasedYear).equal(2015);
		expect(date8.weekOfWeekBasedYear).equal(1);
		expect(date8.dayOfWeekBasedYear).equal(1);

		const date9 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2014, DECEMBER, 28), berlin);
		expect(date9.dayOfWeek).equal(SUNDAY);
		expect(date9.weekBasedYear).equal(2014);
		expect(date9.weekOfWeekBasedYear).equal(52);
		expect(date9.dayOfWeekBasedYear).equal(364);
	});

	it("should construct from instant", () => {
		expect(ZonedDateTime.ofInstant(Instant.fromNative(utc(2019, 6, 5, 16, 30, 15, 225)), berlin).toString())
			.equal("2019-07-05T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should construct from date/time", () => {
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin).toString())
			.equal("2019-07-05T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should construct from string", () => {
		expect(ZonedDateTime.parse("2019-07-05T18:30:15.225Z").native.getTime())
			.equal(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), UTC).native.getTime());
		expect(ZonedDateTime.parse("2019-07-05T18:30+03:00").native.getTime())
			.equal(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30), ZoneOffset.ofComponents(3)).native.getTime());
		expect(ZonedDateTime.parse("2019-07-05T18:30:15+03:00").native.getTime())
			.equal(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15), ZoneOffset.ofComponents(3)).native.getTime());
		expect(ZonedDateTime.parse("2019-07-05T18:30:15.225+03:00").native.getTime())
			.equal(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(3)).native.getTime());
		expect(ZonedDateTime.parse("2019-07-05T18:30:15.225Z[UTC]").native.getTime())
			.equal(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), UTC).native.getTime());
		expect(ZonedDateTime.parse("2019-07-05T18:30+02:00[Europe/Berlin]").native.getTime())
			.equal(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30), berlin).native.getTime());
		expect(ZonedDateTime.parse("2019-07-05T18:30:15+02:00[Europe/Berlin]").native.getTime())
			.equal(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15), berlin).native.getTime());
		expect(ZonedDateTime.parse("2019-12-05T18:30:15+01:00[Europe/Berlin]").native.getTime())
			.equal(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, DECEMBER, 5, 18, 30, 15), berlin).native.getTime());
		expect(ZonedDateTime.parse("2019-07-05T18:30:15.225+02:00[Europe/Berlin]").native.getTime())
			.equal(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin).native.getTime());
		expect(ZonedDateTime.parse("2019-07-05T18:30:15.4+02:00[Europe/Berlin]").native.getTime())
			.equal(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 400), berlin).native.getTime());
		expect(ZonedDateTime.parse("2019-07-05T18:30:15.4567+02:00[Europe/Berlin]").native.getTime())
			.equal(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 456), berlin).native.getTime());
	});

	it("should throw an error by invalid string", () => {
		const expectError = (str: string) => {
			expect(() => ZonedDateTime.parse(str))
				.throw(`Unable to parse '${str}' as date/time with zone. ISO 8601 date/time string with offset and optional time zone expected.`);
		};

		expectError("abc");
		expectError("18:30");
		expectError("18:30:15");
		expectError("18:30:15.225");
		expectError("2019-07-05");
		expectError("2019-07-05T18:30:15.225");
		expectError("2019-07-05T18:30:15.225[Europe/Berlin]");
		expectError("2019-07-aaT18:30:15.225+02:00[Europe/Berlin]");
		expectError("2019-07-05T18:30:aa.225+02:00[Europe/Berlin]");
		expectError("2019-07-05T18:30:15.225+aa:00[Europe/Berlin]");
	});

	it("should throw an error by invalid time zone", () => {
		const expectError = (str: string) => {
			expect(() => ZonedDateTime.parse(str))
				.throw(`Unable to parse '${str}' as date/time with zone. Invalid or unrecognized time zone ID or offset: 'aa'.`);
		};

		expectError("2019-07-05T18:30:15.225+02:00[aa]");
	});

	it("should throw an error by mismatching offset and time zone", () => {
		const expectError = (str: string, dateTime: string, offset: string) => {
			expect(() => ZonedDateTime.parse(str))
				.throw(`Unable to parse '${str}' as date/time with zone. Date/time ${dateTime} has an offset different from ${offset}.`);
		};

		expectError("2019-07-05T18:30:15.225Z[Europe/Berlin]", "2019-07-05T18:30:15.225+02:00[Europe/Berlin]", "Z");
		expectError("2019-07-05T18:30:15.225+01:00[Europe/Berlin]", "2019-07-05T18:30:15.225+02:00[Europe/Berlin]", "+01:00");
		expectError("2019-12-05T18:30:15.225+02:00[Europe/Berlin]", "2019-12-05T18:30:15.225+01:00[Europe/Berlin]", "+02:00");
		expectError("2019-07-05T18:30:15.225+01:00[UTC]", "2019-07-05T18:30:15.225Z[UTC]", "+01:00");
	});

	it("should support two eras", () => {
		expect(dateTime.yearOfEra).equal(2019);
		expect(dateTime.era).equal(AD);

		const date1 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(1, JANUARY, 1), berlin);
		expect(date1.year).equal(1);
		expect(date1.yearOfEra).equal(1);
		expect(date1.era).equal(AD);
		expect(date1.month).equal(JANUARY);
		expect(date1.dayOfMonth).equal(1);
		expect(date1.hour).equal(0);
		expect(date1.minute).equal(0);
		expect(date1.second).equal(0);
		expect(date1.ms).equal(0);

		const date2 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, DECEMBER, 31, 23, 59, 59, 999), berlin);
		expect(date2.year).equal(0);
		expect(date2.yearOfEra).equal(0);
		expect(date2.era).equal(BC);
		expect(date2.month).equal(DECEMBER);
		expect(date2.dayOfMonth).equal(31);
		expect(date2.hour).equal(23);
		expect(date2.minute).equal(59);
		expect(date2.second).equal(59);
		expect(date2.ms).equal(999);

		const date3 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(0, JANUARY, 1), berlin);
		expect(date3.year).equal(0);
		expect(date3.yearOfEra).equal(0);
		expect(date3.era).equal(BC);
		expect(date3.month).equal(JANUARY);
		expect(date3.dayOfMonth).equal(1);
		expect(date3.hour).equal(0);
		expect(date3.minute).equal(0);
		expect(date3.second).equal(0);
		expect(date3.ms).equal(0);

		const date4 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-1, DECEMBER, 31, 23, 59, 59, 999), berlin);
		expect(date4.year).equal(-1);
		expect(date4.yearOfEra).equal(1);
		expect(date4.era).equal(BC);
		expect(date4.month).equal(DECEMBER);
		expect(date4.dayOfMonth).equal(31);
		expect(date4.hour).equal(23);
		expect(date4.minute).equal(59);
		expect(date4.second).equal(59);
		expect(date4.ms).equal(999);

		const date5 = ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(-1, JANUARY, 1), berlin);
		expect(date5.year).equal(-1);
		expect(date5.yearOfEra).equal(1);
		expect(date5.era).equal(BC);
		expect(date5.month).equal(JANUARY);
		expect(date5.dayOfMonth).equal(1);
		expect(date5.hour).equal(0);
		expect(date5.minute).equal(0);
		expect(date5.second).equal(0);
		expect(date5.ms).equal(0);
	});

	it("should compare itself", () => {
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), UTC))).greaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), berlin))).greaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 10), berlin))).greaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 3), berlin))).greaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 4), berlin))).greaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), berlin))).greaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), berlin))).greaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), moscow))).greaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 12, 30, 15, 225), newYork))).greaterThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin))).equal(0);
		expect(dateTime.compareTo(dateTime)).equal(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 19, 30, 15, 225), moscow))).lessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), newYork))).lessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), berlin))).lessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999), berlin))).lessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 6), berlin))).lessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 7), berlin))).lessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, AUGUST, 1), berlin))).lessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), berlin))).lessThan(0);
		expect(dateTime.compareTo(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), UTC))).lessThan(0);
	});

	it("should compare itself statically", () => {
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), UTC))).greaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), berlin))).greaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 10), berlin))).greaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 3), berlin))).greaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 4), berlin))).greaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), berlin))).greaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), berlin))).greaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), moscow))).greaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 12, 30, 15, 225), newYork))).greaterThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin))).equal(0);
		expect(ZonedDateTime.compare(dateTime, dateTime)).equal(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 19, 30, 15, 225), moscow))).lessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), newYork))).lessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), berlin))).lessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999), berlin))).lessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 6), berlin))).lessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 7), berlin))).lessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, AUGUST, 1), berlin))).lessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), berlin))).lessThan(0);
		expect(ZonedDateTime.compare(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, FEBRUARY, 1), UTC))).lessThan(0);
	});

	it("should compare itself with null", () => {
		expect(dateTime.compareTo(null)).greaterThan(0);
		expect(ZonedDateTime.compare(dateTime, null)).greaterThan(0);
		expect(ZonedDateTime.compare(null, dateTime)).lessThan(0);
		expect(ZonedDateTime.compare(null, null)).equal(0);
	});

	it("should check itself for equality", () => {
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), berlin))).equal(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 10), berlin))).equal(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 5), berlin))).equal(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JULY, 5), berlin))).equal(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), berlin))).equal(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), berlin))).equal(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), moscow))).equal(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 19, 30, 15, 225), moscow))).equal(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin))).equal(true);
		expect(dateTime.equals(dateTime)).equal(true);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 12, 30, 15, 225), newYork))).equal(false);
		expect(dateTime.equals(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), berlin))).equal(false);
	});

	it("should check itself for equality statically", () => {
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, SEPTEMBER, 10), berlin))).equal(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 10), berlin))).equal(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JUNE, 5), berlin))).equal(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2018, JULY, 5), berlin))).equal(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5), berlin))).equal(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224), berlin))).equal(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), moscow))).equal(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 19, 30, 15, 225), moscow))).equal(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), berlin))).equal(true);
		expect(ZonedDateTime.equal(dateTime, dateTime)).equal(true);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 12, 30, 15, 225), newYork))).equal(false);
		expect(ZonedDateTime.equal(dateTime, ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226), berlin))).equal(false);
	});

	it("should check itself for equality with null", () => {
		expect(dateTime.equals(null)).equal(false);
		expect(ZonedDateTime.equal(dateTime, null)).equal(false);
		expect(ZonedDateTime.equal(null, dateTime)).equal(false);
		expect(ZonedDateTime.equal(null, null)).equal(true);
	});

	it("should add a period", () => {
		expect(dateTime.plusPeriod(YEAR_PERIOD).toString()).equal("2020-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(MONTH_PERIOD).toString()).equal("2019-08-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(DAY_PERIOD).toString()).equal("2019-07-06T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(QUARTER_PERIOD).toString()).equal("2019-10-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(WEEK_PERIOD).toString()).equal("2019-07-12T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should add zero period", () => {
		expect(dateTime.plusPeriod(NULL_PERIOD)).equal(dateTime);
	});

	it("should add multiple periods", () => {
		expect(dateTime.plusPeriod(Period.ofYears(2)).toString()).equal("2021-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofMonths(9)).toString()).equal("2020-04-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofDays(30)).toString()).equal("2019-08-04T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofQuarters(3)).toString()).equal("2020-04-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofWeeks(5)).toString()).equal("2019-08-09T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should add negative periods", () => {
		expect(dateTime.plusPeriod(Period.ofYears(-2)).toString()).equal("2017-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofMonths(-9)).toString()).equal("2018-10-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofDays(-30)).toString()).equal("2019-06-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofQuarters(-3)).toString()).equal("2018-10-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusPeriod(Period.ofWeeks(-5)).toString()).equal("2019-05-31T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should adjust the added month properly", () => {
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225), berlin)
			.plusPeriod(MONTH_PERIOD).toString()).equal("2019-06-30T18:30:15.225+02:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JANUARY, 31, 18, 30, 15, 225), berlin)
			.plusPeriod(MONTH_PERIOD).toString()).equal("2019-02-28T18:30:15.225+01:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, JANUARY, 31, 18, 30, 15, 225), berlin)
			.plusPeriod(MONTH_PERIOD).toString()).equal("2020-02-29T18:30:15.225+01:00[Europe/Berlin]");
	});

	it("should add period with respect to date/time, not instant", () => {
		const start = ZonedDateTime.parse("2019-10-27T00:00:00.000+02:00[Europe/Berlin]"),
			end = start.plusPeriod(DAY_PERIOD);
		expect(end.toString()).equal("2019-10-28T00:00:00.000+01:00[Europe/Berlin]");
		expect(end.epochMs - start.epochMs).equal(25 * MS_PER_HOUR);
	});

	it("should add duration", () => {
		expect(dateTime.plusDuration(MS_DURATION).toString()).equal("2019-07-05T18:30:15.226+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(SECOND_DURATION).toString()).equal("2019-07-05T18:30:16.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(MINUTE_DURATION).toString()).equal("2019-07-05T18:31:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(HOUR_DURATION).toString()).equal("2019-07-05T19:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(DAY_DURATION).toString()).equal("2019-07-06T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.ofDays(5)).toString()).equal("2019-07-10T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.ofDays(31)).toString()).equal("2019-08-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.ofDays(366)).toString()).equal("2020-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).equal("2019-07-06T20:33:19.230+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.of(-1)).toString()).equal("2019-07-05T18:30:15.224+02:00[Europe/Berlin]");
		expect(dateTime.plusDuration(Duration.ofDays(-365)).toString()).equal("2018-07-05T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should add duration with respect to instant, not date/time", () => {
		const start = ZonedDateTime.parse("2019-10-27T00:00:00.000+02:00[Europe/Berlin]"),
			end = start.plusDuration(DAY_DURATION);
		expect(end.toString()).equal("2019-10-27T23:00:00.000+01:00[Europe/Berlin]");
		expect(end.epochMs - start.epochMs).equal(24 * MS_PER_HOUR);
	});

	it("should add zero duration", () => {
		expect(dateTime.plusDuration(NULL_DURATION)).equal(dateTime);
	});

	it("should subtract a period", () => {
		expect(dateTime.minusPeriod(YEAR_PERIOD).toString()).equal("2018-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(MONTH_PERIOD).toString()).equal("2019-06-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(DAY_PERIOD).toString()).equal("2019-07-04T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(QUARTER_PERIOD).toString()).equal("2019-04-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(WEEK_PERIOD).toString()).equal("2019-06-28T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should add zero duration", () => {
		expect(dateTime.minusDuration(NULL_DURATION)).equal(dateTime);
	});

	it("should subtract zero period", () => {
		expect(dateTime.minusPeriod(NULL_PERIOD)).equal(dateTime);
	});

	it("should subtract multiple periods", () => {
		expect(dateTime.minusPeriod(Period.ofYears(2)).toString()).equal("2017-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofMonths(9)).toString()).equal("2018-10-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofDays(30)).toString()).equal("2019-06-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofQuarters(3)).toString()).equal("2018-10-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofWeeks(5)).toString()).equal("2019-05-31T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should subtract negative periods", () => {
		expect(dateTime.minusPeriod(Period.ofYears(-2)).toString()).equal("2021-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofMonths(-9)).toString()).equal("2020-04-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofDays(-30)).toString()).equal("2019-08-04T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofQuarters(-3)).toString()).equal("2020-04-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusPeriod(Period.ofWeeks(-5)).toString()).equal("2019-08-09T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should adjust the subtracted month properly", () => {
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225), berlin)
			.minusPeriod(MONTH_PERIOD).toString()).equal("2019-04-30T18:30:15.225+02:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, MARCH, 31, 18, 30, 15, 225), berlin)
			.minusPeriod(MONTH_PERIOD).toString()).equal("2019-02-28T18:30:15.225+01:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2020, MARCH, 31, 18, 30, 15, 225), berlin)
			.minusPeriod(MONTH_PERIOD).toString()).equal("2020-02-29T18:30:15.225+01:00[Europe/Berlin]");
	});

	it("should subtract duration", () => {
		expect(dateTime.minusDuration(MS_DURATION).toString()).equal("2019-07-05T18:30:15.224+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(SECOND_DURATION).toString()).equal("2019-07-05T18:30:14.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(MINUTE_DURATION).toString()).equal("2019-07-05T18:29:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(HOUR_DURATION).toString()).equal("2019-07-05T17:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(DAY_DURATION).toString()).equal("2019-07-04T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.ofDays(5)).toString()).equal("2019-06-30T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.ofDays(30)).toString()).equal("2019-06-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.ofDays(365)).toString()).equal("2018-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).equal("2019-07-04T16:27:11.220+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.of(-1)).toString()).equal("2019-07-05T18:30:15.226+02:00[Europe/Berlin]");
		expect(dateTime.minusDuration(Duration.ofDays(-366)).toString()).equal("2020-07-05T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should modify year", () => {
		expect(dateTime.withYear(1996).toString()).equal("1996-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2016, FEBRUARY, 29, 18, 30, 15, 225), berlin)
			.withYear(2015).toString()).equal("2015-02-28T18:30:15.225+01:00[Europe/Berlin]");
	});

	it("should modify month", () => {
		expect(dateTime.withMonth(NOVEMBER).toString()).equal("2019-11-05T18:30:15.225+01:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2015, MARCH, 30, 18, 30, 15, 225), berlin)
			.withMonth(FEBRUARY).toString()).equal("2015-02-28T18:30:15.225+01:00[Europe/Berlin]");
	});

	it("should modify day of month", () => {
		expect(dateTime.withDayOfMonth(28).toString()).equal("2019-07-28T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should modify day of year", () => {
		expect(dateTime.withDayOfYear(31 + 8).toString()).equal("2019-02-08T18:30:15.225+01:00[Europe/Berlin]");
	});

	it("should modify day of week", () => {
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, AUGUST, 10, 18, 30, 15, 225), berlin)
			.withDayOfWeek(TUESDAY).toString()).equal("2019-08-06T18:30:15.225+02:00[Europe/Berlin]");
	});

	it("should modify hour", () => {
		expect(dateTime.withHour(15).toString()).equal("2019-07-05T15:30:15.225+02:00[Europe/Berlin]");
	});

	it("should modify minute", () => {
		expect(dateTime.withMinute(15).toString()).equal("2019-07-05T18:15:15.225+02:00[Europe/Berlin]");
	});

	it("should modify second", () => {
		expect(dateTime.withSecond(12).toString()).equal("2019-07-05T18:30:12.225+02:00[Europe/Berlin]");
	});

	it("should modify millisecond", () => {
		expect(dateTime.withMs(15).toString()).equal("2019-07-05T18:30:15.015+02:00[Europe/Berlin]");
	});

	it("should convert itself to string", () => {
		expect(dateTime.toString()).equal("2019-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), UTC).toString())
			.equal("2019-07-05T18:30:15.225Z");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 8, 3, 5, 16), berlin).toString())
			.equal("2019-07-05T08:03:05.016+02:00[Europe/Berlin]");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(3, 15, 10)).toString())
			.equal("2019-07-05T18:30:15.225+03:15:10");
		expect(ZonedDateTime.ofDateTime(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225), ZoneOffset.ofComponents(-3, -15, -10)).toString())
			.equal("2019-07-05T18:30:15.225-03:15:10");
	});
});
