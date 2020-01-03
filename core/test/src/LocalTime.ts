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

import Duration, {
	DAY_DURATION,
	HOUR_DURATION,
	MINUTE_DURATION,
	MS_DURATION,
	NULL_DURATION,
	SECOND_DURATION
} from "ts-time/Duration";
import LocalDate from "ts-time/LocalDate";
import LocalTime, {MAX_TIME, MAX_TIME12, MIDNIGHT, NOON} from "ts-time/LocalTime";
import {SEPTEMBER} from "ts-time/Month";
import {HOUR12_FIELD, HOUR_FIELD, MINUTE_FIELD, MS_FIELD, SECOND_FIELD} from "ts-time/TimeField";

// TODO: Add out of bounds tests (e.g. constructors)
describe("LocalTime", () => {
	const time = LocalTime.of(18, 30, 15, 225);

	it("should construct itself", () => {
		expect(LocalTime.of(18, 30, 15, 225).totalMs).toBe(66615225);
		expect(LocalTime.ofTotalMs(12345).totalMs).toBe(12345);
		expect(LocalTime.fromNativeLocal(new Date(2019, 8, 10, 18, 30, 15, 225)).totalMs).toBe(66615225);
		expect(LocalTime.fromNativeUtc(new Date(Date.UTC(2019, 8, 10, 18, 30, 15, 225))).totalMs).toBe(66615225);
	});

	it("should construct from string", () => {
		expect(LocalTime.parse("0:0:0.0").totalMs).toBe(0);
		expect(LocalTime.parse("00:00:00.000").totalMs).toBe(0);
		expect(LocalTime.parse("00:00:00").totalMs).toBe(0);
		expect(LocalTime.parse("00:00").totalMs).toBe(0);
		expect(LocalTime.parse("18:30:15.225").totalMs).toBe(66615225);
		expect(LocalTime.parse("18:30:15").totalMs).toBe(66615000);
		expect(LocalTime.parse("18:30").totalMs).toBe(66600000);
	});

	it("should throw an error by invalid string", () => {
		expect(() => LocalTime.parse("abc")).toThrow(new Error("Invalid time format."));
	});

	it("should convert itself to string", () => {
		expect(time.toString()).toBe("18:30:15.225");
	});

	it("should return proper hour", () => {
		expect(time.hour).toBe(18);
		expect(MIDNIGHT.hour).toBe(0);
		expect(NOON.hour).toBe(12);
		expect(MAX_TIME.hour).toBe(23);
		expect(MAX_TIME12.hour).toBe(11);
	});

	it("should return proper minute", () => {
		expect(time.minute).toBe(30);
		expect(MIDNIGHT.minute).toBe(0);
		expect(NOON.minute).toBe(0);
		expect(MAX_TIME.minute).toBe(59);
		expect(MAX_TIME12.minute).toBe(59);
	});

	it("should return proper second", () => {
		expect(time.second).toBe(15);
		expect(MIDNIGHT.second).toBe(0);
		expect(NOON.second).toBe(0);
		expect(MAX_TIME.second).toBe(59);
		expect(MAX_TIME12.second).toBe(59);
	});

	it("should return proper millisecond", () => {
		expect(time.ms).toBe(225);
		expect(MIDNIGHT.ms).toBe(0);
		expect(NOON.ms).toBe(0);
		expect(MAX_TIME.ms).toBe(999);
		expect(MAX_TIME12.ms).toBe(999);
	});

	it("should return proper total millisecond", () => {
		expect(time.totalMs).toBe(66615225);
		expect(MIDNIGHT.totalMs).toBe(0);
		expect(NOON.totalMs).toBe(43200000);
		expect(MAX_TIME.totalMs).toBe(86399999);
		expect(MAX_TIME12.totalMs).toBe(43199999);
	});

	it("should return proper field", () => {
		expect(time.get(HOUR_FIELD)).toBe(18);
		expect(time.get(HOUR12_FIELD)).toBe(6);
		expect(time.get(MINUTE_FIELD)).toBe(30);
		expect(time.get(SECOND_FIELD)).toBe(15);
		expect(time.get(MS_FIELD)).toBe(225);
	});

	it("should compare itself", () => {
		expect(time.compareTo(MIDNIGHT)).toBeGreaterThan(0);
		expect(time.compareTo(LocalTime.of(18, 30, 15, 224))).toBeGreaterThan(0);
		expect(time.compareTo(time)).toBe(0);
		expect(time.compareTo(LocalTime.of(18, 30, 15, 225))).toBe(0);
		expect(time.compareTo(LocalTime.of(18, 30, 15, 226))).toBeLessThan(0);
		expect(time.compareTo(MAX_TIME)).toBeLessThan(0);
	});

	it("should compare itself statically", () => {
		expect(LocalTime.compare(time, MIDNIGHT)).toBeGreaterThan(0);
		expect(LocalTime.compare(time, LocalTime.of(18, 30, 15, 224))).toBeGreaterThan(0);
		expect(LocalTime.compare(time, time)).toBe(0);
		expect(LocalTime.compare(time, LocalTime.of(18, 30, 15, 225))).toBe(0);
		expect(LocalTime.compare(time, LocalTime.of(18, 30, 15, 226))).toBeLessThan(0);
		expect(LocalTime.compare(time, MAX_TIME)).toBeLessThan(0);
	});

	it("should compare itself with null", () => {
		expect(time.compareTo(null)).toBeGreaterThan(0);
		expect(LocalTime.compare(time, null)).toBeGreaterThan(0);
		expect(LocalTime.compare(null, time)).toBeLessThan(0);
		expect(LocalTime.compare(null, null)).toBe(0);
	});

	it("should check itself for equality", () => {
		expect(time.equals(MIDNIGHT)).toBe(false);
		expect(time.equals(LocalTime.of(18, 30, 15, 224))).toBe(false);
		expect(time.equals(time)).toBe(true);
		expect(time.equals(LocalTime.of(18, 30, 15, 225))).toBe(true);
		expect(time.equals(LocalTime.of(18, 30, 15, 226))).toBe(false);
		expect(time.equals(MAX_TIME)).toBe(false);
	});

	it("should check itself for equality statically", () => {
		expect(LocalTime.equal(time, MIDNIGHT)).toBe(false);
		expect(LocalTime.equal(time, LocalTime.of(18, 30, 15, 224))).toBe(false);
		expect(LocalTime.equal(time, time)).toBe(true);
		expect(LocalTime.equal(time, LocalTime.of(18, 30, 15, 225))).toBe(true);
		expect(LocalTime.equal(time, LocalTime.of(18, 30, 15, 226))).toBe(false);
		expect(LocalTime.equal(time, MAX_TIME)).toBe(false);
	});

	it("should check itself for equality with null", () => {
		expect(time.equals(null)).toBe(false);
		expect(LocalTime.equal(time, null)).toBe(false);
		expect(LocalTime.equal(null, time)).toBe(false);
		expect(LocalTime.equal(null, null)).toBe(true);
	});

	it("should compare itself with isBefore method", () => {
		expect(time.isBefore(MIDNIGHT)).toBe(false);
		expect(time.isBefore(LocalTime.of(18, 30, 15, 224))).toBe(false);
		expect(time.isBefore(time)).toBe(false);
		expect(time.isBefore(LocalTime.of(18, 30, 15, 225))).toBe(false);
		expect(time.isBefore(LocalTime.of(18, 30, 15, 226))).toBe(true);
		expect(time.isBefore(MAX_TIME)).toBe(true);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(LocalTime.isBefore(time, MIDNIGHT)).toBe(false);
		expect(LocalTime.isBefore(time, LocalTime.of(18, 30, 15, 224))).toBe(false);
		expect(LocalTime.isBefore(time, time)).toBe(false);
		expect(LocalTime.isBefore(time, LocalTime.of(18, 30, 15, 225))).toBe(false);
		expect(LocalTime.isBefore(time, LocalTime.of(18, 30, 15, 226))).toBe(true);
		expect(LocalTime.isBefore(time, MAX_TIME)).toBe(true);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(time.isBefore(null)).toBe(false);
		expect(LocalTime.isBefore(time, null)).toBe(false);
		expect(LocalTime.isBefore(null, time)).toBe(true);
		expect(LocalTime.isBefore(null, null)).toBe(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(time.isAfter(MIDNIGHT)).toBe(true);
		expect(time.isAfter(LocalTime.of(18, 30, 15, 224))).toBe(true);
		expect(time.isAfter(time)).toBe(false);
		expect(time.isAfter(LocalTime.of(18, 30, 15, 225))).toBe(false);
		expect(time.isAfter(LocalTime.of(18, 30, 15, 226))).toBe(false);
		expect(time.isAfter(MAX_TIME)).toBe(false);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(LocalTime.isAfter(time, MIDNIGHT)).toBe(true);
		expect(LocalTime.isAfter(time, LocalTime.of(18, 30, 15, 224))).toBe(true);
		expect(LocalTime.isAfter(time, time)).toBe(false);
		expect(LocalTime.isAfter(time, LocalTime.of(18, 30, 15, 225))).toBe(false);
		expect(LocalTime.isAfter(time, LocalTime.of(18, 30, 15, 226))).toBe(false);
		expect(LocalTime.isAfter(time, MAX_TIME)).toBe(false);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(time.isAfter(null)).toBe(true);
		expect(LocalTime.isAfter(time, null)).toBe(true);
		expect(LocalTime.isAfter(null, time)).toBe(false);
		expect(LocalTime.isAfter(null, null)).toBe(false);
	});

	it("should create proper date/time (atDate)", () => {
		expect(time.atDate(LocalDate.of(2019, SEPTEMBER, 10)).toString()).toBe("2019-09-10T18:30:15.225");
	});

	it("should add duration", () => {
		expect(time.plus(MS_DURATION).toString()).toBe("18:30:15.226");
		expect(time.plus(SECOND_DURATION).toString()).toBe("18:30:16.225");
		expect(time.plus(MINUTE_DURATION).toString()).toBe("18:31:15.225");
		expect(time.plus(HOUR_DURATION).toString()).toBe("19:30:15.225");
		expect(time.plus(DAY_DURATION).toString()).toBe("18:30:15.225");
		expect(time.plus(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).toBe("20:33:19.230");
		expect(time.plus(Duration.of(-1)).toString()).toBe("18:30:15.224");
	});

	it("should add zero duration", () => {
		expect(time.plus(NULL_DURATION)).toBe(time);
	});

	it("should subtract duration", () => {
		expect(time.minus(MS_DURATION).toString()).toBe("18:30:15.224");
		expect(time.minus(SECOND_DURATION).toString()).toBe("18:30:14.225");
		expect(time.minus(MINUTE_DURATION).toString()).toBe("18:29:15.225");
		expect(time.minus(HOUR_DURATION).toString()).toBe("17:30:15.225");
		expect(time.minus(DAY_DURATION).toString()).toBe("18:30:15.225");
		expect(time.minus(Duration.ofComponents(1, 2, 3, 4, 5)).toString()).toBe("16:27:11.220");
		expect(time.minus(Duration.of(-1)).toString()).toBe("18:30:15.226");
	});

	it("should subtract zero duration", () => {
		expect(time.minus(NULL_DURATION)).toBe(time);
	});

	it("should modify hour", () => {
		expect(MIDNIGHT.withHour(15).toString()).toBe("15:00:00.000");
		expect(time.withHour(15).toString()).toBe("15:30:15.225");
	});

	it("should modify minute", () => {
		expect(MIDNIGHT.withMinute(15).toString()).toBe("00:15:00.000");
		expect(time.withMinute(15).toString()).toBe("18:15:15.225");
	});

	it("should modify second", () => {
		expect(MIDNIGHT.withSecond(12).toString()).toBe("00:00:12.000");
		expect(time.withSecond(12).toString()).toBe("18:30:12.225");
	});

	it("should modify millisecond", () => {
		expect(MIDNIGHT.withMs(15).toString()).toBe("00:00:00.015");
		expect(time.withMs(15).toString()).toBe("18:30:15.015");
	});

	it("should truncate itself to hour", () => {
		expect(time.truncateToHour.toString()).toBe("18:00:00.000");
	});

	it("should truncate itself to minute", () => {
		expect(time.truncateToMinute.toString()).toBe("18:30:00.000");
	});

	it("should truncate itself to second", () => {
		expect(time.truncateToSecond.toString()).toBe("18:30:15.000");
	});
});
