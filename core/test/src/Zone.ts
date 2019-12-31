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

import Instant from "../../main/src/Instant";
import LocalDateTime from "../../main/src/LocalDateTime";
import {MARCH, NOVEMBER, OCTOBER} from "../../main/src/Month";
import {UTC, ZoneId, ZoneOffset} from "../../main/src/Zone";

describe("ZoneOffset", () => {
	// TODO: Initialize values in beforeAll
	const instant = Instant.fromNative(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4))),
		dateTime = LocalDateTime.fromNativeUtc(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4))),
		p12345 = ZoneOffset.ofTotalSeconds(12345),
		m12345 = ZoneOffset.ofTotalSeconds(-12345);

	it("should have id", () => {
		expect(UTC.id).toBe("Z");
		expect(p12345.id).toBe("+03:25:45");
		expect(m12345.id).toBe("-03:25:45");
	});

	it("should return itself by instant", () => {
		expect(UTC.offsetAtInstant(instant)).toBe(UTC);
		expect(p12345.offsetAtInstant(instant)).toBe(p12345);
		expect(m12345.offsetAtInstant(instant)).toBe(m12345);
	});

	it("should return itself by local date/time", () => {
		expect(UTC.offsetAtLocalDateTime(dateTime)).toBe(UTC);
		expect(p12345.offsetAtLocalDateTime(dateTime)).toBe(p12345);
		expect(m12345.offsetAtLocalDateTime(dateTime)).toBe(m12345);
	});

	it("should return total seconds", () => {
		expect(UTC.totalSeconds).toBe(0);
		expect(p12345.totalSeconds).toBe(12345);
		expect(m12345.totalSeconds).toBe(-12345);
	});

	it("should return hours", () => {
		expect(UTC.hours).toBe(0);
		expect(p12345.hours).toBe(3);
		expect(m12345.hours).toBe(-3);
	});

	it("should return minutes", () => {
		expect(UTC.minutes).toBe(0);
		expect(p12345.minutes).toBe(25);
		expect(m12345.minutes).toBe(25);
	});

	it("should return seconds", () => {
		expect(UTC.seconds).toBe(0);
		expect(p12345.seconds).toBe(45);
		expect(m12345.seconds).toBe(45);
	});

	it("should normalize ID and return cached instances by ID", () => {
		expect(ZoneOffset.of("")).toBe(UTC);
		expect(ZoneOffset.of("+032545")).toBe(p12345);
		expect(ZoneOffset.of("-032545")).toBe(m12345);
		expect(ZoneOffset.of("+03:25:45")).toBe(p12345);
		expect(ZoneOffset.of("-03:25:45")).toBe(m12345);
	});

	it("should return cached instances by total seconds", () => {
		expect(ZoneOffset.ofTotalSeconds(0)).toBe(UTC);
		expect(ZoneOffset.ofTotalSeconds(12345)).toBe(p12345);
		expect(ZoneOffset.ofTotalSeconds(-12345)).toBe(m12345);
	});

	it("should return cached instances by components", () => {
		expect(ZoneOffset.ofComponents(0)).toBe(UTC);
		expect(ZoneOffset.ofComponents(3, 25, 45)).toBe(p12345);
		expect(ZoneOffset.ofComponents(-3, -25, -45)).toBe(m12345);
	});

	it("should get parsed from string", () => {
		expect(ZoneOffset.of("+3").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("+03").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("-3").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("-03").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("+0300").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("-0300").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("+03:00").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("-03:00").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("+030000").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("-030000").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("+03:00:00").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("-03:00:00").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("+0325").totalSeconds).toBe(12300);
		expect(ZoneOffset.of("-0325").totalSeconds).toBe(-12300);
		expect(ZoneOffset.of("+03:25").totalSeconds).toBe(12300);
		expect(ZoneOffset.of("-03:25").totalSeconds).toBe(-12300);
		expect(ZoneOffset.of("+032545").totalSeconds).toBe(12345);
		expect(ZoneOffset.of("-032545").totalSeconds).toBe(-12345);
		expect(ZoneOffset.of("+03:25:45").totalSeconds).toBe(12345);
		expect(ZoneOffset.of("-03:25:45").totalSeconds).toBe(-12345);
	});

	it("should return null by null ID", () => {
		expect(ZoneOffset.of(null)).toBeNull();
	});

	it("should throw error by invalid ID", () => {
		expect(() => ZoneOffset.of("abc")).toThrow(new Error("Invalid time zone offset."));
	});

	it("should convert itself to string", () => {
		expect(UTC.toString()).toBe("Z");
		expect(p12345.toString()).toBe("+03:25:45");
		expect(m12345.toString()).toBe("-03:25:45");
	});

	// TODO: Test compare
});

