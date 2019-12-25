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

import {MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE, MS_PER_SECOND, MS_PER_WEEK} from "../../core/src/constants";
import Duration, {
	DAY_DURATION,
	HOUR_DURATION,
	MINUTE_DURATION,
	MS_DURATION,
	NULL_DURATION,
	SECOND_DURATION,
	WEEK_DURATION
} from "../../core/src/Duration";
import Instant from "../../core/src/Instant";
import {ZoneId, ZoneOffset} from "../../core/src/Zone";

describe("Instant", () => {
	const native = new Date(Date.UTC(2019, 8, 10, 10)),
		instant = Instant.fromNative(native);

	it("should construct itself", () => {
		expect(Instant.ofEpochMs(123456789).epochMs).toBe(123456789);
		expect(Instant.fromNative(new Date(123456789)).epochMs).toBe(123456789);
		expect(Math.abs(Instant.now().epochMs - new Date().getTime())).toBeLessThan(100);
	});

	it("should construct from a string", () => {
		expect(Instant.parse("2019-09-10T01:02:03.004Z").epochMs).toBe(Date.UTC(2019, 8, 10, 1, 2, 3, 4));
		expect(Instant.parse("2019-09-10T01:02:03.004-3").epochMs).toBe(Date.UTC(2019, 8, 10, 4, 2, 3, 4));
	});

	it("should throw an error by invalid string", () => {
		expect(() => Instant.parse("abc")).toThrow(new Error("Invalid instant format."));
	});

	it("should return native date", () => {
		expect(Instant.ofEpochMs(123456789).native.getTime()).toBe(123456789);
	});

	it("should return offset date/time", () => {
		expect(instant.atOffset(ZoneOffset.of("+3")).toString()).toBe("2019-09-10T13:00:00.000+03:00");
	});

	it("should return zoned date/time", () => {
		expect(instant.atZone(ZoneId.of("Europe/Berlin")).toString())
			.toBe("2019-09-10T12:00:00.000+02:00[Europe/Berlin]");
	});

	it("should compare itself", () => {
		expect(instant.compareTo(instant)).toBe(0);
		expect(instant.compareTo(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).toBe(0);
		expect(instant.compareTo(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).toBeLessThan(0);
		expect(instant.compareTo(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).toBeGreaterThan(0);
	});

	it("should compare itself statically", () => {
		expect(Instant.compare(instant, instant)).toBe(0);
		expect(Instant.compare(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).toBe(0);
		expect(Instant.compare(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).toBeLessThan(0);
		expect(Instant.compare(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).toBeGreaterThan(0);
	});

	it("should compare itself with null", () => {
		expect(instant.compareTo(null)).toBeGreaterThan(0);
		expect(Instant.compare(instant, null)).toBeGreaterThan(0);
		expect(Instant.compare(null, instant)).toBeLessThan(0);
		expect(Instant.compare(null, null)).toBe(0);
	});

	it("should check itself for equality", () => {
		expect(instant.equals(instant)).toBe(true);
		expect(instant.equals(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).toBe(true);
		expect(instant.equals(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).toBe(false);
		expect(instant.equals(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).toBe(false);
	});

	it("should check itself for equality statically", () => {
		expect(Instant.equal(instant, instant)).toBe(true);
		expect(Instant.equal(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).toBe(true);
		expect(Instant.equal(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).toBe(false);
		expect(Instant.equal(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).toBe(false);
	});

	it("should check itself for equality with null", () => {
		expect(instant.equals(null)).toBe(false);
		expect(Instant.equal(instant, null)).toBe(false);
		expect(Instant.equal(null, instant)).toBe(false);
		expect(Instant.equal(null, null)).toBe(true);
	});

	it("should compare itself with isBefore method", () => {
		expect(instant.isBefore(instant)).toBe(false);
		expect(instant.isBefore(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).toBe(false);
		expect(instant.isBefore(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).toBe(true);
		expect(instant.isBefore(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).toBe(false);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(Instant.isBefore(instant, instant)).toBe(false);
		expect(Instant.isBefore(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).toBe(false);
		expect(Instant.isBefore(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).toBe(true);
		expect(Instant.isBefore(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).toBe(false);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(instant.isBefore(null)).toBe(false);
		expect(Instant.isBefore(instant, null)).toBe(false);
		expect(Instant.isBefore(null, instant)).toBe(true);
		expect(Instant.isBefore(null, null)).toBe(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(instant.isAfter(instant)).toBe(false);
		expect(instant.isAfter(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).toBe(false);
		expect(instant.isAfter(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).toBe(false);
		expect(instant.isAfter(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).toBe(true);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(Instant.isAfter(instant, instant)).toBe(false);
		expect(Instant.isAfter(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))))).toBe(false);
		expect(Instant.isAfter(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10, 0, 0, 1))))).toBe(false);
		expect(Instant.isAfter(instant, Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 9, 59, 59, 999))))).toBe(true);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(instant.isAfter(null)).toBe(true);
		expect(Instant.isAfter(instant, null)).toBe(true);
		expect(Instant.isAfter(null, instant)).toBe(false);
		expect(Instant.isAfter(null, null)).toBe(false);
	});

	it("should add milliseconds", () => {
		expect(instant.plus(0).epochMs).toEqual(Date.UTC(2019, 8, 10, 10));
		expect(instant.plus(1).epochMs).toEqual(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
		expect(instant.plus(12345).epochMs).toEqual(Date.UTC(2019, 8, 10, 10, 0, 12, 345));
		expect(instant.plus(-1).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
	});

	it("should add milliseconds", () => {
		expect(instant.plus(0).epochMs).toEqual(Date.UTC(2019, 8, 10, 10));
		expect(instant.plus(1).epochMs).toEqual(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
		expect(instant.plus(MS_PER_SECOND).epochMs).toEqual(Date.UTC(2019, 8, 10, 10, 0, 1));
		expect(instant.plus(MS_PER_MINUTE).epochMs).toEqual(Date.UTC(2019, 8, 10, 10, 1));
		expect(instant.plus(MS_PER_HOUR).epochMs).toEqual(Date.UTC(2019, 8, 10, 11));
		expect(instant.plus(MS_PER_DAY).epochMs).toEqual(Date.UTC(2019, 8, 11, 10));
		expect(instant.plus(MS_PER_WEEK).epochMs).toEqual(Date.UTC(2019, 8, 17, 10));
		expect(instant.plus(25 * MS_PER_DAY).epochMs).toEqual(Date.UTC(2019, 9, 5, 10));
		expect(instant.plus(-1).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
	});

	it("should add duration", () => {
		expect(instant.plus(NULL_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 10));
		expect(instant.plus(MS_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
		expect(instant.plus(SECOND_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 10, 0, 1));
		expect(instant.plus(MINUTE_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 10, 1));
		expect(instant.plus(HOUR_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 11));
		expect(instant.plus(DAY_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 11, 10));
		expect(instant.plus(WEEK_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 17, 10));
		expect(instant.plus(Duration.ofDays(25)).epochMs).toEqual(Date.UTC(2019, 9, 5, 10));
		expect(instant.plus(Duration.ofMs(-1)).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
	});

	it("should subtract milliseconds", () => {
		expect(instant.minus(0).epochMs).toEqual(Date.UTC(2019, 8, 10, 10));
		expect(instant.minus(1).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
		expect(instant.minus(MS_PER_SECOND).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59, 59));
		expect(instant.minus(MS_PER_MINUTE).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59));
		expect(instant.minus(MS_PER_HOUR).epochMs).toEqual(Date.UTC(2019, 8, 10, 9));
		expect(instant.minus(MS_PER_DAY).epochMs).toEqual(Date.UTC(2019, 8, 9, 10));
		expect(instant.minus(MS_PER_WEEK).epochMs).toEqual(Date.UTC(2019, 8, 3, 10));
		expect(instant.minus(25 * MS_PER_DAY).epochMs).toEqual(Date.UTC(2019, 7, 16, 10));
		expect(instant.minus(-1).epochMs).toEqual(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
	});

	it("should subtract duration", () => {
		expect(instant.minus(NULL_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 10));
		expect(instant.minus(MS_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
		expect(instant.minus(SECOND_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59, 59));
		expect(instant.minus(MINUTE_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59));
		expect(instant.minus(HOUR_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 9));
		expect(instant.minus(DAY_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 9, 10));
		expect(instant.minus(WEEK_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 3, 10));
		expect(instant.minus(Duration.ofDays(25)).epochMs).toEqual(Date.UTC(2019, 7, 16, 10));
		expect(instant.minus(Duration.ofMs(-1)).epochMs).toEqual(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
	});

	it("should subtract duration", () => {
		expect(instant.minus(NULL_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 10));
		expect(instant.minus(MS_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59, 59, 999));
		expect(instant.minus(SECOND_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59, 59));
		expect(instant.minus(MINUTE_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 9, 59));
		expect(instant.minus(HOUR_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 10, 9));
		expect(instant.minus(DAY_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 9, 10));
		expect(instant.minus(WEEK_DURATION).epochMs).toEqual(Date.UTC(2019, 8, 3, 10));
		expect(instant.minus(Duration.ofDays(25)).epochMs).toEqual(Date.UTC(2019, 7, 16, 10));
		expect(instant.minus(Duration.ofMs(-1)).epochMs).toEqual(Date.UTC(2019, 8, 10, 10, 0, 0, 1));
	});

	it("should subtract instant", () => {
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 10))).ms).toBe(0);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 10, 0, 0, 1))).ms).toBe(1);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 10, 0, 1))).ms).toBe(MS_PER_SECOND);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 10, 1))).ms).toBe(MS_PER_MINUTE);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 11))).ms).toBe(MS_PER_HOUR);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 11, 10))).ms).toBe(MS_PER_DAY);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 17, 10))).ms).toBe(MS_PER_WEEK);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 9, 5, 10))).ms).toBe(25 * MS_PER_DAY);
		expect(instant.until(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 9, 59, 59, 999))).ms).toBe(-1);
	});

	it("should convert itself to string", () => {
		expect(instant.toString()).toBe("2019-09-10T10:00:00.000Z");
		expect(Instant.ofEpochMs(Date.UTC(2019, 8, 10, 1, 2, 3, 4)).toString()).toBe("2019-09-10T01:02:03.004Z");
	});
});
