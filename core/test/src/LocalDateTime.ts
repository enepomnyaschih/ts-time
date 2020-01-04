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

import {expect} from "chai";
import {utc} from "ts-time/_internal";
import {MS_PER_DAY} from "ts-time/constants";
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

describe("LocalDateTime", () => {
	const dateTime = LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225);

	it("should return proper year", () => {
		expect(dateTime.year).equal(2019);
		expect(LocalDateTime.ofComponents(2019, JANUARY, 1).year).equal(2019);
		expect(LocalDateTime.ofComponents(2018, DECEMBER, 31, 23, 59, 59, 999).year).equal(2018);
		expect(LocalDateTime.ofComponents(2018, JANUARY, 1).year).equal(2018);
		expect(LocalDateTime.ofComponents(2017, DECEMBER, 31, 23, 59, 59, 999).year).equal(2017);
	});

	it("should return proper month", () => {
		expect(dateTime.month).equal(JULY);
		expect(LocalDateTime.ofComponents(2019, JULY, 1).month).equal(JULY);
		expect(LocalDateTime.ofComponents(2019, JUNE, 30, 23, 59, 59, 999).month).equal(JUNE);
		expect(LocalDateTime.ofComponents(2019, JANUARY, 1).month).equal(JANUARY);
		expect(LocalDateTime.ofComponents(2018, DECEMBER, 31, 23, 59, 59, 999).month).equal(DECEMBER);
	});

	it("should return proper day of week", () => {
		expect(dateTime.dayOfWeek).equal(FRIDAY);
		expect(LocalDateTime.ofComponents(2019, JULY, 1).dayOfWeek).equal(MONDAY);
		expect(LocalDateTime.ofComponents(2019, JUNE, 30).dayOfWeek).equal(SUNDAY);
		expect(LocalDateTime.ofComponents(2019, MAY, 31).dayOfWeek).equal(FRIDAY);
	});

	it("should return proper day of month", () => {
		expect(dateTime.dayOfMonth).equal(5);
		expect(LocalDateTime.ofComponents(2019, JULY, 1).dayOfMonth).equal(1);
		expect(LocalDateTime.ofComponents(2019, JUNE, 30).dayOfMonth).equal(30);
		expect(LocalDateTime.ofComponents(2019, JUNE, 1).dayOfMonth).equal(1);
		expect(LocalDateTime.ofComponents(2019, MAY, 31).dayOfMonth).equal(31);
	});

	it("should return proper day of year", () => {
		expect(dateTime.dayOfYear).equal(31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(LocalDateTime.ofComponents(2019, JANUARY, 1).dayOfYear).equal(1);
		expect(LocalDateTime.ofComponents(2018, DECEMBER, 31).dayOfYear).equal(365);
		expect(LocalDateTime.ofComponents(2017, JANUARY, 1).dayOfYear).equal(1);
		expect(LocalDateTime.ofComponents(2016, DECEMBER, 31).dayOfYear).equal(366);
	});

	it("should return proper epoch day", () => {
		expect(dateTime.epochDay).equal(365 * 49 + 12 + dateTime.dayOfYear);
		expect(LocalDateTime.ofComponents(1970, JANUARY, 1).epochDay).equal(1);
		expect(LocalDateTime.ofComponents(1970, DECEMBER, 31).epochDay).equal(365);
		expect(LocalDateTime.ofComponents(1973, JANUARY, 1).epochDay).equal(365 + 365 + 366 + 1);
		expect(LocalDateTime.ofComponents(1969, DECEMBER, 31).epochDay).equal(0);
		expect(LocalDateTime.ofComponents(1969, DECEMBER, 29).epochDay).equal(-2);
	});

	it("should return proper leap year flag", () => {
		expect(dateTime.isLeapYear).equal(false);
		expect(LocalDateTime.ofComponents(0, SEPTEMBER, 12).isLeapYear).equal(true);
		expect(LocalDateTime.ofComponents(2, MARCH, 30).isLeapYear).equal(false);
		expect(LocalDateTime.ofComponents(4, DECEMBER, 20).isLeapYear).equal(true);
		expect(LocalDateTime.ofComponents(300, MAY, 9).isLeapYear).equal(false);
		expect(LocalDateTime.ofComponents(400, JANUARY, 12).isLeapYear).equal(true);
		expect(LocalDateTime.ofComponents(2000, JANUARY, 1).isLeapYear).equal(true);
		expect(LocalDateTime.ofComponents(2001, JANUARY, 1).isLeapYear).equal(false);
		expect(LocalDateTime.ofComponents(-300, JANUARY, 1).isLeapYear).equal(false);
		expect(LocalDateTime.ofComponents(-400, JANUARY, 1).isLeapYear).equal(true);
	});

	it("should return proper length of year", () => {
		expect(dateTime.lengthOfYear).equal(365);
		expect(LocalDateTime.ofComponents(0, SEPTEMBER, 12).lengthOfYear).equal(366);
		expect(LocalDateTime.ofComponents(2, MARCH, 30).lengthOfYear).equal(365);
		expect(LocalDateTime.ofComponents(4, DECEMBER, 20).lengthOfYear).equal(366);
		expect(LocalDateTime.ofComponents(300, MAY, 9).lengthOfYear).equal(365);
		expect(LocalDateTime.ofComponents(400, JANUARY, 12).lengthOfYear).equal(366);
		expect(LocalDateTime.ofComponents(2000, JANUARY, 1).lengthOfYear).equal(366);
		expect(LocalDateTime.ofComponents(2001, JANUARY, 1).lengthOfYear).equal(365);
		expect(LocalDateTime.ofComponents(-300, JANUARY, 1).lengthOfYear).equal(365);
		expect(LocalDateTime.ofComponents(-400, JANUARY, 1).lengthOfYear).equal(366);
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
		expect(dateTime.epochMsUtc).equal(Date.UTC(2019, 6, 5, 18, 30, 15, 225));
	});

	it("should return proper native UTC date", () => {
		expect(dateTime.nativeUtc.getTime()).equal(Date.UTC(2019, 6, 5, 18, 30, 15, 225));

		const date = utc(0, 0, 1, 0, 0, 0, 0);
		expect(LocalDateTime.ofComponents(0, JANUARY, 1).nativeUtc.getTime()).equal(date.getTime());
		expect(LocalDateTime.ofComponents(2014, DECEMBER, 31, 23, 59, 59, 999).nativeUtc.getTime())
			.equal(Date.UTC(2014, 11, 31, 23, 59, 59, 999));
	});

	// Note: This test is environment-dependent, as local time zone may differ
	it("should return proper native local date", () => {
		expect(dateTime.nativeLocal.getTime()).equal(new Date(2019, 6, 5, 18, 30, 15, 225).getTime());
		expect(LocalDateTime.ofComponents(0, JANUARY, 1).nativeLocal.getTime()).equal(new Date(0, 0, 1).getTime());
		expect(LocalDateTime.ofComponents(2014, DECEMBER, 31, 23, 59, 59, 999).nativeLocal.getTime())
			.equal(new Date(2014, 11, 31, 23, 59, 59, 999).getTime());
	});

	it("should return proper quarter of year", () => {
		expect(dateTime.quarterOfYear).equal(3);
		expect(LocalDateTime.ofComponents(2016, JANUARY, 1).quarterOfYear).equal(1);
		expect(LocalDateTime.ofComponents(2016, MARCH, 31, 23, 59, 59, 999).quarterOfYear).equal(1);
		expect(LocalDateTime.ofComponents(2016, APRIL, 1).quarterOfYear).equal(2);
		expect(LocalDateTime.ofComponents(2016, JUNE, 30, 23, 59, 59, 999).quarterOfYear).equal(2);
		expect(LocalDateTime.ofComponents(2016, JULY, 1).quarterOfYear).equal(3);
		expect(LocalDateTime.ofComponents(2016, SEPTEMBER, 30, 23, 59, 59, 999).quarterOfYear).equal(3);
		expect(LocalDateTime.ofComponents(2016, OCTOBER, 1).quarterOfYear).equal(4);
		expect(LocalDateTime.ofComponents(2016, DECEMBER, 31, 23, 59, 59, 999).quarterOfYear).equal(4);
		expect(LocalDateTime.ofComponents(2017, JANUARY, 1).quarterOfYear).equal(1);
	});

	it("should return week based fields", () => {
		expect(dateTime.dayOfWeek).equal(FRIDAY);
		expect(dateTime.dayOfWeekBasedYear).equal(1 + 31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(dateTime.weekBasedYear).equal(2019);
		expect(dateTime.weekOfWeekBasedYear).equal(27);

		const date1 = LocalDateTime.ofComponents(2018, JANUARY, 1);
		expect(date1.dayOfWeek).equal(MONDAY);
		expect(date1.weekBasedYear).equal(2018);
		expect(date1.weekOfWeekBasedYear).equal(1);
		expect(date1.dayOfWeekBasedYear).equal(1);

		const date2 = LocalDateTime.ofComponents(2017, DECEMBER, 31, 23, 59, 59, 999);
		expect(date2.dayOfWeek).equal(SUNDAY);
		expect(date2.weekBasedYear).equal(2017);
		expect(date2.weekOfWeekBasedYear).equal(52);
		expect(date2.dayOfWeekBasedYear).equal(364);

		const date3 = LocalDateTime.ofComponents(2017, JANUARY, 2);
		expect(date3.dayOfWeek).equal(MONDAY);
		expect(date3.weekBasedYear).equal(2017);
		expect(date3.weekOfWeekBasedYear).equal(1);
		expect(date3.dayOfWeekBasedYear).equal(1);

		const date4 = LocalDateTime.ofComponents(2017, JANUARY, 1);
		expect(date4.dayOfWeek).equal(SUNDAY);
		expect(date4.weekBasedYear).equal(2016);
		expect(date4.weekOfWeekBasedYear).equal(52);
		expect(date4.dayOfWeekBasedYear).equal(364);

		const date5 = LocalDateTime.ofComponents(2016, DECEMBER, 31, 23, 59, 59, 999);
		expect(date5.dayOfWeek).equal(SATURDAY);
		expect(date5.weekBasedYear).equal(2016);
		expect(date5.weekOfWeekBasedYear).equal(52);
		expect(date5.dayOfWeekBasedYear).equal(363);

		const date6 = LocalDateTime.ofComponents(2016, JANUARY, 4);
		expect(date6.dayOfWeek).equal(MONDAY);
		expect(date6.weekBasedYear).equal(2016);
		expect(date6.weekOfWeekBasedYear).equal(1);
		expect(date6.dayOfWeekBasedYear).equal(1);

		const date7 = LocalDateTime.ofComponents(2016, JANUARY, 3);
		expect(date7.dayOfWeek).equal(SUNDAY);
		expect(date7.weekBasedYear).equal(2015);
		expect(date7.weekOfWeekBasedYear).equal(53);
		expect(date7.dayOfWeekBasedYear).equal(371);

		const date8 = LocalDateTime.ofComponents(2014, DECEMBER, 29);
		expect(date8.dayOfWeek).equal(MONDAY);
		expect(date8.weekBasedYear).equal(2015);
		expect(date8.weekOfWeekBasedYear).equal(1);
		expect(date8.dayOfWeekBasedYear).equal(1);

		const date9 = LocalDateTime.ofComponents(2014, DECEMBER, 28);
		expect(date9.dayOfWeek).equal(SUNDAY);
		expect(date9.weekBasedYear).equal(2014);
		expect(date9.weekOfWeekBasedYear).equal(52);
		expect(date9.dayOfWeekBasedYear).equal(364);
	});

	it("should construct from epoch ms in UTC", () => {
		const dateTime = LocalDateTime.ofEpochMsUtc(1000 * MS_PER_DAY + 66615225);
		expect(dateTime.year).equal(1972);
		expect(dateTime.month).equal(SEPTEMBER);
		expect(dateTime.dayOfMonth).equal(26);
		expect(dateTime.epochDay).equal(1000);
		expect(dateTime.hour).equal(18);
		expect(dateTime.minute).equal(30);
		expect(dateTime.second).equal(15);
		expect(dateTime.ms).equal(225);

		expect(LocalDateTime.ofEpochMsUtc(1).epochDay).equal(0);
		expect(LocalDateTime.ofEpochMsUtc(0).epochDay).equal(0);
		expect(LocalDateTime.ofEpochMsUtc(-1).epochDay).equal(-1);
		expect(LocalDateTime.ofEpochMsUtc(1000).epochDay).equal(0);
		expect(LocalDateTime.ofEpochMsUtc(-1000).epochDay).equal(-1);
		expect(LocalDateTime.ofEpochMsUtc(100000).epochDay).equal(0);

		expect(LocalDateTime.ofEpochMsUtc(1).time.totalMs).equal(1);
		expect(LocalDateTime.ofEpochMsUtc(0).time.totalMs).equal(0);
		expect(LocalDateTime.ofEpochMsUtc(-1).time.totalMs).equal(MS_PER_DAY - 1);
		expect(LocalDateTime.ofEpochMsUtc(1000).time.totalMs).equal(1000);
		expect(LocalDateTime.ofEpochMsUtc(-1000).time.totalMs).equal(MS_PER_DAY - 1000);
		expect(LocalDateTime.ofEpochMsUtc(100000).time.totalMs).equal(100000);

		expect(LocalDateTime.ofEpochMsUtc(MS_PER_DAY).epochDay).equal(1);
		expect(LocalDateTime.ofEpochMsUtc(-MS_PER_DAY).epochDay).equal(-1);
		expect(LocalDateTime.ofEpochMsUtc(1000 * MS_PER_DAY).epochDay).equal(1000);
		expect(LocalDateTime.ofEpochMsUtc(-1000 * MS_PER_DAY).epochDay).equal(-1000);
		expect(LocalDateTime.ofEpochMsUtc(100000 * MS_PER_DAY).epochDay).equal(100000);
	});

	// Note: This test is environment-dependent, as local time zone may differ
	it("should construct from native local", () => {
		expect(LocalDateTime.fromNativeLocal(new Date(2019, 6, 5, 18, 30, 15, 225)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should return null by native local null", () => {
		expect(LocalDateTime.fromNativeLocal(null)).equal(null);
	});

	it("should construct from native UTC", () => {
		expect(LocalDateTime.fromNativeUtc(new Date(Date.UTC(2019, 6, 5, 18, 30, 15, 225))).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should return null by native UTC null", () => {
		expect(LocalDateTime.fromNativeUtc(null)).equal(null);
	});

	it("should construct from string", () => {
		expect(LocalDateTime.parse("2019-07-05").nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 5).nativeUtc.getTime());
		expect(LocalDateTime.parse("2019-7-5").nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 5).nativeUtc.getTime());
		expect(LocalDateTime.parse("2019-07-05T18:30").nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30).nativeUtc.getTime());
		expect(LocalDateTime.parse("2019-07-05T18:30:15").nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15).nativeUtc.getTime());
		expect(LocalDateTime.parse("2019-07-05T18:30:15.225").nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(LocalDateTime.parse("2019-7-5T8:3:5.16").nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 5, 8, 3, 5, 16).nativeUtc.getTime());
	});

	it("should throw an error by invalid string", () => {
		expect(() => LocalDateTime.parse("abc")).throw("Invalid date format.");
	});

	it("should support two eras", () => {
		expect(dateTime.yearOfEra).equal(2019);
		expect(dateTime.era).equal(AD);

		const date1 = LocalDateTime.ofComponents(1, JANUARY, 1);
		expect(date1.year).equal(1);
		expect(date1.yearOfEra).equal(1);
		expect(date1.era).equal(AD);
		expect(date1.month).equal(JANUARY);
		expect(date1.dayOfMonth).equal(1);
		expect(date1.hour).equal(0);
		expect(date1.minute).equal(0);
		expect(date1.second).equal(0);
		expect(date1.ms).equal(0);

		const date2 = LocalDateTime.ofComponents(0, DECEMBER, 31, 23, 59, 59, 999);
		expect(date2.year).equal(0);
		expect(date2.yearOfEra).equal(0);
		expect(date2.era).equal(BC);
		expect(date2.month).equal(DECEMBER);
		expect(date2.dayOfMonth).equal(31);
		expect(date2.hour).equal(23);
		expect(date2.minute).equal(59);
		expect(date2.second).equal(59);
		expect(date2.ms).equal(999);

		const date3 = LocalDateTime.ofComponents(0, JANUARY, 1);
		expect(date3.year).equal(0);
		expect(date3.yearOfEra).equal(0);
		expect(date3.era).equal(BC);
		expect(date3.month).equal(JANUARY);
		expect(date3.dayOfMonth).equal(1);
		expect(date3.hour).equal(0);
		expect(date3.minute).equal(0);
		expect(date3.second).equal(0);
		expect(date3.ms).equal(0);

		const date4 = LocalDateTime.ofComponents(-1, DECEMBER, 31, 23, 59, 59, 999);
		expect(date4.year).equal(-1);
		expect(date4.yearOfEra).equal(1);
		expect(date4.era).equal(BC);
		expect(date4.month).equal(DECEMBER);
		expect(date4.dayOfMonth).equal(31);
		expect(date4.hour).equal(23);
		expect(date4.minute).equal(59);
		expect(date4.second).equal(59);
		expect(date4.ms).equal(999);

		const date5 = LocalDateTime.ofComponents(-1, JANUARY, 1);
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
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).greaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JUNE, 10))).greaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 3))).greaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 4))).greaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 5))).greaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).greaterThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).equal(0);
		expect(dateTime.compareTo(dateTime)).equal(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).lessThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).lessThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 6))).lessThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, JULY, 7))).lessThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2019, AUGUST, 1))).lessThan(0);
		expect(dateTime.compareTo(LocalDateTime.ofComponents(2020, FEBRUARY, 1))).lessThan(0);
	});

	it("should compare itself statically", () => {
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).greaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JUNE, 10))).greaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 3))).greaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 4))).greaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 5))).greaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).greaterThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).equal(0);
		expect(LocalDateTime.compare(dateTime, dateTime)).equal(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).lessThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).lessThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 6))).lessThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, JULY, 7))).lessThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2019, AUGUST, 1))).lessThan(0);
		expect(LocalDateTime.compare(dateTime, LocalDateTime.ofComponents(2020, FEBRUARY, 1))).lessThan(0);
	});

	it("should compare itself with null", () => {
		expect(dateTime.compareTo(null)).greaterThan(0);
		expect(LocalDateTime.compare(dateTime, null)).greaterThan(0);
		expect(LocalDateTime.compare(null, dateTime)).lessThan(0);
		expect(LocalDateTime.compare(null, null)).equal(0);
	});

	it("should check itself for equality", () => {
		expect(dateTime.equals(LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).equal(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JULY, 10))).equal(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JUNE, 5))).equal(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2018, JULY, 5))).equal(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JULY, 5))).equal(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).equal(false);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).equal(true);
		expect(dateTime.equals(dateTime)).equal(true);
		expect(dateTime.equals(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).equal(false);
	});

	it("should check itself for equality statically", () => {
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).equal(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JULY, 10))).equal(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JUNE, 5))).equal(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2018, JULY, 5))).equal(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JULY, 5))).equal(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).equal(false);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).equal(true);
		expect(LocalDateTime.equal(dateTime, dateTime)).equal(true);
		expect(LocalDateTime.equal(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).equal(false);
	});

	it("should check itself for equality with null", () => {
		expect(dateTime.equals(null)).equal(false);
		expect(LocalDateTime.equal(dateTime, null)).equal(false);
		expect(LocalDateTime.equal(null, dateTime)).equal(false);
		expect(LocalDateTime.equal(null, null)).equal(true);
	});

	it("should compare itself with isBefore method", () => {
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).equal(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JUNE, 10))).equal(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 3))).equal(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 4))).equal(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 5))).equal(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).equal(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).equal(false);
		expect(dateTime.isBefore(dateTime)).equal(false);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).equal(true);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).equal(true);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 6))).equal(true);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, JULY, 7))).equal(true);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2019, AUGUST, 1))).equal(true);
		expect(dateTime.isBefore(LocalDateTime.ofComponents(2020, FEBRUARY, 1))).equal(true);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).equal(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JUNE, 10))).equal(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 3))).equal(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 4))).equal(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 5))).equal(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).equal(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).equal(false);
		expect(LocalDateTime.isBefore(dateTime, dateTime)).equal(false);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).equal(true);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).equal(true);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 6))).equal(true);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, JULY, 7))).equal(true);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2019, AUGUST, 1))).equal(true);
		expect(LocalDateTime.isBefore(dateTime, LocalDateTime.ofComponents(2020, FEBRUARY, 1))).equal(true);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(dateTime.isBefore(null)).equal(false);
		expect(LocalDateTime.isBefore(dateTime, null)).equal(false);
		expect(LocalDateTime.isBefore(null, dateTime)).equal(true);
		expect(LocalDateTime.isBefore(null, null)).equal(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).equal(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JUNE, 10))).equal(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 3))).equal(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 4))).equal(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 5))).equal(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).equal(true);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).equal(false);
		expect(dateTime.isAfter(dateTime)).equal(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).equal(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).equal(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 6))).equal(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, JULY, 7))).equal(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2019, AUGUST, 1))).equal(false);
		expect(dateTime.isAfter(LocalDateTime.ofComponents(2020, FEBRUARY, 1))).equal(false);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2018, SEPTEMBER, 10))).equal(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JUNE, 10))).equal(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 3))).equal(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 4))).equal(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 5))).equal(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 224))).equal(true);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 225))).equal(false);
		expect(LocalDateTime.isAfter(dateTime, dateTime)).equal(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 18, 30, 15, 226))).equal(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 5, 23, 59, 59, 999))).equal(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 6))).equal(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, JULY, 7))).equal(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2019, AUGUST, 1))).equal(false);
		expect(LocalDateTime.isAfter(dateTime, LocalDateTime.ofComponents(2020, FEBRUARY, 1))).equal(false);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(dateTime.isAfter(null)).equal(true);
		expect(LocalDateTime.isAfter(dateTime, null)).equal(true);
		expect(LocalDateTime.isAfter(null, dateTime)).equal(false);
		expect(LocalDateTime.isAfter(null, null)).equal(false);
	});

	it("should add a period", () => {
		expect(dateTime.plusPeriod(YEAR_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2020, JULY, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(MONTH_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, AUGUST, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(DAY_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 6, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(QUARTER_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, OCTOBER, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(WEEK_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 12, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should add zero period", () => {
		expect(dateTime.plusPeriod(NULL_PERIOD)).equal(dateTime);
	});

	it("should add multiple periods", () => {
		expect(dateTime.plusPeriod(Period.ofYears(2)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2021, JULY, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(Period.ofMonths(9)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2020, APRIL, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(Period.ofDays(30)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, AUGUST, 4, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(Period.ofQuarters(3)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2020, APRIL, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(Period.ofWeeks(5)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, AUGUST, 9, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should add negative periods", () => {
		expect(dateTime.plusPeriod(Period.ofYears(-2)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2017, JULY, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(Period.ofMonths(-9)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2018, OCTOBER, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(Period.ofDays(-30)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JUNE, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(Period.ofQuarters(-3)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2018, OCTOBER, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.plusPeriod(Period.ofWeeks(-5)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should adjust the added month properly", () => {
		expect(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225).plusPeriod(MONTH_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JUNE, 30, 18, 30, 15, 225).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2019, JANUARY, 31, 18, 30, 15, 225).plusPeriod(MONTH_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, FEBRUARY, 28, 18, 30, 15, 225).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2020, JANUARY, 31, 18, 30, 15, 225).plusPeriod(MONTH_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2020, FEBRUARY, 29, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should add duration", () => {
		expect(dateTime.plusDuration(MS_DURATION).toString()).equal("2019-07-05T18:30:15.226");
		expect(dateTime.plusDuration(SECOND_DURATION).toString()).equal("2019-07-05T18:30:16.225");
		expect(dateTime.plusDuration(MINUTE_DURATION).toString()).equal("2019-07-05T18:31:15.225");
		expect(dateTime.plusDuration(HOUR_DURATION).toString()).equal("2019-07-05T19:30:15.225");
		expect(dateTime.plusDuration(DAY_DURATION).toString()).equal("2019-07-06T18:30:15.225");
		expect(dateTime.plusDuration(Duration.ofDays(5)).toString()).equal("2019-07-10T18:30:15.225");
		expect(dateTime.plusDuration(Duration.ofDays(31)).toString()).equal("2019-08-05T18:30:15.225");
		expect(dateTime.plusDuration(Duration.ofDays(366)).toString()).equal("2020-07-05T18:30:15.225");
		expect(dateTime.plusDuration(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).equal("2019-07-06T20:33:19.230");
		expect(dateTime.plusDuration(Duration.of(-1)).toString()).equal("2019-07-05T18:30:15.224");
		expect(dateTime.plusDuration(Duration.ofDays(-365)).toString()).equal("2018-07-05T18:30:15.225");
	});

	it("should add zero duration", () => {
		expect(dateTime.plusDuration(NULL_DURATION)).equal(dateTime);
	});

	it("should subtract a period", () => {
		expect(dateTime.minusPeriod(YEAR_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2018, JULY, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(MONTH_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JUNE, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(DAY_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 4, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(QUARTER_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, APRIL, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(WEEK_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JUNE, 28, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should subtract zero period", () => {
		expect(dateTime.minusPeriod(NULL_PERIOD)).equal(dateTime);
	});

	it("should subtract multiple periods", () => {
		expect(dateTime.minusPeriod(Period.ofYears(2)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2017, JULY, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(Period.ofMonths(9)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2018, OCTOBER, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(Period.ofDays(30)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JUNE, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(Period.ofQuarters(3)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2018, OCTOBER, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(Period.ofWeeks(5)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should subtract negative periods", () => {
		expect(dateTime.minusPeriod(Period.ofYears(-2)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2021, JULY, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(Period.ofMonths(-9)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2020, APRIL, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(Period.ofDays(-30)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, AUGUST, 4, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(Period.ofQuarters(-3)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2020, APRIL, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(dateTime.minusPeriod(Period.ofWeeks(-5)).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, AUGUST, 9, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should adjust the subtracted month properly", () => {
		expect(LocalDateTime.ofComponents(2019, MAY, 31, 18, 30, 15, 225).minusPeriod(MONTH_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, APRIL, 30, 18, 30, 15, 225).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2019, MARCH, 31, 18, 30, 15, 225).minusPeriod(MONTH_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, FEBRUARY, 28, 18, 30, 15, 225).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2020, MARCH, 31, 18, 30, 15, 225).minusPeriod(MONTH_PERIOD).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2020, FEBRUARY, 29, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should subtract duration", () => {
		expect(dateTime.minusDuration(MS_DURATION).toString()).equal("2019-07-05T18:30:15.224");
		expect(dateTime.minusDuration(SECOND_DURATION).toString()).equal("2019-07-05T18:30:14.225");
		expect(dateTime.minusDuration(MINUTE_DURATION).toString()).equal("2019-07-05T18:29:15.225");
		expect(dateTime.minusDuration(HOUR_DURATION).toString()).equal("2019-07-05T17:30:15.225");
		expect(dateTime.minusDuration(DAY_DURATION).toString()).equal("2019-07-04T18:30:15.225");
		expect(dateTime.minusDuration(Duration.ofDays(5)).toString()).equal("2019-06-30T18:30:15.225");
		expect(dateTime.minusDuration(Duration.ofDays(30)).toString()).equal("2019-06-05T18:30:15.225");
		expect(dateTime.minusDuration(Duration.ofDays(365)).toString()).equal("2018-07-05T18:30:15.225");
		expect(dateTime.minusDuration(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).equal("2019-07-04T16:27:11.220");
		expect(dateTime.minusDuration(Duration.of(-1)).toString()).equal("2019-07-05T18:30:15.226");
		expect(dateTime.minusDuration(Duration.ofDays(-366)).toString()).equal("2020-07-05T18:30:15.225");
	});

	it("should subtract zero duration", () => {
		expect(dateTime.minusDuration(NULL_DURATION)).equal(dateTime);
	});

	it("should modify year", () => {
		expect(dateTime.withYear(1996).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(1996, JULY, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2016, FEBRUARY, 29, 18, 30, 15, 225).withYear(2015).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2015, FEBRUARY, 28, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should modify month", () => {
		expect(dateTime.withMonth(NOVEMBER).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, NOVEMBER, 5, 18, 30, 15, 225).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2015, MARCH, 30, 18, 30, 15, 225).withMonth(FEBRUARY).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2015, FEBRUARY, 28, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should modify day of month", () => {
		expect(dateTime.withDayOfMonth(28).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 28, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should modify day of year", () => {
		expect(dateTime.withDayOfYear(31 + 8).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, FEBRUARY, 8, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should modify day of week", () => {
		expect(LocalDateTime.ofComponents(2019, AUGUST, 10, 18, 30, 15, 225).withDayOfWeek(TUESDAY).nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, AUGUST, 6, 18, 30, 15, 225).nativeUtc.getTime());
	});

	it("should modify hour", () => {
		expect(dateTime.withHour(15).toString()).equal("2019-07-05T15:30:15.225");
	});

	it("should modify minute", () => {
		expect(dateTime.withMinute(15).toString()).equal("2019-07-05T18:15:15.225");
	});

	it("should modify second", () => {
		expect(dateTime.withSecond(12).toString()).equal("2019-07-05T18:30:12.225");
	});

	it("should modify millisecond", () => {
		expect(dateTime.withMs(15).toString()).equal("2019-07-05T18:30:15.015");
	});

	it("should truncate itself to year", () => {
		expect(dateTime.truncateToYear.nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JANUARY, 1).nativeUtc.getTime());
	});

	it("should truncate itself to week based year", () => {
		expect(dateTime.truncateToWeekBasedYear.nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2018, DECEMBER, 31).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2017, JULY, 5).truncateToWeekBasedYear.nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2017, JANUARY, 2).nativeUtc.getTime());
	});

	it("should truncate itself to month", () => {
		expect(dateTime.truncateToMonth.nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 1).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2019, AUGUST, 5).truncateToMonth.nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, AUGUST, 1).nativeUtc.getTime());
	});

	it("should truncate itself to week", () => {
		expect(dateTime.truncateToWeek.nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 1).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2019, JULY, 29).truncateToWeek.nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 29).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2019, AUGUST, 1).truncateToWeek.nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 29).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2019, AUGUST, 4).truncateToWeek.nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, JULY, 29).nativeUtc.getTime());
		expect(LocalDateTime.ofComponents(2019, AUGUST, 5).truncateToWeek.nativeUtc.getTime())
			.equal(LocalDateTime.ofComponents(2019, AUGUST, 5).nativeUtc.getTime());
	});

	it("should truncate itself to hour", () => {
		expect(dateTime.truncateToHour.toString()).equal("2019-07-05T18:00:00.000");
	});

	it("should truncate itself to minute", () => {
		expect(dateTime.truncateToMinute.toString()).equal("2019-07-05T18:30:00.000");
	});

	it("should truncate itself to second", () => {
		expect(dateTime.truncateToSecond.toString()).equal("2019-07-05T18:30:15.000");
	});

	it("should convert itself to string", () => {
		expect(dateTime.toString()).equal("2019-07-05T18:30:15.225");
		expect(LocalDateTime.ofComponents(2019, JULY, 5, 8, 3, 5, 16).toString()).equal("2019-07-05T08:03:05.016");
	});

	it("should create proper offset date/time (atOffset)", () => {
		expect(dateTime.atOffset(UTC).toString()).equal("2019-07-05T18:30:15.225Z");
		expect(dateTime.atOffset(ZoneOffset.ofComponents(3)).toString()).equal("2019-07-05T18:30:15.225+03:00");
		expect(dateTime.atOffset(ZoneOffset.ofComponents(-3)).toString()).equal("2019-07-05T18:30:15.225-03:00");
	});

	it("should create proper zoned date/time (atZone)", () => {
		expect(dateTime.atZone(UTC).toString()).equal("2019-07-05T18:30:15.225Z");
		expect(dateTime.atZone(ZoneId.of("Europe/Berlin")).toString()).equal("2019-07-05T18:30:15.225+02:00[Europe/Berlin]");
	});
});
