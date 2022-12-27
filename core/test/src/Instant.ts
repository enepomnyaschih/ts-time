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
import LocalDateTime from "ts-time/LocalDateTime";
import OffsetDateTime from "ts-time/OffsetDateTime";
import {isTimeZoneSupport} from "ts-time/utils";
import {UTC, ZoneId, ZoneOffset} from "ts-time/Zone";
import ZonedDateTime from "ts-time/ZonedDateTime";

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

	describe("examples", () => {
		describe("construct", () => {
			it("should construct from epoch ms", () => {
				const msSinceEpoch: number = Date.UTC(2022, 1, 15, 18, 30, 15, 225);
				const instant = Instant.ofEpochMs(msSinceEpoch);
				expect(instant).instanceof(Instant);
				expect(instant.toString()).equal("2022-02-15T18:30:15.225Z");
			});

			it("should construct from ZonedDateTime", () => {
				const zonedDateTime = ZonedDateTime.parse("2022-02-15T18:30:15.225-05:00[America/New_York]");
				const instant = zonedDateTime.instant;
				expect(instant).instanceof(Instant);
				expect(instant.toString()).equal("2022-02-15T23:30:15.225Z");
			});

			it("should construct from OffsetDateTime", () => {
				const offsetDateTime = OffsetDateTime.parse("2022-02-15T18:30:15.225-05:00");
				const instant = offsetDateTime.instant;
				expect(instant).instanceof(Instant);
				expect(instant.toString()).equal("2022-02-15T23:30:15.225Z");
			});

			it("should construct from LocalDateTime in a given time zone", () => {
				const localDateTime = LocalDateTime.parse("2022-02-15T18:30:15.225");
				const zone = ZoneId.of("America/New_York");
				const instant = localDateTime.atZone(zone).instant;
				expect(instant).instanceof(Instant);
				expect(instant.toString()).equal("2022-02-15T23:30:15.225Z");
			});

			it("should construct from LocalDateTime in a given offset", () => {
				const localDateTime = LocalDateTime.parse("2022-02-15T18:30:15.225");
				const offset = ZoneOffset.ofComponents(-5);
				const instant = localDateTime.atZone(offset).instant;
				expect(instant).instanceof(Instant);
				expect(instant.toString()).equal("2022-02-15T23:30:15.225Z");
			});

			it("should construct from native Date", () => {
				const date = new Date(Date.UTC(2022, 1, 15, 18, 30, 15, 225));
				const instant = Instant.fromNative(date);
				expect(instant).instanceof(Instant);
				expect(instant.toString()).equal("2022-02-15T18:30:15.225Z");
			});
		});

		describe("parse", () => {
			it("should parse ISO 8601", () => {
				const instant = Instant.parse("2022-02-15T18:30:15.225-05:00[America/New_York]");
				expect(instant).instanceof(Instant);
				expect(instant.toString()).equal("2022-02-15T23:30:15.225Z");
			});
		});

		describe("inspect", () => {
			it("should return various properties", () => {
				const instant = Instant.parse("2022-02-15T18:30:15.225Z");
				const zonedDateTime = instant.atZone(UTC);
				const hour = zonedDateTime.hour;            // 18
				const minute = zonedDateTime.minute;          // 30
				expect(hour).equal(18);
				expect(minute).equal(30);
			});
		});

		describe("compare", () => {
			it("should compare non-null instances", () => {
				const d1 = Instant.parse("2022-02-15T18:30:15.225Z");
				const d2 = Instant.parse("2022-02-15T18:30:15.226Z");
				expect(d1.equals(d2)).equal(false);
				expect(d1.isBefore(d2)).equal(true);
				expect(d1.isAfter(d2)).equal(false);
				expect(d1.compareTo(d2)).equal(-1);
			});

			it("should compare nullable instances", () => {
				const d1: Instant = null;
				const d2 = Instant.parse("2022-02-15T18:30:15.226Z");
				expect(Instant.equal(d1, d2)).equal(false);
				expect(Instant.isBefore(d1, d2)).equal(true);
				expect(Instant.isAfter(d1, d2)).equal(false);
				expect(Instant.compare(d1, d2)).equal(-1);
			});
		});

		describe("manipulate", () => {
			it("should add/subtract duration", () => {
				const instant = Instant.parse("2022-02-15T18:30:15.225Z");
				const d1 = instant.plus(MINUTE_DURATION);         // 2022-02-15T18:31:15.225Z
				const d2 = instant.plus(Duration.ofHours(10));    // 2022-02-16T04:30:15.225Z
				const d3 = instant.minus(Duration.ofSeconds(30)); // 2022-02-15T18:29:45.225Z
				expect(d1).instanceof(Instant);
				expect(d2).instanceof(Instant);
				expect(d3).instanceof(Instant);
				expect(d1.toString()).equal("2022-02-15T18:31:15.225Z");
				expect(d2.toString()).equal("2022-02-16T04:30:15.225Z");
				expect(d3.toString()).equal("2022-02-15T18:29:45.225Z");
			});
		});

		describe("convert", () => {
			it("should convert to ZonedDateTime", () => {
				const instant = Instant.parse("2022-02-15T18:30:15.225Z");
				const zone = ZoneId.of("Europe/Berlin");
				const zonedDateTime = instant.atZone(zone);
				expect(zonedDateTime).instanceof(ZonedDateTime);
				expect(zonedDateTime.toString()).equal("2022-02-15T19:30:15.225+01:00[Europe/Berlin]");
			});

			it("should convert to OffsetDateTime", () => {
				const instant = Instant.parse("2022-02-15T18:30:15.225Z");
				const offset = ZoneOffset.ofComponents(2);
				const offsetDateTime = instant.atOffset(offset);
				expect(offsetDateTime).instanceof(OffsetDateTime);
				expect(offsetDateTime.toString()).equal("2022-02-15T20:30:15.225+02:00");
			});

			it("should convert to LocalDateTime in a given time zone", () => {
				const instant = Instant.parse("2022-02-15T18:30:15.225Z");
				const zone = ZoneId.of("Europe/Berlin");
				const dateTime = instant.atZone(zone).dateTime;
				expect(dateTime).instanceof(LocalDateTime);
				expect(dateTime.toString()).equal("2022-02-15T19:30:15.225");
			});

			it("should convert to LocalDateTime in a given offset", () => {
				const instant = Instant.parse("2022-02-15T18:30:15.225Z");
				const offset = ZoneOffset.ofComponents(2);
				const dateTime = instant.atOffset(offset).dateTime;
				expect(dateTime).instanceof(LocalDateTime);
				expect(dateTime.toString()).equal("2022-02-15T20:30:15.225");
			});

			it("should convert to native Date", () => {
				const instant = Instant.parse("2022-02-15T18:30:15.225Z");
				const date = instant.native;
				expect(date).instanceof(Date);
				expect(date.getTime()).equal(Date.UTC(2022, 1, 15, 18, 30, 15, 225));
			});
		});

		describe("format", () => {
			it("should format in ISO 8601", () => {
				const instant = Instant.parse("2022-02-15T18:30:15.225-05:00[America/New_York]");
				expect(instant.toString()).equal("2022-02-15T23:30:15.225Z");
			});
		});
	});
});
