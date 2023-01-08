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
import {FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY} from "ts-time/DayOfWeek";
import {AD, BC} from "ts-time/Era";
import Instant from "ts-time/Instant";
import LocalDate, {EPOCH_DATE} from "ts-time/LocalDate";
import LocalDateTime from "ts-time/LocalDateTime";
import LocalTime, {MIDNIGHT, NOON} from "ts-time/LocalTime";
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
import OffsetDateTime from "ts-time/OffsetDateTime";
import Period, {DAY_PERIOD, MONTH_PERIOD, NULL_PERIOD, QUARTER_PERIOD, WEEK_PERIOD, YEAR_PERIOD} from "ts-time/Period";
import {ZoneId, ZoneOffset} from "ts-time/Zone";
import ZonedDateTime from "ts-time/ZonedDateTime";

// TODO: Add out of bounds tests (e.g. constructors)
// TODO: Add numeric month/weekday tests
describe("LocalDate", () => {
	const july5 = LocalDate.of(2019, JULY, 5);

	it("should return proper year", () => {
		expect(july5.year).equal(2019);
		expect(LocalDate.of(2019, JANUARY, 1).year).equal(2019);
		expect(LocalDate.of(2018, DECEMBER, 31).year).equal(2018);
		expect(LocalDate.of(2018, JANUARY, 1).year).equal(2018);
		expect(LocalDate.of(2017, DECEMBER, 31).year).equal(2017);
	});

	it("should return proper month", () => {
		expect(july5.month).equal(JULY);
		expect(LocalDate.of(2019, JULY, 1).month).equal(JULY);
		expect(LocalDate.of(2019, JUNE, 30).month).equal(JUNE);
		expect(LocalDate.of(2019, JANUARY, 1).month).equal(JANUARY);
		expect(LocalDate.of(2018, DECEMBER, 31).month).equal(DECEMBER);
	});

	it("should return proper day of week", () => {
		expect(july5.dayOfWeek).equal(FRIDAY);
		expect(LocalDate.of(2019, JULY, 1).dayOfWeek).equal(MONDAY);
		expect(LocalDate.of(2019, JUNE, 30).dayOfWeek).equal(SUNDAY);
		expect(LocalDate.of(2019, JUNE, 29).dayOfWeek).equal(SATURDAY);
		expect(LocalDate.of(2019, JUNE, 28).dayOfWeek).equal(FRIDAY);
		expect(LocalDate.of(2019, JUNE, 27).dayOfWeek).equal(THURSDAY);
		expect(LocalDate.of(2019, JUNE, 26).dayOfWeek).equal(WEDNESDAY);
		expect(LocalDate.of(2019, JUNE, 25).dayOfWeek).equal(TUESDAY);
		expect(LocalDate.of(2019, JUNE, 24).dayOfWeek).equal(MONDAY);
		expect(LocalDate.of(2019, JUNE, 3).dayOfWeek).equal(MONDAY);
		expect(LocalDate.of(2019, JUNE, 2).dayOfWeek).equal(SUNDAY);
		expect(LocalDate.of(2019, JUNE, 1).dayOfWeek).equal(SATURDAY);
		expect(LocalDate.of(2019, MAY, 31).dayOfWeek).equal(FRIDAY);
	});

	it("should return proper day of month", () => {
		expect(july5.dayOfMonth).equal(5);
		expect(LocalDate.of(2019, JULY, 1).dayOfMonth).equal(1);
		expect(LocalDate.of(2019, JUNE, 30).dayOfMonth).equal(30);
		expect(LocalDate.of(2019, JUNE, 1).dayOfMonth).equal(1);
		expect(LocalDate.of(2019, MAY, 31).dayOfMonth).equal(31);
	});

	it("should return proper day of year", () => {
		expect(july5.dayOfYear).equal(31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(LocalDate.of(2019, JANUARY, 1).dayOfYear).equal(1);
		expect(LocalDate.of(2018, DECEMBER, 31).dayOfYear).equal(365);
		expect(LocalDate.of(2017, JANUARY, 1).dayOfYear).equal(1);
		expect(LocalDate.of(2016, DECEMBER, 31).dayOfYear).equal(366);
	});

	it("should return proper epoch day", () => {
		expect(july5.epochDay).equal(365 * 49 + 12 + july5.dayOfYear);
		expect(LocalDate.of(1970, JANUARY, 1).epochDay).equal(1);
		expect(LocalDate.of(1970, DECEMBER, 31).epochDay).equal(365);
		expect(LocalDate.of(1971, JANUARY, 1).epochDay).equal(366);
		expect(LocalDate.of(1971, DECEMBER, 31).epochDay).equal(365 + 365);
		expect(LocalDate.of(1972, JANUARY, 1).epochDay).equal(365 + 365 + 1);
		expect(LocalDate.of(1972, DECEMBER, 31).epochDay).equal(365 + 365 + 366);
		expect(LocalDate.of(1973, JANUARY, 1).epochDay).equal(365 + 365 + 366 + 1);
		expect(LocalDate.of(1969, DECEMBER, 31).epochDay).equal(0);
		expect(LocalDate.of(1969, DECEMBER, 30).epochDay).equal(-1);
		expect(LocalDate.of(1969, DECEMBER, 29).epochDay).equal(-2);
	});

	it("should return proper leap year flag", () => {
		expect(july5.isLeapYear).equal(false);
		expect(LocalDate.of(0, SEPTEMBER, 12).isLeapYear).equal(true);
		expect(LocalDate.of(1, OCTOBER, 15).isLeapYear).equal(false);
		expect(LocalDate.of(2, MARCH, 30).isLeapYear).equal(false);
		expect(LocalDate.of(3, JANUARY, 16).isLeapYear).equal(false);
		expect(LocalDate.of(4, DECEMBER, 20).isLeapYear).equal(true);
		expect(LocalDate.of(5, JULY, 1).isLeapYear).equal(false);
		expect(LocalDate.of(6, JUNE, 5).isLeapYear).equal(false);
		expect(LocalDate.of(7, FEBRUARY, 10).isLeapYear).equal(false);
		expect(LocalDate.of(8, JANUARY, 7).isLeapYear).equal(true);
		expect(LocalDate.of(100, NOVEMBER, 2).isLeapYear).equal(false);
		expect(LocalDate.of(200, AUGUST, 8).isLeapYear).equal(false);
		expect(LocalDate.of(300, MAY, 9).isLeapYear).equal(false);
		expect(LocalDate.of(400, JANUARY, 12).isLeapYear).equal(true);
		expect(LocalDate.of(2000, JANUARY, 1).isLeapYear).equal(true);
		expect(LocalDate.of(2001, JANUARY, 1).isLeapYear).equal(false);
		expect(LocalDate.of(2002, JANUARY, 1).isLeapYear).equal(false);
		expect(LocalDate.of(2003, JANUARY, 1).isLeapYear).equal(false);
		expect(LocalDate.of(2004, JANUARY, 1).isLeapYear).equal(true);
		expect(LocalDate.of(-1, JANUARY, 1).isLeapYear).equal(false);
		expect(LocalDate.of(-2, JANUARY, 1).isLeapYear).equal(false);
		expect(LocalDate.of(-3, JANUARY, 1).isLeapYear).equal(false);
		expect(LocalDate.of(-4, JANUARY, 1).isLeapYear).equal(true);
		expect(LocalDate.of(-100, JANUARY, 1).isLeapYear).equal(false);
		expect(LocalDate.of(-200, JANUARY, 1).isLeapYear).equal(false);
		expect(LocalDate.of(-300, JANUARY, 1).isLeapYear).equal(false);
		expect(LocalDate.of(-400, JANUARY, 1).isLeapYear).equal(true);
	});

	it("should return proper length of year", () => {
		expect(july5.lengthOfYear).equal(365);
		expect(LocalDate.of(0, SEPTEMBER, 12).lengthOfYear).equal(366);
		expect(LocalDate.of(1, OCTOBER, 15).lengthOfYear).equal(365);
		expect(LocalDate.of(2, MARCH, 30).lengthOfYear).equal(365);
		expect(LocalDate.of(3, JANUARY, 16).lengthOfYear).equal(365);
		expect(LocalDate.of(4, DECEMBER, 20).lengthOfYear).equal(366);
		expect(LocalDate.of(5, JULY, 1).lengthOfYear).equal(365);
		expect(LocalDate.of(6, JUNE, 5).lengthOfYear).equal(365);
		expect(LocalDate.of(7, FEBRUARY, 10).lengthOfYear).equal(365);
		expect(LocalDate.of(8, JANUARY, 7).lengthOfYear).equal(366);
		expect(LocalDate.of(100, NOVEMBER, 2).lengthOfYear).equal(365);
		expect(LocalDate.of(200, AUGUST, 8).lengthOfYear).equal(365);
		expect(LocalDate.of(300, MAY, 9).lengthOfYear).equal(365);
		expect(LocalDate.of(400, JANUARY, 12).lengthOfYear).equal(366);
		expect(LocalDate.of(2000, JANUARY, 1).lengthOfYear).equal(366);
		expect(LocalDate.of(2001, JANUARY, 1).lengthOfYear).equal(365);
		expect(LocalDate.of(2002, JANUARY, 1).lengthOfYear).equal(365);
		expect(LocalDate.of(2003, JANUARY, 1).lengthOfYear).equal(365);
		expect(LocalDate.of(2004, JANUARY, 1).lengthOfYear).equal(366);
		expect(LocalDate.of(-1, JANUARY, 1).lengthOfYear).equal(365);
		expect(LocalDate.of(-2, JANUARY, 1).lengthOfYear).equal(365);
		expect(LocalDate.of(-3, JANUARY, 1).lengthOfYear).equal(365);
		expect(LocalDate.of(-4, JANUARY, 1).lengthOfYear).equal(366);
		expect(LocalDate.of(-100, JANUARY, 1).lengthOfYear).equal(365);
		expect(LocalDate.of(-200, JANUARY, 1).lengthOfYear).equal(365);
		expect(LocalDate.of(-300, JANUARY, 1).lengthOfYear).equal(365);
		expect(LocalDate.of(-400, JANUARY, 1).lengthOfYear).equal(366);
	});

	it("should return proper native UTC date", () => {
		expect(july5.nativeUtc.getTime()).equal(Date.UTC(2019, 6, 5));

		const date = utc(0, 0, 1, 0, 0, 0, 0);
		expect(LocalDate.of(0, JANUARY, 1).nativeUtc.getTime()).equal(date.getTime());
		expect(LocalDate.of(2014, DECEMBER, 31).nativeUtc.getTime()).equal(Date.UTC(2014, 11, 31));
	});

	// Note: This test is environment-dependent, as local time zone may differ
	it("should return proper native local date", () => {
		expect(july5.nativeLocal.getTime()).equal(new Date(2019, 6, 5).getTime());
		expect(LocalDate.of(0, JANUARY, 1).nativeLocal.getTime()).equal(new Date(0, 0, 1).getTime());
		expect(LocalDate.of(2014, DECEMBER, 31).nativeLocal.getTime()).equal(new Date(2014, 11, 31).getTime());
	});

	it("should return proper quarter of year", () => {
		expect(july5.quarterOfYear).equal(3);
		expect(LocalDate.of(2016, JANUARY, 1).quarterOfYear).equal(1);
		expect(LocalDate.of(2016, MARCH, 31).quarterOfYear).equal(1);
		expect(LocalDate.of(2016, APRIL, 1).quarterOfYear).equal(2);
		expect(LocalDate.of(2016, JUNE, 30).quarterOfYear).equal(2);
		expect(LocalDate.of(2016, JULY, 1).quarterOfYear).equal(3);
		expect(LocalDate.of(2016, SEPTEMBER, 30).quarterOfYear).equal(3);
		expect(LocalDate.of(2016, OCTOBER, 1).quarterOfYear).equal(4);
		expect(LocalDate.of(2016, DECEMBER, 31).quarterOfYear).equal(4);
		expect(LocalDate.of(2017, JANUARY, 1).quarterOfYear).equal(1);
	});

	it("should return week based fields", () => {
		expect(july5.dayOfWeek).equal(FRIDAY);
		expect(july5.dayOfWeekBasedYear).equal(1 + 31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(july5.weekBasedYear).equal(2019);
		expect(july5.weekOfWeekBasedYear).equal(27);

		const date1 = LocalDate.of(2018, JANUARY, 1);
		expect(date1.dayOfWeek).equal(MONDAY);
		expect(date1.weekBasedYear).equal(2018);
		expect(date1.weekOfWeekBasedYear).equal(1);
		expect(date1.dayOfWeekBasedYear).equal(1);

		const date2 = LocalDate.of(2017, DECEMBER, 31);
		expect(date2.dayOfWeek).equal(SUNDAY);
		expect(date2.weekBasedYear).equal(2017);
		expect(date2.weekOfWeekBasedYear).equal(52);
		expect(date2.dayOfWeekBasedYear).equal(364);

		const date3 = LocalDate.of(2017, JANUARY, 2);
		expect(date3.dayOfWeek).equal(MONDAY);
		expect(date3.weekBasedYear).equal(2017);
		expect(date3.weekOfWeekBasedYear).equal(1);
		expect(date3.dayOfWeekBasedYear).equal(1);

		const date4 = LocalDate.of(2017, JANUARY, 1);
		expect(date4.dayOfWeek).equal(SUNDAY);
		expect(date4.weekBasedYear).equal(2016);
		expect(date4.weekOfWeekBasedYear).equal(52);
		expect(date4.dayOfWeekBasedYear).equal(364);

		const date5 = LocalDate.of(2016, DECEMBER, 31);
		expect(date5.dayOfWeek).equal(SATURDAY);
		expect(date5.weekBasedYear).equal(2016);
		expect(date5.weekOfWeekBasedYear).equal(52);
		expect(date5.dayOfWeekBasedYear).equal(363);

		const date6 = LocalDate.of(2016, JANUARY, 4);
		expect(date6.dayOfWeek).equal(MONDAY);
		expect(date6.weekBasedYear).equal(2016);
		expect(date6.weekOfWeekBasedYear).equal(1);
		expect(date6.dayOfWeekBasedYear).equal(1);

		const date7 = LocalDate.of(2016, JANUARY, 3);
		expect(date7.dayOfWeek).equal(SUNDAY);
		expect(date7.weekBasedYear).equal(2015);
		expect(date7.weekOfWeekBasedYear).equal(53);
		expect(date7.dayOfWeekBasedYear).equal(371);

		const date8 = LocalDate.of(2014, DECEMBER, 29);
		expect(date8.dayOfWeek).equal(MONDAY);
		expect(date8.weekBasedYear).equal(2015);
		expect(date8.weekOfWeekBasedYear).equal(1);
		expect(date8.dayOfWeekBasedYear).equal(1);

		const date9 = LocalDate.of(2014, DECEMBER, 28);
		expect(date9.dayOfWeek).equal(SUNDAY);
		expect(date9.weekBasedYear).equal(2014);
		expect(date9.weekOfWeekBasedYear).equal(52);
		expect(date9.dayOfWeekBasedYear).equal(364);

		const date10 = LocalDate.of(9, JANUARY, 5);
		expect(date10.dayOfWeek).equal(MONDAY);
		expect(date10.weekBasedYear).equal(9);
		expect(date10.weekOfWeekBasedYear).equal(2);
		expect(date10.dayOfWeekBasedYear).equal(8);
	});

	it("should provide epoch date", () => {
		expect(EPOCH_DATE.year).equal(1970);
		expect(EPOCH_DATE.month).equal(JANUARY);
		expect(EPOCH_DATE.dayOfYear).equal(1);
	});

	it("should construct from epoch day", () => {
		const date = LocalDate.ofEpochDay(1000); // 365 + 365 + (31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 26)
		expect(date.year).equal(1972);
		expect(date.month).equal(SEPTEMBER);
		expect(date.dayOfMonth).equal(26);
		expect(date.epochDay).equal(1000);

		expect(LocalDate.ofEpochDay(1).epochDay).equal(1);
		expect(LocalDate.ofEpochDay(0).epochDay).equal(0);
		expect(LocalDate.ofEpochDay(-1).epochDay).equal(-1);
		expect(LocalDate.ofEpochDay(1000).epochDay).equal(1000);
		expect(LocalDate.ofEpochDay(-1000).epochDay).equal(-1000);
		expect(LocalDate.ofEpochDay(100000).epochDay).equal(100000);
	});

	it("should construct from year day", () => {
		expect(LocalDate.ofYearDay(2018, 1).nativeUtc.getTime()).equal(LocalDate.of(2018, JANUARY, 1).nativeUtc.getTime());
		expect(LocalDate.ofYearDay(2017, 365).nativeUtc.getTime()).equal(LocalDate.of(2017, DECEMBER, 31).nativeUtc.getTime());
		expect(LocalDate.ofYearDay(2017, 1).nativeUtc.getTime()).equal(LocalDate.of(2017, JANUARY, 1).nativeUtc.getTime());
		expect(LocalDate.ofYearDay(2016, 366).nativeUtc.getTime()).equal(LocalDate.of(2016, DECEMBER, 31).nativeUtc.getTime());
		expect(LocalDate.ofYearDay(2016, 1).nativeUtc.getTime()).equal(LocalDate.of(2016, JANUARY, 1).nativeUtc.getTime());
		expect(LocalDate.ofYearDay(2015, 365).nativeUtc.getTime()).equal(LocalDate.of(2015, DECEMBER, 31).nativeUtc.getTime());
		expect(LocalDate.ofYearDay(2015, 1).nativeUtc.getTime()).equal(LocalDate.of(2015, JANUARY, 1).nativeUtc.getTime());
		expect(LocalDate.ofYearDay(2014, 365).nativeUtc.getTime()).equal(LocalDate.of(2014, DECEMBER, 31).nativeUtc.getTime());
	});

	it("should construct from week", () => {
		expect(LocalDate.ofWeek(2018, 1, MONDAY).nativeUtc.getTime()).equal(LocalDate.of(2018, JANUARY, 1).nativeUtc.getTime());
		expect(LocalDate.ofWeek(2017, 52, SUNDAY).nativeUtc.getTime()).equal(LocalDate.of(2017, DECEMBER, 31).nativeUtc.getTime());
		expect(LocalDate.ofWeek(2017, 1, MONDAY).nativeUtc.getTime()).equal(LocalDate.of(2017, JANUARY, 2).nativeUtc.getTime());
		expect(LocalDate.ofWeek(2016, 52, SUNDAY).nativeUtc.getTime()).equal(LocalDate.of(2017, JANUARY, 1).nativeUtc.getTime());
		expect(LocalDate.ofWeek(2016, 52, SATURDAY).nativeUtc.getTime()).equal(LocalDate.of(2016, DECEMBER, 31).nativeUtc.getTime());
		expect(LocalDate.ofWeek(2016, 1, MONDAY).nativeUtc.getTime()).equal(LocalDate.of(2016, JANUARY, 4).nativeUtc.getTime());
		expect(LocalDate.ofWeek(2015, 53, SUNDAY).nativeUtc.getTime()).equal(LocalDate.of(2016, JANUARY, 3).nativeUtc.getTime());
		expect(LocalDate.ofWeek(2015, 1, MONDAY).nativeUtc.getTime()).equal(LocalDate.of(2014, DECEMBER, 29).nativeUtc.getTime());
		expect(LocalDate.ofWeek(2014, 52, SUNDAY).nativeUtc.getTime()).equal(LocalDate.of(2014, DECEMBER, 28).nativeUtc.getTime());
	});

	it("should construct from week based year day", () => {
		expect(LocalDate.ofWeekBasedYearDay(2018, 1).nativeUtc.getTime()).equal(LocalDate.of(2018, JANUARY, 1).nativeUtc.getTime());
		expect(LocalDate.ofWeekBasedYearDay(2017, 364).nativeUtc.getTime()).equal(LocalDate.of(2017, DECEMBER, 31).nativeUtc.getTime());
		expect(LocalDate.ofWeekBasedYearDay(2017, 1).nativeUtc.getTime()).equal(LocalDate.of(2017, JANUARY, 2).nativeUtc.getTime());
		expect(LocalDate.ofWeekBasedYearDay(2016, 364).nativeUtc.getTime()).equal(LocalDate.of(2017, JANUARY, 1).nativeUtc.getTime());
		expect(LocalDate.ofWeekBasedYearDay(2016, 363).nativeUtc.getTime()).equal(LocalDate.of(2016, DECEMBER, 31).nativeUtc.getTime());
		expect(LocalDate.ofWeekBasedYearDay(2016, 1).nativeUtc.getTime()).equal(LocalDate.of(2016, JANUARY, 4).nativeUtc.getTime());
		expect(LocalDate.ofWeekBasedYearDay(2015, 371).nativeUtc.getTime()).equal(LocalDate.of(2016, JANUARY, 3).nativeUtc.getTime());
		expect(LocalDate.ofWeekBasedYearDay(2015, 1).nativeUtc.getTime()).equal(LocalDate.of(2014, DECEMBER, 29).nativeUtc.getTime());
		expect(LocalDate.ofWeekBasedYearDay(2014, 364).nativeUtc.getTime()).equal(LocalDate.of(2014, DECEMBER, 28).nativeUtc.getTime());
	});

	// Note: This test is environment-dependent, as local time zone may differ
	it("should construct from native local", () => {
		expect(LocalDate.fromNativeLocal(new Date(2019, 6, 5)).nativeUtc.getTime())
			.equal(LocalDate.of(2019, JULY, 5).nativeUtc.getTime());
		expect(LocalDate.fromNativeLocal(new Date(2019, 6, 5, 18, 30, 15, 225)).nativeUtc.getTime())
			.equal(LocalDate.of(2019, JULY, 5).nativeUtc.getTime());
	});

	it("should return null by native local null", () => {
		expect(LocalDate.fromNativeLocal(null)).equal(null);
	});

	it("should construct from native UTC", () => {
		expect(LocalDate.fromNativeUtc(new Date(Date.UTC(2019, 6, 5))).nativeUtc.getTime())
			.equal(LocalDate.of(2019, JULY, 5).nativeUtc.getTime());
		expect(LocalDate.fromNativeUtc(new Date(Date.UTC(2019, 6, 5, 18, 30, 15, 225))).nativeUtc.getTime())
			.equal(LocalDate.of(2019, JULY, 5).nativeUtc.getTime());
	});

	it("should return null by native UTC null", () => {
		expect(LocalDate.fromNativeUtc(null)).equal(null);
	});

	it("should construct from string", () => {
		expect(LocalDate.parse("2019-07-05").nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 5).nativeUtc.getTime());
		expect(LocalDate.parse("2019-7-5").nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 5).nativeUtc.getTime());
	});

	it("should throw an error by invalid string", () => {
		const expectError = (str: string) => {
			expect(() => LocalDate.parse(str))
				.throw(`Unable to parse '${str}' as a local date. ISO 8601 date string expected.`);
		};

		expectError("abc");
		expectError("18:30");
		expectError("18:30:15");
		expectError("18:30:15.225");
		expectError("2019-07-05T18:30:15.225");
		expectError("2019-07-05T18:30:15.225Z");
		expectError("2019-07-05T18:30:15.225+00:00");
		expectError("2019-07-05T18:30:15.225[Europe/Berlin]");
		expectError("2019-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expectError("2019-07-aa");
	});

	it("should support two eras", () => {
		expect(july5.yearOfEra).equal(2019);
		expect(july5.era).equal(AD);

		const date1 = LocalDate.of(1, JANUARY, 1);
		expect(date1.year).equal(1);
		expect(date1.yearOfEra).equal(1);
		expect(date1.era).equal(AD);
		expect(date1.month).equal(JANUARY);
		expect(date1.dayOfMonth).equal(1);

		const date2 = LocalDate.of(0, DECEMBER, 31);
		expect(date2.year).equal(0);
		expect(date2.yearOfEra).equal(0);
		expect(date2.era).equal(BC);
		expect(date2.month).equal(DECEMBER);
		expect(date2.dayOfMonth).equal(31);

		const date3 = LocalDate.of(0, JANUARY, 1);
		expect(date3.year).equal(0);
		expect(date3.yearOfEra).equal(0);
		expect(date3.era).equal(BC);
		expect(date3.month).equal(JANUARY);
		expect(date3.dayOfMonth).equal(1);

		const date4 = LocalDate.of(-1, DECEMBER, 31);
		expect(date4.year).equal(-1);
		expect(date4.yearOfEra).equal(1);
		expect(date4.era).equal(BC);
		expect(date4.month).equal(DECEMBER);
		expect(date4.dayOfMonth).equal(31);

		const date5 = LocalDate.of(-1, JANUARY, 1);
		expect(date5.year).equal(-1);
		expect(date5.yearOfEra).equal(1);
		expect(date5.era).equal(BC);
		expect(date5.month).equal(JANUARY);
		expect(date5.dayOfMonth).equal(1);
	});

	it("should compare itself", () => {
		expect(july5.compareTo(LocalDate.of(2018, SEPTEMBER, 10))).greaterThan(0);
		expect(july5.compareTo(LocalDate.of(2019, JUNE, 10))).greaterThan(0);
		expect(july5.compareTo(LocalDate.of(2019, JULY, 3))).greaterThan(0);
		expect(july5.compareTo(LocalDate.of(2019, JULY, 4))).greaterThan(0);
		expect(july5.compareTo(LocalDate.of(2019, JULY, 5))).equal(0);
		expect(july5.compareTo(july5)).equal(0);
		expect(july5.compareTo(LocalDate.of(2019, JULY, 6))).lessThan(0);
		expect(july5.compareTo(LocalDate.of(2019, JULY, 7))).lessThan(0);
		expect(july5.compareTo(LocalDate.of(2019, AUGUST, 1))).lessThan(0);
		expect(july5.compareTo(LocalDate.of(2020, FEBRUARY, 1))).lessThan(0);
	});

	it("should compare itself statically", () => {
		expect(LocalDate.compare(july5, LocalDate.of(2018, SEPTEMBER, 10))).greaterThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JUNE, 10))).greaterThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JULY, 3))).greaterThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JULY, 4))).greaterThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JULY, 5))).equal(0);
		expect(LocalDate.compare(july5, july5)).equal(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JULY, 6))).lessThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, JULY, 7))).lessThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2019, AUGUST, 1))).lessThan(0);
		expect(LocalDate.compare(july5, LocalDate.of(2020, FEBRUARY, 1))).lessThan(0);
	});

	it("should compare itself with null", () => {
		expect(july5.compareTo(null)).greaterThan(0);
		expect(LocalDate.compare(july5, null)).greaterThan(0);
		expect(LocalDate.compare(null, july5)).lessThan(0);
		expect(LocalDate.compare(null, null)).equal(0);
	});

	it("should check itself for equality", () => {
		expect(july5.equals(LocalDate.of(2018, SEPTEMBER, 10))).equal(false);
		expect(july5.equals(LocalDate.of(2019, JULY, 10))).equal(false);
		expect(july5.equals(LocalDate.of(2019, JUNE, 5))).equal(false);
		expect(july5.equals(LocalDate.of(2018, JULY, 5))).equal(false);
		expect(july5.equals(LocalDate.of(2019, JULY, 5))).equal(true);
		expect(july5.equals(july5)).equal(true);
	});

	it("should check itself for equality statically", () => {
		expect(LocalDate.equal(july5, LocalDate.of(2018, SEPTEMBER, 10))).equal(false);
		expect(LocalDate.equal(july5, LocalDate.of(2019, JULY, 10))).equal(false);
		expect(LocalDate.equal(july5, LocalDate.of(2019, JUNE, 5))).equal(false);
		expect(LocalDate.equal(july5, LocalDate.of(2018, JULY, 5))).equal(false);
		expect(LocalDate.equal(july5, LocalDate.of(2019, JULY, 5))).equal(true);
		expect(LocalDate.equal(july5, july5)).equal(true);
	});

	it("should check itself for equality with null", () => {
		expect(july5.equals(null)).equal(false);
		expect(LocalDate.equal(july5, null)).equal(false);
		expect(LocalDate.equal(null, july5)).equal(false);
		expect(LocalDate.equal(null, null)).equal(true);
	});

	it("should compare itself with isBefore method", () => {
		expect(july5.isBefore(LocalDate.of(2018, SEPTEMBER, 10))).equal(false);
		expect(july5.isBefore(LocalDate.of(2019, JUNE, 10))).equal(false);
		expect(july5.isBefore(LocalDate.of(2019, JULY, 3))).equal(false);
		expect(july5.isBefore(LocalDate.of(2019, JULY, 4))).equal(false);
		expect(july5.isBefore(LocalDate.of(2019, JULY, 5))).equal(false);
		expect(july5.isBefore(july5)).equal(false);
		expect(july5.isBefore(LocalDate.of(2019, JULY, 6))).equal(true);
		expect(july5.isBefore(LocalDate.of(2019, JULY, 7))).equal(true);
		expect(july5.isBefore(LocalDate.of(2019, AUGUST, 1))).equal(true);
		expect(july5.isBefore(LocalDate.of(2020, FEBRUARY, 1))).equal(true);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(LocalDate.isBefore(july5, LocalDate.of(2018, SEPTEMBER, 10))).equal(false);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JUNE, 10))).equal(false);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JULY, 3))).equal(false);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JULY, 4))).equal(false);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JULY, 5))).equal(false);
		expect(LocalDate.isBefore(july5, july5)).equal(false);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JULY, 6))).equal(true);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, JULY, 7))).equal(true);
		expect(LocalDate.isBefore(july5, LocalDate.of(2019, AUGUST, 1))).equal(true);
		expect(LocalDate.isBefore(july5, LocalDate.of(2020, FEBRUARY, 1))).equal(true);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(july5.isBefore(null)).equal(false);
		expect(LocalDate.isBefore(july5, null)).equal(false);
		expect(LocalDate.isBefore(null, july5)).equal(true);
		expect(LocalDate.isBefore(null, null)).equal(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(july5.isAfter(LocalDate.of(2018, SEPTEMBER, 10))).equal(true);
		expect(july5.isAfter(LocalDate.of(2019, JUNE, 10))).equal(true);
		expect(july5.isAfter(LocalDate.of(2019, JULY, 3))).equal(true);
		expect(july5.isAfter(LocalDate.of(2019, JULY, 4))).equal(true);
		expect(july5.isAfter(LocalDate.of(2019, JULY, 5))).equal(false);
		expect(july5.isAfter(july5)).equal(false);
		expect(july5.isAfter(LocalDate.of(2019, JULY, 6))).equal(false);
		expect(july5.isAfter(LocalDate.of(2019, JULY, 7))).equal(false);
		expect(july5.isAfter(LocalDate.of(2019, AUGUST, 1))).equal(false);
		expect(july5.isAfter(LocalDate.of(2020, FEBRUARY, 1))).equal(false);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(LocalDate.isAfter(july5, LocalDate.of(2018, SEPTEMBER, 10))).equal(true);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JUNE, 10))).equal(true);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JULY, 3))).equal(true);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JULY, 4))).equal(true);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JULY, 5))).equal(false);
		expect(LocalDate.isAfter(july5, july5)).equal(false);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JULY, 6))).equal(false);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, JULY, 7))).equal(false);
		expect(LocalDate.isAfter(july5, LocalDate.of(2019, AUGUST, 1))).equal(false);
		expect(LocalDate.isAfter(july5, LocalDate.of(2020, FEBRUARY, 1))).equal(false);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(july5.isAfter(null)).equal(true);
		expect(LocalDate.isAfter(july5, null)).equal(true);
		expect(LocalDate.isAfter(null, july5)).equal(false);
		expect(LocalDate.isAfter(null, null)).equal(false);
	});

	it("should create proper start of day (atStartOfDay)", () => {
		expect(july5.atStartOfDay.nativeUtc.getTime()).equal(Date.UTC(2019, 6, 5, 0, 0, 0, 0));
	});

	it("should create proper moment of day (atTime)", () => {
		expect(july5.atTime(MIDNIGHT).nativeUtc.getTime()).equal(Date.UTC(2019, 6, 5, 0, 0, 0, 0));
		expect(july5.atTime(NOON).nativeUtc.getTime()).equal(Date.UTC(2019, 6, 5, 12, 0, 0, 0));
		expect(july5.atTime(LocalTime.of(1, 2, 3, 4)).nativeUtc.getTime()).equal(Date.UTC(2019, 6, 5, 1, 2, 3, 4));
	});

	it("should add a period", () => {
		expect(july5.plus(YEAR_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2020, JULY, 5).nativeUtc.getTime());
		expect(july5.plus(MONTH_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, AUGUST, 5).nativeUtc.getTime());
		expect(july5.plus(DAY_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 6).nativeUtc.getTime());
		expect(july5.plus(QUARTER_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, OCTOBER, 5).nativeUtc.getTime());
		expect(july5.plus(WEEK_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 12).nativeUtc.getTime());
	});

	it("should add zero period", () => {
		expect(july5.plus(NULL_PERIOD)).equal(july5);
	});

	it("should add multiple periods", () => {
		expect(july5.plus(Period.ofYears(2)).nativeUtc.getTime()).equal(LocalDate.of(2021, JULY, 5).nativeUtc.getTime());
		expect(july5.plus(Period.ofMonths(9)).nativeUtc.getTime()).equal(LocalDate.of(2020, APRIL, 5).nativeUtc.getTime());
		expect(july5.plus(Period.ofDays(30)).nativeUtc.getTime()).equal(LocalDate.of(2019, AUGUST, 4).nativeUtc.getTime());
		expect(july5.plus(Period.ofQuarters(3)).nativeUtc.getTime()).equal(LocalDate.of(2020, APRIL, 5).nativeUtc.getTime());
		expect(july5.plus(Period.ofWeeks(5)).nativeUtc.getTime()).equal(LocalDate.of(2019, AUGUST, 9).nativeUtc.getTime());
	});

	it("should add negative periods", () => {
		expect(july5.plus(Period.ofYears(-2)).nativeUtc.getTime()).equal(LocalDate.of(2017, JULY, 5).nativeUtc.getTime());
		expect(july5.plus(Period.ofMonths(-9)).nativeUtc.getTime()).equal(LocalDate.of(2018, OCTOBER, 5).nativeUtc.getTime());
		expect(july5.plus(Period.ofDays(-30)).nativeUtc.getTime()).equal(LocalDate.of(2019, JUNE, 5).nativeUtc.getTime());
		expect(july5.plus(Period.ofQuarters(-3)).nativeUtc.getTime()).equal(LocalDate.of(2018, OCTOBER, 5).nativeUtc.getTime());
		expect(july5.plus(Period.ofWeeks(-5)).nativeUtc.getTime()).equal(LocalDate.of(2019, MAY, 31).nativeUtc.getTime());
	});

	it("should adjust the added month properly", () => {
		expect(LocalDate.of(2019, MAY, 31).plus(MONTH_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, JUNE, 30).nativeUtc.getTime());
		expect(LocalDate.of(2019, JANUARY, 31).plus(MONTH_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, FEBRUARY, 28).nativeUtc.getTime());
		expect(LocalDate.of(2020, JANUARY, 31).plus(MONTH_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2020, FEBRUARY, 29).nativeUtc.getTime());
	});

	it("should subtract a period", () => {
		expect(july5.minus(YEAR_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2018, JULY, 5).nativeUtc.getTime());
		expect(july5.minus(MONTH_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, JUNE, 5).nativeUtc.getTime());
		expect(july5.minus(DAY_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 4).nativeUtc.getTime());
		expect(july5.minus(QUARTER_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, APRIL, 5).nativeUtc.getTime());
		expect(july5.minus(WEEK_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, JUNE, 28).nativeUtc.getTime());
	});

	it("should subtract zero period", () => {
		expect(july5.minus(NULL_PERIOD)).equal(july5);
	});

	it("should subtract multiple periods", () => {
		expect(july5.minus(Period.ofYears(2)).nativeUtc.getTime()).equal(LocalDate.of(2017, JULY, 5).nativeUtc.getTime());
		expect(july5.minus(Period.ofMonths(9)).nativeUtc.getTime()).equal(LocalDate.of(2018, OCTOBER, 5).nativeUtc.getTime());
		expect(july5.minus(Period.ofDays(30)).nativeUtc.getTime()).equal(LocalDate.of(2019, JUNE, 5).nativeUtc.getTime());
		expect(july5.minus(Period.ofQuarters(3)).nativeUtc.getTime()).equal(LocalDate.of(2018, OCTOBER, 5).nativeUtc.getTime());
		expect(july5.minus(Period.ofWeeks(5)).nativeUtc.getTime()).equal(LocalDate.of(2019, MAY, 31).nativeUtc.getTime());
	});

	it("should subtract negative periods", () => {
		expect(july5.minus(Period.ofYears(-2)).nativeUtc.getTime()).equal(LocalDate.of(2021, JULY, 5).nativeUtc.getTime());
		expect(july5.minus(Period.ofMonths(-9)).nativeUtc.getTime()).equal(LocalDate.of(2020, APRIL, 5).nativeUtc.getTime());
		expect(july5.minus(Period.ofDays(-30)).nativeUtc.getTime()).equal(LocalDate.of(2019, AUGUST, 4).nativeUtc.getTime());
		expect(july5.minus(Period.ofQuarters(-3)).nativeUtc.getTime()).equal(LocalDate.of(2020, APRIL, 5).nativeUtc.getTime());
		expect(july5.minus(Period.ofWeeks(-5)).nativeUtc.getTime()).equal(LocalDate.of(2019, AUGUST, 9).nativeUtc.getTime());
	});

	it("should adjust the subtracted month properly", () => {
		expect(LocalDate.of(2019, MAY, 31).minus(MONTH_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, APRIL, 30).nativeUtc.getTime());
		expect(LocalDate.of(2019, MARCH, 31).minus(MONTH_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2019, FEBRUARY, 28).nativeUtc.getTime());
		expect(LocalDate.of(2020, MARCH, 31).minus(MONTH_PERIOD).nativeUtc.getTime()).equal(LocalDate.of(2020, FEBRUARY, 29).nativeUtc.getTime());
	});

	it("should modify year", () => {
		expect(july5.withYear(1996).nativeUtc.getTime()).equal(LocalDate.of(1996, JULY, 5).nativeUtc.getTime());
		expect(LocalDate.of(2016, FEBRUARY, 29).withYear(2015).nativeUtc.getTime()).equal(LocalDate.of(2015, FEBRUARY, 28).nativeUtc.getTime());
	});

	it("should modify month", () => {
		expect(july5.withMonth(NOVEMBER).nativeUtc.getTime()).equal(LocalDate.of(2019, NOVEMBER, 5).nativeUtc.getTime());
		expect(LocalDate.of(2015, MARCH, 30).withMonth(FEBRUARY).nativeUtc.getTime()).equal(LocalDate.of(2015, FEBRUARY, 28).nativeUtc.getTime());
	});

	it("should modify day of month", () => {
		expect(july5.withDayOfMonth(28).nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 28).nativeUtc.getTime());
	});

	it("should modify day of year", () => {
		expect(july5.withDayOfYear(31 + 8).nativeUtc.getTime()).equal(LocalDate.of(2019, FEBRUARY, 8).nativeUtc.getTime());
	});

	it("should modify day of week", () => {
		expect(LocalDate.of(2019, AUGUST, 10).withDayOfWeek(TUESDAY).nativeUtc.getTime()).equal(LocalDate.of(2019, AUGUST, 6).nativeUtc.getTime());
	});

	it("should truncate itself to year", () => {
		expect(july5.truncateToYear.nativeUtc.getTime()).equal(LocalDate.of(2019, JANUARY, 1).nativeUtc.getTime());
	});

	it("should truncate itself to week based year", () => {
		expect(july5.truncateToWeekBasedYear.nativeUtc.getTime()).equal(LocalDate.of(2018, DECEMBER, 31).nativeUtc.getTime());
		expect(LocalDate.of(2017, JULY, 5).truncateToWeekBasedYear.nativeUtc.getTime()).equal(LocalDate.of(2017, JANUARY, 2).nativeUtc.getTime());
	});

	it("should truncate itself to month", () => {
		expect(july5.truncateToMonth.nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 1).nativeUtc.getTime());
		expect(LocalDate.of(2019, AUGUST, 5).truncateToMonth.nativeUtc.getTime()).equal(LocalDate.of(2019, AUGUST, 1).nativeUtc.getTime());
	});

	it("should truncate itself to week", () => {
		expect(july5.truncateToWeek.nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 1).nativeUtc.getTime());
		expect(LocalDate.of(2019, JULY, 29).truncateToWeek.nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 29).nativeUtc.getTime());
		expect(LocalDate.of(2019, AUGUST, 1).truncateToWeek.nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 29).nativeUtc.getTime());
		expect(LocalDate.of(2019, AUGUST, 4).truncateToWeek.nativeUtc.getTime()).equal(LocalDate.of(2019, JULY, 29).nativeUtc.getTime());
		expect(LocalDate.of(2019, AUGUST, 5).truncateToWeek.nativeUtc.getTime()).equal(LocalDate.of(2019, AUGUST, 5).nativeUtc.getTime());
	});

	it("should convert itself to string", () => {
		expect(july5.toString()).equal("2019-07-05");
	});

	describe("examples", () => {
		describe("construct", () => {
			it("should construct from components 1", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				expect(date).instanceof(LocalDate);
				expect(date.toString()).equal("2022-02-15");
			});

			it("should construct from components 2", () => {
				const date = LocalDate.of(2022, 2, 15);
				expect(date).instanceof(LocalDate);
				expect(date.toString()).equal("2022-02-15");
			});

			it("should construct from native Date 1", () => {
				const date = new Date(Date.UTC(2022, 1, 15, 18, 15, 30, 225));
				const result = LocalDate.fromNativeUtc(date);
				expect(result).instanceof(LocalDate);
				expect(result.toString()).equal("2022-02-15");
			});

			it("should construct from native Date 2", () => {
				const date = new Date(Date.UTC(2022, 1, 15, 18, 15, 30, 225));
				const result = LocalDate.fromNativeLocal(date);
				expect(result).instanceof(LocalDate);
				expect(result.toString()).equal("2022-02-15");
			});

			it("should construct from native Date 3", () => {
				const date = new Date(Date.UTC(2022, 1, 15, 18, 15, 30, 225));
				const zone = ZoneId.of("Europe/Berlin");
				const result = Instant.fromNative(date).atZone(zone).date;
				expect(result).instanceof(LocalDate);
				expect(result.toString()).equal("2022-02-15");
			});

			it("should construct from Instant", () => {
				const instant = Instant.parse("2022-02-15T18:30:15.225Z");
				const zone = ZoneId.of("Europe/Berlin");
				const date = instant.atZone(zone).date;
				expect(date).instanceof(LocalDate);
				expect(date.toString()).equal("2022-02-15");
			});

			it("should construct from LocalDateTime", () => {
				const localDateTime = LocalDateTime.parse("2022-02-15T18:30:15.225");
				const date = localDateTime.date;
				expect(date).instanceof(LocalDate);
				expect(date.toString()).equal("2022-02-15");
			});

			it("should construct from OffsetDateTime", () => {
				const offsetDateTime = OffsetDateTime.parse("2022-02-15T18:30:15.225+01:00");
				const date = offsetDateTime.date;
				expect(date).instanceof(LocalDate);
				expect(date.toString()).equal("2022-02-15");
			});

			it("should construct from ZonedDateTime", () => {
				const zonedDateTime = ZonedDateTime.parse("2022-02-15T18:30:15.225+01:00[Europe/Berlin]");
				const date = zonedDateTime.date;
				expect(date).instanceof(LocalDate);
				expect(date.toString()).equal("2022-02-15");
			});
		});

		describe("parse", () => {
			it("should parse ISO 8601", () => {
				const date = LocalDate.parse("2022-02-15");
				expect(date).instanceof(LocalDate);
				expect(date.toString()).equal("2022-02-15");
			});
		});

		describe("inspect", () => {
			it("should return various properties", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const year = date.year;
				const month = date.month;
				const monthValue = date.month.value;
				const dayOfMonth = date.dayOfMonth;
				const dayOfWeek = date.dayOfWeek;
				const dayOfWeekValue = date.dayOfWeek.value;
				expect(year).equal(2022);
				expect(month).equal(FEBRUARY);
				expect(monthValue).equal(2);
				expect(dayOfMonth).equal(15);
				expect(dayOfWeek).equal(TUESDAY);
				expect(dayOfWeekValue).equal(2);
			});
		});

		describe("compare", () => {
			it("should compare non-null instances", () => {
				const d1 = LocalDate.of(2022, FEBRUARY, 15);
				const d2 = LocalDate.of(2022, FEBRUARY, 16);
				expect(d1.equals(d2)).equal(false);
				expect(d1.isBefore(d2)).equal(true);
				expect(d1.isAfter(d2)).equal(false);
				expect(d1.compareTo(d2)).lessThan(0);
			});

			it("should compare nullable instances", () => {
				const d1: LocalDate = null;
				const d2 = LocalDate.of(2022, FEBRUARY, 16);
				expect(LocalDate.equal(d1, d2)).equal(false);
				expect(LocalDate.isBefore(d1, d2)).equal(true);
				expect(LocalDate.isAfter(d1, d2)).equal(false);
				expect(LocalDate.compare(d1, d2)).lessThan(0);
			});
		});

		describe("manipulate", () => {
			it("should add/subtract period", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const d1 = date.plus(DAY_PERIOD);
				const d2 = date.plus(Period.ofDays(2));
				const d3 = date.minus(MONTH_PERIOD);
				expect(d1).instanceof(LocalDate);
				expect(d2).instanceof(LocalDate);
				expect(d3).instanceof(LocalDate);
				expect(d1.toString()).equal("2022-02-16");
				expect(d2.toString()).equal("2022-02-17");
				expect(d3.toString()).equal("2022-01-15");
			});

			it("should change year", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const d1 = date.withYear(2025);
				expect(d1).instanceof(LocalDate);
				expect(d1.toString()).equal("2025-02-15");
			});

			it("should change month", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const d2 = date.withMonth(APRIL);
				expect(d2).instanceof(LocalDate);
				expect(d2.toString()).equal("2022-04-15");
			});

			it("should change day of month", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const d3 = date.withDayOfMonth(10);
				expect(d3).instanceof(LocalDate);
				expect(d3.toString()).equal("2022-02-10");
			});

			it("should change day of week", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const d4 = date.withDayOfWeek(SUNDAY);
				expect(d4).instanceof(LocalDate);
				expect(d4.toString()).equal("2022-02-20");
				expect(d4.dayOfWeek).equal(SUNDAY);
			});

			it("should truncate to year", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const d1 = date.truncateToYear;
				expect(d1).instanceof(LocalDate);
				expect(d1.toString()).equal("2022-01-01");
			});

			it("should truncate to month", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const d2 = date.truncateToMonth;
				expect(d2).instanceof(LocalDate);
				expect(d2.toString()).equal("2022-02-01");
			});

			it("should truncate to week", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const d3 = date.truncateToWeek;
				expect(d3).instanceof(LocalDate);
				expect(d3.toString()).equal("2022-02-14");
				expect(d3.dayOfWeek).equal(MONDAY);
			});

			it("should truncate to Sunday 1", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const d4 = date.minus(Period.ofDays(date.dayOfWeek.value % 7));
				expect(d4).instanceof(LocalDate);
				expect(d4.toString()).equal("2022-02-13");
				expect(d4.dayOfWeek).equal(SUNDAY);
			});

			it("should truncate to Sunday 2", () => {
				const date = LocalDate.of(2022, FEBRUARY, 13);
				const d4 = date.minus(Period.ofDays(date.dayOfWeek.value % 7));
				expect(d4).instanceof(LocalDate);
				expect(d4.toString()).equal("2022-02-13");
				expect(d4.dayOfWeek).equal(SUNDAY);
			});

			it("should truncate to Sunday 3", () => {
				const date = LocalDate.of(2022, FEBRUARY, 19);
				const d4 = date.minus(Period.ofDays(date.dayOfWeek.value % 7));
				expect(d4).instanceof(LocalDate);
				expect(d4.toString()).equal("2022-02-13");
				expect(d4.dayOfWeek).equal(SUNDAY);
			});

			it("should truncate to arbitrary day of week 1", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const firstDayOfWeek = 1;
				const d5 = date.minus(Period.ofDays((date.dayOfWeek.value + 7 - firstDayOfWeek) % 7));
				expect(d5).instanceof(LocalDate);
				expect(d5.toString()).equal("2022-02-14");
				expect(d5.dayOfWeek).equal(MONDAY);
			});

			it("should truncate to arbitrary day of week 2", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const firstDayOfWeek = 2;
				const d5 = date.minus(Period.ofDays((date.dayOfWeek.value + 7 - firstDayOfWeek) % 7));
				expect(d5).instanceof(LocalDate);
				expect(d5.toString()).equal("2022-02-15");
				expect(d5.dayOfWeek).equal(TUESDAY);
			});

			it("should truncate to arbitrary day of week 2", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const firstDayOfWeek = 3;
				const d5 = date.minus(Period.ofDays((date.dayOfWeek.value + 7 - firstDayOfWeek) % 7));
				expect(d5).instanceof(LocalDate);
				expect(d5.toString()).equal("2022-02-09");
				expect(d5.dayOfWeek).equal(WEDNESDAY);
			});
		});

		describe("convert", () => {
			it("should convert to LocalDateTime 1", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const dateTime = date.atStartOfDay;
				expect(dateTime).instanceof(LocalDateTime);
				expect(dateTime.toString()).equal("2022-02-15T00:00:00.000");
			});

			it("should convert to LocalDateTime 2", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const dateTime = date.atTime(MIDNIGHT);
				expect(dateTime).instanceof(LocalDateTime);
				expect(dateTime.toString()).equal("2022-02-15T00:00:00.000");
			});

			it("should convert to LocalDateTime 3", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const time = LocalTime.of(18, 30, 15, 225)
				const dateTime = date.atTime(time);
				expect(dateTime).instanceof(LocalDateTime);
				expect(dateTime.toString()).equal("2022-02-15T18:30:15.225");
			});

			it("should convert to OffsetDateTime", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const time = LocalTime.of(18, 30, 15, 225)
				const offset = ZoneOffset.ofComponents(1);
				const offsetDateTime = date.atTime(time).atOffset(offset);
				expect(offsetDateTime).instanceof(OffsetDateTime);
				expect(offsetDateTime.toString()).equal("2022-02-15T18:30:15.225+01:00");
			});

			it("should convert to ZonedDateTime", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const time = LocalTime.of(18, 30, 15, 225)
				const zone = ZoneId.of("Europe/Berlin");
				const zonedDateTime = date.atTime(time).atZone(zone);
				expect(zonedDateTime).instanceof(ZonedDateTime);
				expect(zonedDateTime.toString()).equal("2022-02-15T18:30:15.225+01:00[Europe/Berlin]");
			});

			it("should convert to Instant", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const time = LocalTime.of(18, 30, 15, 225)
				const zone = ZoneId.of("Europe/Berlin");
				const instant = date.atTime(time).atZone(zone).instant;
				expect(instant).instanceof(Instant);
				expect(instant.toString()).equal("2022-02-15T17:30:15.225Z");
			});

			it("should convert to native Date in UTC", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const result = date.nativeUtc;
				expect(result).instanceof(Date);
				expect(result.getTime()).equal(Date.UTC(2022, 1, 15));
			});

			it("should convert to native Date in local time zone", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const result = date.nativeLocal;
				expect(result).instanceof(Date);
				expect(result.getTime()).equal(new Date(2022, 1, 15).getTime());
			});

			it("should convert to native Date in a given ZoneId", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const zone = ZoneId.of("Europe/Berlin");
				const result = date.atStartOfDay.atZone(zone).native;
				expect(result).instanceof(Date);
				expect(result.getTime()).equal(Date.UTC(2022, 1, 14, 23));
			});

			it("should convert to native Date at a given time in a given ZoneId", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const time = LocalTime.of(18, 30, 15, 225)
				const zone = ZoneId.of("Europe/Berlin");
				const result = date.atTime(time).atZone(zone).native;
				expect(result).instanceof(Date);
				expect(result.getTime()).equal(Date.UTC(2022, 1, 15, 17, 30, 15, 225));
			});
		});

		describe("format", () => {
			it("should format in ISO 8601", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				expect(date.toString()).equal("2022-02-15");
			});
		});
	});
});