describe("ZoneId", () => {
	// TODO: Initialize values in beforeAll
	const utcp3 = ZoneId.of("UTC+3"),
		utcm3 = ZoneId.of("UTC-3"),
		utp3 = ZoneId.of("UT+3"),
		utm3 = ZoneId.of("UT-3"),
		gmtp3 = ZoneId.of("GMT+3"),
		gmtm3 = ZoneId.of("GMT-3"),
		omsk = ZoneId.of("Asia/Omsk"),
		berlin = ZoneId.of("Europe/Berlin"),
		newYork = ZoneId.of("America/New_York"),
		winterInstant = Instant.fromNative(new Date(Date.UTC(2019, 1, 5, 1, 2, 3, 4))),
		summerInstant = Instant.fromNative(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4))),
		winterDateTime = LocalDateTime.fromNativeUtc(new Date(Date.UTC(2019, 1, 5, 1, 2, 3, 4))),
		summerDateTime = LocalDateTime.fromNativeUtc(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4)));

	it("should get parsed as offset", () => {
		expect(ZoneId.of("")).toBe(UTC);
		expect(ZoneId.of("+3")).toBe(ZoneOffset.of("+3"));
		expect(ZoneId.of("+03")).toBe(ZoneOffset.of("+03"));
		expect(ZoneId.of("-3")).toBe(ZoneOffset.of("-3"));
		expect(ZoneId.of("-03")).toBe(ZoneOffset.of("-03"));
		expect(ZoneId.of("+0300")).toBe(ZoneOffset.of("+0300"));
		expect(ZoneId.of("-0300")).toBe(ZoneOffset.of("-0300"));
		expect(ZoneId.of("+03:00")).toBe(ZoneOffset.of("+03:00"));
		expect(ZoneId.of("-03:00")).toBe(ZoneOffset.of("-03:00"));
		expect(ZoneId.of("+030000")).toBe(ZoneOffset.of("+030000"));
		expect(ZoneId.of("-030000")).toBe(ZoneOffset.of("-030000"));
		expect(ZoneId.of("+03:00:00")).toBe(ZoneOffset.of("+03:00:00"));
		expect(ZoneId.of("-03:00:00")).toBe(ZoneOffset.of("-03:00:00"));
		expect(ZoneId.of("+0325")).toBe(ZoneOffset.of("+0325"));
		expect(ZoneId.of("-0325")).toBe(ZoneOffset.of("-0325"));
		expect(ZoneId.of("+03:25")).toBe(ZoneOffset.of("+03:25"));
		expect(ZoneId.of("-03:25")).toBe(ZoneOffset.of("-03:25"));
		expect(ZoneId.of("+032545")).toBe(ZoneOffset.of("+032545"));
		expect(ZoneId.of("-032545")).toBe(ZoneOffset.of("-032545"));
		expect(ZoneId.of("+03:25:45")).toBe(ZoneOffset.of("+03:25:45"));
		expect(ZoneId.of("-03:25:45")).toBe(ZoneOffset.of("-03:25:45"));
	});

	it("should have normalized id if starts with UTC, UT or GMT", () => {
		expect(utcp3.id).toBe("UTC+03:00");
		expect(utcm3.id).toBe("UTC-03:00");
		expect(utp3.id).toBe("UT+03:00");
		expect(utm3.id).toBe("UT-03:00");
		expect(gmtp3.id).toBe("GMT+03:00");
		expect(gmtm3.id).toBe("GMT-03:00");
	});

	it("should have specified id if named", () => {
		expect(omsk.id).toBe("Asia/Omsk");
		expect(berlin.id).toBe("Europe/Berlin");
		expect(newYork.id).toBe("America/New_York");
	});

	it("should return fixed offset by instant", () => {
		expect(utcp3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("+3"));
		expect(utcm3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("-3"));
		expect(utp3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("+3"));
		expect(utm3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("-3"));
		expect(gmtp3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("+3"));
		expect(gmtm3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("-3"));
	});

	it("should return winter offset by instant", () => {
		expect(omsk.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("+6"));
		expect(berlin.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("+1"));
		expect(newYork.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("-5"));
	});

	it("should return summer offset by instant", () => {
		expect(omsk.offsetAtInstant(summerInstant)).toBe(ZoneOffset.of("+6"));
		expect(berlin.offsetAtInstant(summerInstant)).toBe(ZoneOffset.of("+2"));
		expect(newYork.offsetAtInstant(summerInstant)).toBe(ZoneOffset.of("-4"));
	});

	it("should return edge offset by instant", () => {
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 31, 0, 59)))).toBe(ZoneOffset.of("+1"));
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 31, 1, 0)))).toBe(ZoneOffset.of("+2"));
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 31, 1, 1)))).toBe(ZoneOffset.of("+2"));
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 9, 27, 0, 59)))).toBe(ZoneOffset.of("+2"));
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 9, 27, 1, 0)))).toBe(ZoneOffset.of("+1"));
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 9, 27, 1, 1)))).toBe(ZoneOffset.of("+1"));

		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 10, 6, 59)))).toBe(ZoneOffset.of("-5"));
		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 10, 7, 0)))).toBe(ZoneOffset.of("-4"));
		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 10, 7, 1)))).toBe(ZoneOffset.of("-4"));
		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 10, 3, 5, 59)))).toBe(ZoneOffset.of("-4"));
		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 10, 3, 6, 0)))).toBe(ZoneOffset.of("-5"));
		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 10, 3, 6, 1)))).toBe(ZoneOffset.of("-5"));
	});

	it("should return fixed offset by local date/time", () => {
		expect(utcp3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("+3"));
		expect(utcm3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("-3"));
		expect(utp3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("+3"));
		expect(utm3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("-3"));
		expect(gmtp3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("+3"));
		expect(gmtm3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("-3"));
	});

	it("should return winter offset by local date/time", () => {
		expect(omsk.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("+6"));
		expect(berlin.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("+1"));
		expect(newYork.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("-5"));
	});

	it("should return summer offset by local date/time", () => {
		expect(omsk.offsetAtLocalDateTime(summerDateTime)).toBe(ZoneOffset.of("+6"));
		expect(berlin.offsetAtLocalDateTime(summerDateTime)).toBe(ZoneOffset.of("+2"));
		expect(newYork.offsetAtLocalDateTime(summerDateTime)).toBe(ZoneOffset.of("-4"));
	});

	it("should prefer earlier offset by local date/time", () => {
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 31, 2, 0))).toBe(ZoneOffset.of("+1"));
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 31, 2, 30))).toBe(ZoneOffset.of("+1")); // gap
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 31, 3, 0))).toBe(ZoneOffset.of("+2"));
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, OCTOBER, 27, 1, 59))).toBe(ZoneOffset.of("+2"));
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, OCTOBER, 27, 2, 0))).toBe(ZoneOffset.of("+2")); // overlap starts
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, OCTOBER, 27, 2, 59))).toBe(ZoneOffset.of("+2")); // overlap goes
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, OCTOBER, 27, 3, 0))).toBe(ZoneOffset.of("+1")); // overlap finishes

		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 10, 2, 0))).toBe(ZoneOffset.of("-5"));
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 10, 2, 30))).toBe(ZoneOffset.of("-5")); // gap
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 10, 3, 0))).toBe(ZoneOffset.of("-4"));
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, NOVEMBER, 3, 0, 59))).toBe(ZoneOffset.of("-4"));
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, NOVEMBER, 3, 1, 0))).toBe(ZoneOffset.of("-4")); // overlap starts
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, NOVEMBER, 3, 1, 59))).toBe(ZoneOffset.of("-4")); // overlap goes
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, NOVEMBER, 3, 2, 0))).toBe(ZoneOffset.of("-5")); // overlap finishes
	});

	it("should return null by null ID", () => {
		expect(ZoneId.of(null)).toBeNull();
	});

	it("should throw error by invalid ID", () => {
		expect(() => ZoneId.of("abc")).toThrow(new Error("Invalid time zone ID."));
	});

	it("should convert itself to a string", () => {
		expect(utcp3.toString()).toBe("UTC+03:00");
		expect(utcm3.toString()).toBe("UTC-03:00");
		expect(utp3.toString()).toBe("UT+03:00");
		expect(utm3.toString()).toBe("UT-03:00");
		expect(gmtp3.toString()).toBe("GMT+03:00");
		expect(gmtm3.toString()).toBe("GMT-03:00");

		expect(omsk.toString()).toBe("Asia/Omsk");
		expect(berlin.toString()).toBe("Europe/Berlin");
		expect(newYork.toString()).toBe("America/New_York");
	});
});
