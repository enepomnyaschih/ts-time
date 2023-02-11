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
import Duration, {
	DAY_DURATION,
	HOUR_DURATION,
	MINUTE_DURATION,
	MS_DURATION,
	NULL_DURATION,
	SECOND_DURATION
} from "ts-time/Duration";
import Instant from "ts-time/Instant";
import LocalDate from "ts-time/LocalDate";
import LocalDateTime from "ts-time/LocalDateTime";
import LocalTime, {MAX_TIME, MAX_TIME12, MIDNIGHT, NOON} from "ts-time/LocalTime";
import {FEBRUARY, SEPTEMBER} from "ts-time/Month";
import OffsetDateTime from "ts-time/OffsetDateTime";
import {HOUR12_FIELD, HOUR_FIELD, MINUTE_FIELD, MS_FIELD, SECOND_FIELD} from "ts-time/TimeField";
import {ZoneId, ZoneOffset} from "ts-time/Zone";
import ZonedDateTime from "ts-time/ZonedDateTime";

// TODO: Add out of bounds tests (e.g. constructors)
describe("LocalTime", () => {
	const time = LocalTime.of(18, 30, 15, 225);

	it("should construct itself", () => {
		expect(LocalTime.of(18, 30, 15, 225).totalMs).equal(66615225);
		expect(LocalTime.ofTotalMs(12345).totalMs).equal(12345);
		expect(LocalTime.fromNativeLocal(new Date(2019, 8, 10, 18, 30, 15, 225)).totalMs).equal(66615225);
		expect(LocalTime.fromNativeUtc(new Date(Date.UTC(2019, 8, 10, 18, 30, 15, 225))).totalMs).equal(66615225);
	});

	it("should construct from string", () => {
		expect(LocalTime.parse("0:0:0.0").totalMs).equal(0);
		expect(LocalTime.parse("00:00:00.000").totalMs).equal(0);
		expect(LocalTime.parse("00:00:00").totalMs).equal(0);
		expect(LocalTime.parse("00:00").totalMs).equal(0);
		expect(LocalTime.parse("18:30:15.225").totalMs).equal(66615225);
		expect(LocalTime.parse("18:30:15").totalMs).equal(66615000);
		expect(LocalTime.parse("18:30").totalMs).equal(66600000);
		expect(LocalTime.parse("18:30:15.4").totalMs).equal(66615400);
		expect(LocalTime.parse("18:30:15.456").totalMs).equal(66615456);
	});

	it("should throw an error by invalid string", () => {
		const expectError = (str: string) => {
			expect(() => LocalTime.parse(str))
				.throw(`Unable to parse '${str}' as local time. ISO 8601 time string expected.`);
		};

		expectError("abc");
		expectError("2019-07-05");
		expectError("2019-07-05T18:30:15.225");
		expectError("2019-07-05T18:30:15.225Z");
		expectError("2019-07-05T18:30:15.225+00:00");
		expectError("2019-07-05T18:30:15.225[Europe/Berlin]");
		expectError("2019-07-05T18:30:15.225+02:00[Europe/Berlin]");
		expectError("18:30:aa.225");
	});

	it("should convert itself to string", () => {
		expect(time.toString()).equal("18:30:15.225");
	});

	it("should return proper hour", () => {
		expect(time.hour).equal(18);
		expect(MIDNIGHT.hour).equal(0);
		expect(NOON.hour).equal(12);
		expect(MAX_TIME.hour).equal(23);
		expect(MAX_TIME12.hour).equal(11);
	});

	it("should return proper minute", () => {
		expect(time.minute).equal(30);
		expect(MIDNIGHT.minute).equal(0);
		expect(NOON.minute).equal(0);
		expect(MAX_TIME.minute).equal(59);
		expect(MAX_TIME12.minute).equal(59);
	});

	it("should return proper second", () => {
		expect(time.second).equal(15);
		expect(MIDNIGHT.second).equal(0);
		expect(NOON.second).equal(0);
		expect(MAX_TIME.second).equal(59);
		expect(MAX_TIME12.second).equal(59);
	});

	it("should return proper millisecond", () => {
		expect(time.ms).equal(225);
		expect(MIDNIGHT.ms).equal(0);
		expect(NOON.ms).equal(0);
		expect(MAX_TIME.ms).equal(999);
		expect(MAX_TIME12.ms).equal(999);
	});

	it("should return proper total millisecond", () => {
		expect(time.totalMs).equal(66615225);
		expect(MIDNIGHT.totalMs).equal(0);
		expect(NOON.totalMs).equal(43200000);
		expect(MAX_TIME.totalMs).equal(86399999);
		expect(MAX_TIME12.totalMs).equal(43199999);
	});

	it("should return proper field", () => {
		expect(time.get(HOUR_FIELD)).equal(18);
		expect(time.get(HOUR12_FIELD)).equal(6);
		expect(time.get(MINUTE_FIELD)).equal(30);
		expect(time.get(SECOND_FIELD)).equal(15);
		expect(time.get(MS_FIELD)).equal(225);
	});

	it("should compare itself", () => {
		expect(time.compareTo(MIDNIGHT)).greaterThan(0);
		expect(time.compareTo(LocalTime.of(18, 30, 15, 224))).greaterThan(0);
		expect(time.compareTo(time)).equal(0);
		expect(time.compareTo(LocalTime.of(18, 30, 15, 225))).equal(0);
		expect(time.compareTo(LocalTime.of(18, 30, 15, 226))).lessThan(0);
		expect(time.compareTo(MAX_TIME)).lessThan(0);
	});

	it("should compare itself statically", () => {
		expect(LocalTime.compare(time, MIDNIGHT)).greaterThan(0);
		expect(LocalTime.compare(time, LocalTime.of(18, 30, 15, 224))).greaterThan(0);
		expect(LocalTime.compare(time, time)).equal(0);
		expect(LocalTime.compare(time, LocalTime.of(18, 30, 15, 225))).equal(0);
		expect(LocalTime.compare(time, LocalTime.of(18, 30, 15, 226))).lessThan(0);
		expect(LocalTime.compare(time, MAX_TIME)).lessThan(0);
	});

	it("should compare itself with null", () => {
		expect(time.compareTo(null)).greaterThan(0);
		expect(LocalTime.compare(time, null)).greaterThan(0);
		expect(LocalTime.compare(null, time)).lessThan(0);
		expect(LocalTime.compare(null, null)).equal(0);
	});

	it("should check itself for equality", () => {
		expect(time.equals(MIDNIGHT)).equal(false);
		expect(time.equals(LocalTime.of(18, 30, 15, 224))).equal(false);
		expect(time.equals(time)).equal(true);
		expect(time.equals(LocalTime.of(18, 30, 15, 225))).equal(true);
		expect(time.equals(LocalTime.of(18, 30, 15, 226))).equal(false);
		expect(time.equals(MAX_TIME)).equal(false);
	});

	it("should check itself for equality statically", () => {
		expect(LocalTime.equal(time, MIDNIGHT)).equal(false);
		expect(LocalTime.equal(time, LocalTime.of(18, 30, 15, 224))).equal(false);
		expect(LocalTime.equal(time, time)).equal(true);
		expect(LocalTime.equal(time, LocalTime.of(18, 30, 15, 225))).equal(true);
		expect(LocalTime.equal(time, LocalTime.of(18, 30, 15, 226))).equal(false);
		expect(LocalTime.equal(time, MAX_TIME)).equal(false);
	});

	it("should check itself for equality with null", () => {
		expect(time.equals(null)).equal(false);
		expect(LocalTime.equal(time, null)).equal(false);
		expect(LocalTime.equal(null, time)).equal(false);
		expect(LocalTime.equal(null, null)).equal(true);
	});

	it("should compare itself with isBefore method", () => {
		expect(time.isBefore(MIDNIGHT)).equal(false);
		expect(time.isBefore(LocalTime.of(18, 30, 15, 224))).equal(false);
		expect(time.isBefore(time)).equal(false);
		expect(time.isBefore(LocalTime.of(18, 30, 15, 225))).equal(false);
		expect(time.isBefore(LocalTime.of(18, 30, 15, 226))).equal(true);
		expect(time.isBefore(MAX_TIME)).equal(true);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(LocalTime.isBefore(time, MIDNIGHT)).equal(false);
		expect(LocalTime.isBefore(time, LocalTime.of(18, 30, 15, 224))).equal(false);
		expect(LocalTime.isBefore(time, time)).equal(false);
		expect(LocalTime.isBefore(time, LocalTime.of(18, 30, 15, 225))).equal(false);
		expect(LocalTime.isBefore(time, LocalTime.of(18, 30, 15, 226))).equal(true);
		expect(LocalTime.isBefore(time, MAX_TIME)).equal(true);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(time.isBefore(null)).equal(false);
		expect(LocalTime.isBefore(time, null)).equal(false);
		expect(LocalTime.isBefore(null, time)).equal(true);
		expect(LocalTime.isBefore(null, null)).equal(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(time.isAfter(MIDNIGHT)).equal(true);
		expect(time.isAfter(LocalTime.of(18, 30, 15, 224))).equal(true);
		expect(time.isAfter(time)).equal(false);
		expect(time.isAfter(LocalTime.of(18, 30, 15, 225))).equal(false);
		expect(time.isAfter(LocalTime.of(18, 30, 15, 226))).equal(false);
		expect(time.isAfter(MAX_TIME)).equal(false);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(LocalTime.isAfter(time, MIDNIGHT)).equal(true);
		expect(LocalTime.isAfter(time, LocalTime.of(18, 30, 15, 224))).equal(true);
		expect(LocalTime.isAfter(time, time)).equal(false);
		expect(LocalTime.isAfter(time, LocalTime.of(18, 30, 15, 225))).equal(false);
		expect(LocalTime.isAfter(time, LocalTime.of(18, 30, 15, 226))).equal(false);
		expect(LocalTime.isAfter(time, MAX_TIME)).equal(false);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(time.isAfter(null)).equal(true);
		expect(LocalTime.isAfter(time, null)).equal(true);
		expect(LocalTime.isAfter(null, time)).equal(false);
		expect(LocalTime.isAfter(null, null)).equal(false);
	});

	it("should create proper date/time (atDate)", () => {
		expect(time.atDate(LocalDate.of(2019, SEPTEMBER, 10)).toString()).equal("2019-09-10T18:30:15.225");
	});

	it("should add duration", () => {
		expect(time.plus(MS_DURATION).toString()).equal("18:30:15.226");
		expect(time.plus(SECOND_DURATION).toString()).equal("18:30:16.225");
		expect(time.plus(MINUTE_DURATION).toString()).equal("18:31:15.225");
		expect(time.plus(HOUR_DURATION).toString()).equal("19:30:15.225");
		expect(time.plus(DAY_DURATION).toString()).equal("18:30:15.225");
		expect(time.plus(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).equal("20:33:19.230");
		expect(time.plus(Duration.of(-1)).toString()).equal("18:30:15.224");
	});

	it("should add zero duration", () => {
		expect(time.plus(NULL_DURATION)).equal(time);
	});

	it("should subtract duration", () => {
		expect(time.minus(MS_DURATION).toString()).equal("18:30:15.224");
		expect(time.minus(SECOND_DURATION).toString()).equal("18:30:14.225");
		expect(time.minus(MINUTE_DURATION).toString()).equal("18:29:15.225");
		expect(time.minus(HOUR_DURATION).toString()).equal("17:30:15.225");
		expect(time.minus(DAY_DURATION).toString()).equal("18:30:15.225");
		expect(time.minus(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).equal("16:27:11.220");
		expect(time.minus(Duration.of(-1)).toString()).equal("18:30:15.226");
	});

	it("should subtract zero duration", () => {
		expect(time.minus(NULL_DURATION)).equal(time);
	});

	it("should modify hour", () => {
		expect(MIDNIGHT.withHour(15).toString()).equal("15:00:00.000");
		expect(time.withHour(15).toString()).equal("15:30:15.225");
	});

	it("should modify minute", () => {
		expect(MIDNIGHT.withMinute(15).toString()).equal("00:15:00.000");
		expect(time.withMinute(15).toString()).equal("18:15:15.225");
	});

	it("should modify second", () => {
		expect(MIDNIGHT.withSecond(12).toString()).equal("00:00:12.000");
		expect(time.withSecond(12).toString()).equal("18:30:12.225");
	});

	it("should modify millisecond", () => {
		expect(MIDNIGHT.withMs(15).toString()).equal("00:00:00.015");
		expect(time.withMs(15).toString()).equal("18:30:15.015");
	});

	it("should truncate itself to hour", () => {
		expect(time.truncateToHour.toString()).equal("18:00:00.000");
	});

	it("should truncate itself to minute", () => {
		expect(time.truncateToMinute.toString()).equal("18:30:00.000");
	});

	it("should truncate itself to second", () => {
		expect(time.truncateToSecond.toString()).equal("18:30:15.000");
	});

	describe("examples", () => {
		describe("construct", () => {
			it("should construct from components", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				expect(time).instanceof(LocalTime);
				expect(time.toString()).equal("18:30:15.225");
			});

			it("should construct from native Date 1", () => {
				const date = new Date(Date.UTC(2022, 1, 15, 18, 30, 15, 225));
				const time = LocalTime.fromNativeUtc(date);
				expect(time).instanceof(LocalTime);
				expect(time.toString()).equal("18:30:15.225");
			});

			it("should construct from native Date 2", () => {
				const date = new Date(2022, 1, 15, 18, 30, 15, 225);
				const time = LocalTime.fromNativeLocal(date);
				expect(time).instanceof(LocalTime);
				expect(time.toString()).equal("18:30:15.225");
			});

			it("should construct from native Date 3", () => {
				const date = new Date(Date.UTC(2022, 1, 15, 18, 30, 15, 225));
				const zone = ZoneId.of("Europe/Berlin");
				const time = Instant.fromNative(date).atZone(zone).time;
				expect(time).instanceof(LocalTime);
				expect(time.toString()).equal("19:30:15.225");
			});

			it("should construct from Instant", () => {
				const instant = Instant.parse("2022-02-15T18:30:15.225Z");
				const zone = ZoneId.of("Europe/Berlin");
				const time = instant.atZone(zone).time;
				expect(time).instanceof(LocalTime);
				expect(time.toString()).equal("19:30:15.225");
			});

			it("should construct from LocalDateTime", () => {
				const localDateTime = LocalDateTime.ofComponents(2022, FEBRUARY, 15, 18, 30, 15, 225);
				const time = localDateTime.time;
				expect(time).instanceof(LocalTime);
				expect(time.toString()).equal("18:30:15.225");
			});

			it("should construct from OffsetDateTime", () => {
				const offsetDateTime = OffsetDateTime.parse("2022-02-15T18:30:15.225+01:00");
				const time = offsetDateTime.time;
				expect(time).instanceof(LocalTime);
				expect(time.toString()).equal("18:30:15.225");
			});

			it("should construct from ZonedDateTime", () => {
				const zonedDateTime = ZonedDateTime.parse("2022-02-15T18:30:15.225+01:00[Europe/Berlin]");
				const time = zonedDateTime.time;
				expect(time).instanceof(LocalTime);
				expect(time.toString()).equal("18:30:15.225");
			});
		});

		describe("parse", () => {
			it("should parse ISO 8601", () => {
				const time = LocalTime.parse("18:30:15.225");
				expect(time).instanceof(LocalTime);
				expect(time.toString()).equal("18:30:15.225");
			});
		});

		describe("inspect", () => {
			it("should return various properties", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				const hour = time.hour;
				const minute = time.minute;
				const second = time.second;
				const ms = time.ms;
				expect(hour).equal(18);
				expect(minute).equal(30);
				expect(second).equal(15);
				expect(ms).equal(225);
			});
		});

		describe("compare", () => {
			it("should compare non-null instances", () => {
				const t1 = LocalTime.of(18, 30, 15, 225);
				const t2 = LocalTime.of(18, 30, 15, 226);
				expect(t1.equals(t2)).equal(false);
				expect(t1.isBefore(t2)).equal(true);
				expect(t1.isAfter(t2)).equal(false);
				expect(t1.compareTo(t2)).equal(-1);
			});

			it("should compare nullable instances", () => {
				const t1: LocalTime = null;
				const t2 = LocalTime.of(18, 30, 15, 225);
				expect(LocalTime.equal(t1, t2)).equal(false);
				expect(LocalTime.isBefore(t1, t2)).equal(true);
				expect(LocalTime.isAfter(t1, t2)).equal(false);
				expect(LocalTime.compare(t1, t2)).equal(-1);
			});
		});

		describe("manipulate", () => {
			it("should add/subtract duration", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				const t1 = time.plus(MINUTE_DURATION);
				const t2 = time.plus(Duration.ofHours(10));
				const t3 = time.minus(Duration.ofSeconds(30));
				expect(t1).instanceof(LocalTime);
				expect(t2).instanceof(LocalTime);
				expect(t3).instanceof(LocalTime);
				expect(t1.toString()).equal("18:31:15.225");
				expect(t2.toString()).equal("04:30:15.225");
				expect(t3.toString()).equal("18:29:45.225");
			});

			it("should change hour", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				const t1 = time.withHour(20);
				expect(t1).instanceof(LocalTime);
				expect(t1.toString()).equal("20:30:15.225");
			});

			it("should change minute", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				const t2 = time.withMinute(20);
				expect(t2).instanceof(LocalTime);
				expect(t2.toString()).equal("18:20:15.225");
			});

			it("should change second", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				const t3 = time.withSecond(20);
				expect(t3).instanceof(LocalTime);
				expect(t3.toString()).equal("18:30:20.225");
			});

			it("should change millisecond", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				const t4 = time.withMs(20);
				expect(t4).instanceof(LocalTime);
				expect(t4.toString()).equal("18:30:15.020");
			});

			it("should truncate to hour", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				const t1 = time.truncateToHour;
				expect(t1).instanceof(LocalTime);
				expect(t1.toString()).equal("18:00:00.000");
			});

			it("should truncate to minute", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				const t2 = time.truncateToMinute;
				expect(t2).instanceof(LocalTime);
				expect(t2.toString()).equal("18:30:00.000");
			});

			it("should truncate to second", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				const t3 = time.truncateToSecond;
				expect(t3).instanceof(LocalTime);
				expect(t3.toString()).equal("18:30:15.000");
			});
		});

		describe("convert", () => {
			it("should convert to LocalDateTime", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const time = LocalTime.of(18, 30, 15, 225);
				const dateTime = time.atDate(date);
				expect(dateTime).instanceof(LocalDateTime);
				expect(dateTime.toString()).equal("2022-02-15T18:30:15.225");
			});

			it("should convert to OffsetDateTime", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const time = LocalTime.of(18, 30, 15, 225);
				const offset = ZoneOffset.ofComponents(1);
				const offsetDateTime = time.atDate(date).atOffset(offset);
				expect(offsetDateTime).instanceof(OffsetDateTime);
				expect(offsetDateTime.toString()).equal("2022-02-15T18:30:15.225+01:00");
			});

			it("should convert to ZonedDateTime", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const time = LocalTime.of(18, 30, 15, 225);
				const zone = ZoneId.of("Europe/Berlin");
				const zonedDateTime = time.atDate(date).atZone(zone);
				expect(zonedDateTime).instanceof(ZonedDateTime);
				expect(zonedDateTime.toString()).equal("2022-02-15T18:30:15.225+01:00[Europe/Berlin]");
			});

			it("should convert to Instant", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const time = LocalTime.of(18, 30, 15, 225);
				const zone = ZoneId.of("Europe/Berlin");
				const instant = time.atDate(date).atZone(zone).instant;
				expect(instant).instanceof(Instant);
				expect(instant.toString()).equal("2022-02-15T17:30:15.225Z");
			});

			it("should convert to LocalTime in another ZoneId", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const time = LocalTime.of(18, 30, 15, 225);
				const sourceZone = ZoneId.of("Europe/Berlin");
				const targetZone = ZoneId.of("America/New_York");
				const result = time.atDate(date).atZone(sourceZone).instant.atZone(targetZone).time;
				expect(result).instanceof(LocalTime);
				expect(result.toString()).equal("12:30:15.225");
			});

			it("should convert to LocalTime in another ZoneOffset", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				const sourceOffset = ZoneOffset.ofComponents(1);
				const targetOffset = ZoneOffset.ofComponents(-5);
				const result = time.minus(Duration.ofSeconds(sourceOffset.totalSeconds)).plus(Duration.ofSeconds(targetOffset.totalSeconds));
				expect(result).instanceof(LocalTime);
				expect(result.toString()).equal("12:30:15.225");
			});

			it("should convert to native Date", () => {
				const date = LocalDate.of(2022, FEBRUARY, 15);
				const time = LocalTime.of(18, 30, 15, 225);
				const zone = ZoneId.of("Europe/Berlin");
				const result = LocalDateTime.of(date, time).atZone(zone).native;
				expect(result).instanceof(Date);
				expect(result.getTime()).equal(Date.UTC(2022, 1, 15, 17, 30, 15, 225));
			});
		});

		describe("format", () => {
			it("should format in ISO 8601", () => {
				const time = LocalTime.of(18, 30, 15, 225);
				expect(time.toString()).equal("18:30:15.225");
			});
		});
	});
});
