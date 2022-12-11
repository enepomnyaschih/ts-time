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
import {MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE, MS_PER_SECOND, MS_PER_WEEK} from "ts-time/constants";
import Duration, {
	DAY_DURATION,
	HOUR_DURATION,
	MINUTE_DURATION,
	MS_DURATION,
	NULL_DURATION,
	SECOND_DURATION,
	WEEK_DURATION
} from "ts-time/Duration";
import Instant from "ts-time/Instant";
import {isTimeZoneSupport} from "ts-time/utils";
import {ZoneId, ZoneOffset} from "ts-time/Zone";

describe("Instant", () => {
	const native = new Date(Date.UTC(2019, 8, 10, 10)),
		instant = Instant.fromNative(native);

	it("should construct itself", () => {
		expect(Instant.ofEpochMs(123456789).epochMs).equal(123456789);
		expect(Instant.fromNative(new Date(123456789)).epochMs).equal(123456789);
		expect(Math.abs(Instant.now().epochMs - new Date().getTime())).lessThan(100);
	});

	it("should construct from a string", () => {
		expect(Instant.parse("2019-09-10T01:02:03.004Z").epochMs).equal(Date.UTC(2019, 8, 10, 1, 2, 3, 4));
		expect(Instant.parse("2019-09-10T01:02:03.004-3").epochMs).equal(Date.UTC(2019, 8, 10, 4, 2, 3, 4));
		expect(Instant.parse("2019-09-10T01:02:03.4Z").epochMs).equal(Date.UTC(2019, 8, 10, 1, 2, 3, 400));
		expect(Instant.parse("2019-09-10T01:02:03.4567Z").epochMs).equal(Date.UTC(2019, 8, 10, 1, 2, 3, 456));
		expect(Instant.parse("2019-07-05T18:30:15.225+02:00[Europe/Berlin]").epochMs)
			.equal(Date.UTC(2019, 6, 5, 16, 30, 15, 225));
	});

	it("should throw an error by invalid string", () => {
		const expectError = (str: string) => {
			expect(() => Instant.parse(str))
				.throw(`Unable to parse '${str}' as an instant. ISO 8601 date/time string with offset and optional time zone expected.`);
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
		expectError("2019-07-05TT18:30:15.225");
	});

	it("should throw an error by invalid time zone", () => {
		const expectError = (str: string) => {
			expect(() => Instant.parse(str))
				.throw(`Unable to parse '${str}' as an instant. Invalid or unrecognized time zone ID or offset: 'aa'.`);
		};

		expectError("2019-07-05T18:30:15.225+02:00[aa]");
	});

	it("should return native date", () => {
		expect(Instant.ofEpochMs(123456789).native.getTime()).equal(123456789);
	});

	it("should return offset date/time", () => {
		expect(instant.atOffset(ZoneOffset.of("+3")).toString()).equal("2019-09-10T13:00:00.000+03:00");
	});

	it("should return zoned date/time", () => {
		expect(instant.atZone(ZoneId.of("Europe/Berlin")).toString())
			.equal(isTimeZoneSupport() ? "2019-09-10T12:00:00.000+02:00[Europe/Berlin]"
				: "2019-09-10T10:00:00.000Z[Europe/Berlin]");
	});

	it("should compare itself", () => {
		expect(instant.compareTo(instant)).equal(0);
		expect(instant.compareTo(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).equal(0);
		expect(instant.compareTo(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).lessThan(0);
		expect(instant.compareTo(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).greaterThan(0);
	});

	it("should compare itself statically", () => {
		expect(Instant.compare(instant, instant)).equal(0);
		expect(Instant.compare(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).equal(0);
		expect(Instant.compare(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).lessThan(0);
		expect(Instant.compare(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).greaterThan(0);
	});

	it("should compare itself with null", () => {
		expect(instant.compareTo(null)).greaterThan(0);
		expect(Instant.compare(instant, null)).greaterThan(0);
		expect(Instant.compare(null, instant)).lessThan(0);
		expect(Instant.compare(null, null)).equal(0);
	});

	it("should check itself for equality", () => {
		expect(instant.equals(instant)).equal(true);
		expect(instant.equals(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).equal(true);
		expect(instant.equals(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).equal(false);
		expect(instant.equals(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).equal(false);
	});

	it("should check itself for equality statically", () => {
		expect(Instant.equal(instant, instant)).equal(true);
		expect(Instant.equal(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).equal(true);
		expect(Instant.equal(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).equal(false);
		expect(Instant.equal(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).equal(false);
	});

	it("should check itself for equality with null", () => {
		expect(instant.equals(null)).equal(false);
		expect(Instant.equal(instant, null)).equal(false);
		expect(Instant.equal(null, instant)).equal(false);
		expect(Instant.equal(null, null)).equal(true);
	});

	it("should compare itself with isBefore method", () => {
		expect(instant.isBefore(instant)).equal(false);
		expect(instant.isBefore(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).equal(false);
		expect(instant.isBefore(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).equal(true);
		expect(instant.isBefore(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).equal(false);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(Instant.isBefore(instant, instant)).equal(false);
		expect(Instant.isBefore(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).equal(false);
		expect(Instant.isBefore(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).equal(true);
		expect(Instant.isBefore(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).equal(false);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(instant.isBefore(null)).equal(false);
		expect(Instant.isBefore(instant, null)).equal(false);
		expect(Instant.isBefore(null, instant)).equal(true);
		expect(Instant.isBefore(null, null)).equal(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(instant.isAfter(instant)).equal(false);
		expect(instant.isAfter(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).equal(false);
		expect(instant.isAfter(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).equal(false);
		expect(instant.isAfter(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).equal(true);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(Instant.isAfter(instant, instant)).equal(false);
		expect(Instant.isAfter(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).equal(false);
		expect(Instant.isAfter(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).equal(false);
		expect(Instant.isAfter(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).equal(true);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(instant.isAfter(null)).equal(true);
		expect(Instant.isAfter(instant, null)).equal(true);
		expect(Instant.isAfter(null, instant)).equal(false);
		expect(Instant.isAfter(null, null)).equal(false);
	});

	it("should add milliseconds", () => {
		expect(instant.plus(0).epochMs).equal(Date.UTC(2019, 8, 10, 10));
		expect(instant.plus(1).epochMs).equal(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
		expect(instant.plus(12345).epochMs).equal(Date.UTC(2019, 8, 10, 10, 0, 12, 345));
		expect(instant.plus(-1).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
	});

	it("should add milliseconds", () => {
		expect(instant.plus(0).epochMs).equal(Date.UTC(2019, 8, 10, 10));
		expect(instant.plus(1).epochMs).equal(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
		expect(instant.plus(MS_PER_SECOND).epochMs).equal(Date.UTC(2019, 8, 10, 10, 0, 1));
		expect(instant.plus(MS_PER_MINUTE).epochMs).equal(Date.UTC(2019, 8, 10, 10, 1));
		expect(instant.plus(MS_PER_HOUR).epochMs).equal(Date.UTC(2019, 8, 10, 11));
		expect(instant.plus(MS_PER_DAY).epochMs).equal(Date.UTC(2019, 8, 11, 10));
		expect(instant.plus(MS_PER_WEEK).epochMs).equal(Date.UTC(2019, 8, 17, 10));
		expect(instant.plus(25 * MS_PER_DAY).epochMs).equal(Date.UTC(2019, 9, 5, 10));
		expect(instant.plus(-1).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
	});

	it("should add duration", () => {
		expect(instant.plus(NULL_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 10));
		expect(instant.plus(MS_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
		expect(instant.plus(SECOND_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 10, 0, 1));
		expect(instant.plus(MINUTE_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 10, 1));
		expect(instant.plus(HOUR_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 11));
		expect(instant.plus(DAY_DURATION).epochMs).equal(Date.UTC(2019, 8, 11, 10));
		expect(instant.plus(WEEK_DURATION).epochMs).equal(Date.UTC(2019, 8, 17, 10));
		expect(instant.plus(Duration.ofDays(25)).epochMs).equal(Date.UTC(2019, 9, 5, 10));
		expect(instant.plus(Duration.ofMs(-1)).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
	});

	it("should subtract milliseconds", () => {
		expect(instant.minus(0).epochMs).equal(Date.UTC(2019, 8, 10, 10));
		expect(instant.minus(1).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
		expect(instant.minus(MS_PER_SECOND).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59, 59));
		expect(instant.minus(MS_PER_MINUTE).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59));
		expect(instant.minus(MS_PER_HOUR).epochMs).equal(Date.UTC(2019, 8, 10, 9));
		expect(instant.minus(MS_PER_DAY).epochMs).equal(Date.UTC(2019, 8, 9, 10));
		expect(instant.minus(MS_PER_WEEK).epochMs).equal(Date.UTC(2019, 8, 3, 10));
		expect(instant.minus(25 * MS_PER_DAY).epochMs).equal(Date.UTC(2019, 7, 16, 10));
		expect(instant.minus(-1).epochMs).equal(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
	});

	it("should subtract duration", () => {
		expect(instant.minus(NULL_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 10));
		expect(instant.minus(MS_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
		expect(instant.minus(SECOND_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59, 59));
		expect(instant.minus(MINUTE_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59));
		expect(instant.minus(HOUR_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 9));
		expect(instant.minus(DAY_DURATION).epochMs).equal(Date.UTC(2019, 8, 9, 10));
		expect(instant.minus(WEEK_DURATION).epochMs).equal(Date.UTC(2019, 8, 3, 10));
		expect(instant.minus(Duration.ofDays(25)).epochMs).equal(Date.UTC(2019, 7, 16, 10));
		expect(instant.minus(Duration.ofMs(-1)).epochMs).equal(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
	});

	it("should subtract duration", () => {
		expect(instant.minus(NULL_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 10));
		expect(instant.minus(MS_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
		expect(instant.minus(SECOND_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59, 59));
		expect(instant.minus(MINUTE_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 9, 59));
		expect(instant.minus(HOUR_DURATION).epochMs).equal(Date.UTC(2019, 8, 10, 9));
		expect(instant.minus(DAY_DURATION).epochMs).equal(Date.UTC(2019, 8, 9, 10));
		expect(instant.minus(WEEK_DURATION).epochMs).equal(Date.UTC(2019, 8, 3, 10));
		expect(instant.minus(Duration.ofDays(25)).epochMs).equal(Date.UTC(2019, 7, 16, 10));
		expect(instant.minus(Duration.ofMs(-1)).epochMs).equal(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
	});

	it("should subtract instant", () => {
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 10))).ms).equal(0);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 10, 0, 0, 1))).ms).equal(1);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 10, 0, 1))).ms).equal(MS_PER_SECOND);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 10, 1))).ms).equal(MS_PER_MINUTE);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 11))).ms).equal(MS_PER_HOUR);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 11, 10))).ms).equal(MS_PER_DAY);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 17, 10))).ms).equal(MS_PER_WEEK);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 9, 5, 10))).ms).equal(25 * MS_PER_DAY);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 9, 59, 59, 999))).ms).equal(-1);
	});

	it("should convert itself to string", () => {
		expect(instant.toString()).equal("2019-09-10T10:00:00.000Z");
		expect(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 1, 2, 3, 4)).toString()).equal("2019-09-10T01:02:03.004Z");
	});
});
