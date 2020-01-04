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
import Instant from "ts-time/Instant";
import LocalDateTime from "ts-time/LocalDateTime";
import {MARCH, NOVEMBER, OCTOBER} from "ts-time/Month";
import {UTC, ZoneId, ZoneOffset} from "ts-time/Zone";

describe("ZoneOffset", () => {
	// TODO: Initialize values in beforeAll
	const instant = Instant.fromNative(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4))),
		dateTime = LocalDateTime.fromNativeUtc(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4))),
		p12345 = ZoneOffset.ofTotalSeconds(12345),
		m12345 = ZoneOffset.ofTotalSeconds(-12345);

	it("should have id", () => {
		expect(UTC.id).equal("Z");
		expect(p12345.id).equal("+03:25:45");
		expect(m12345.id).equal("-03:25:45");
	});

	it("should return itself by instant", () => {
		expect(UTC.offsetAtInstant(instant)).equal(UTC);
		expect(p12345.offsetAtInstant(instant)).equal(p12345);
		expect(m12345.offsetAtInstant(instant)).equal(m12345);
	});

	it("should return itself by local date/time", () => {
		expect(UTC.offsetAtLocalDateTime(dateTime)).equal(UTC);
		expect(p12345.offsetAtLocalDateTime(dateTime)).equal(p12345);
		expect(m12345.offsetAtLocalDateTime(dateTime)).equal(m12345);
	});

	it("should return total seconds", () => {
		expect(UTC.totalSeconds).equal(0);
		expect(p12345.totalSeconds).equal(12345);
		expect(m12345.totalSeconds).equal(-12345);
	});

	it("should return hours", () => {
		expect(UTC.hours).equal(0);
		expect(p12345.hours).equal(3);
		expect(m12345.hours).equal(-3);
	});

	it("should return minutes", () => {
		expect(UTC.minutes).equal(0);
		expect(p12345.minutes).equal(25);
		expect(m12345.minutes).equal(25);
	});

	it("should return seconds", () => {
		expect(UTC.seconds).equal(0);
		expect(p12345.seconds).equal(45);
		expect(m12345.seconds).equal(45);
	});

	it("should normalize ID and return cached instances by ID", () => {
		expect(ZoneOffset.of("")).equal(UTC);
		expect(ZoneOffset.of("+032545")).equal(p12345);
		expect(ZoneOffset.of("-032545")).equal(m12345);
		expect(ZoneOffset.of("+03:25:45")).equal(p12345);
		expect(ZoneOffset.of("-03:25:45")).equal(m12345);
	});

	it("should return cached instances by total seconds", () => {
		expect(ZoneOffset.ofTotalSeconds(0)).equal(UTC);
		expect(ZoneOffset.ofTotalSeconds(12345)).equal(p12345);
		expect(ZoneOffset.ofTotalSeconds(-12345)).equal(m12345);
	});

	it("should return cached instances by components", () => {
		expect(ZoneOffset.ofComponents(0)).equal(UTC);
		expect(ZoneOffset.ofComponents(3, 25, 45)).equal(p12345);
		expect(ZoneOffset.ofComponents(-3, -25, -45)).equal(m12345);
	});

	it("should get parsed from string", () => {
		expect(ZoneOffset.of("+3").totalSeconds).equal(10800);
		expect(ZoneOffset.of("+03").totalSeconds).equal(10800);
		expect(ZoneOffset.of("-3").totalSeconds).equal(-10800);
		expect(ZoneOffset.of("-03").totalSeconds).equal(-10800);
		expect(ZoneOffset.of("+0300").totalSeconds).equal(10800);
		expect(ZoneOffset.of("-0300").totalSeconds).equal(-10800);
		expect(ZoneOffset.of("+03:00").totalSeconds).equal(10800);
		expect(ZoneOffset.of("-03:00").totalSeconds).equal(-10800);
		expect(ZoneOffset.of("+030000").totalSeconds).equal(10800);
		expect(ZoneOffset.of("-030000").totalSeconds).equal(-10800);
		expect(ZoneOffset.of("+03:00:00").totalSeconds).equal(10800);
		expect(ZoneOffset.of("-03:00:00").totalSeconds).equal(-10800);
		expect(ZoneOffset.of("+0325").totalSeconds).equal(12300);
		expect(ZoneOffset.of("-0325").totalSeconds).equal(-12300);
		expect(ZoneOffset.of("+03:25").totalSeconds).equal(12300);
		expect(ZoneOffset.of("-03:25").totalSeconds).equal(-12300);
		expect(ZoneOffset.of("+032545").totalSeconds).equal(12345);
		expect(ZoneOffset.of("-032545").totalSeconds).equal(-12345);
		expect(ZoneOffset.of("+03:25:45").totalSeconds).equal(12345);
		expect(ZoneOffset.of("-03:25:45").totalSeconds).equal(-12345);
	});

	it("should return null by null ID", () => {
		expect(ZoneOffset.of(null)).equal(null);
	});

	it("should throw error by invalid ID", () => {
		expect(() => ZoneOffset.of("abc")).throw("Invalid time zone offset.");
	});

	it("should convert itself to string", () => {
		expect(UTC.toString()).equal("Z");
		expect(p12345.toString()).equal("+03:25:45");
		expect(m12345.toString()).equal("-03:25:45");
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
		expect(ZoneId.of("")).equal(UTC);
		expect(ZoneId.of("+3")).equal(ZoneOffset.of("+3"));
		expect(ZoneId.of("+03")).equal(ZoneOffset.of("+03"));
		expect(ZoneId.of("-3")).equal(ZoneOffset.of("-3"));
		expect(ZoneId.of("-03")).equal(ZoneOffset.of("-03"));
		expect(ZoneId.of("+0300")).equal(ZoneOffset.of("+0300"));
		expect(ZoneId.of("-0300")).equal(ZoneOffset.of("-0300"));
		expect(ZoneId.of("+03:00")).equal(ZoneOffset.of("+03:00"));
		expect(ZoneId.of("-03:00")).equal(ZoneOffset.of("-03:00"));
		expect(ZoneId.of("+030000")).equal(ZoneOffset.of("+030000"));
		expect(ZoneId.of("-030000")).equal(ZoneOffset.of("-030000"));
		expect(ZoneId.of("+03:00:00")).equal(ZoneOffset.of("+03:00:00"));
		expect(ZoneId.of("-03:00:00")).equal(ZoneOffset.of("-03:00:00"));
		expect(ZoneId.of("+0325")).equal(ZoneOffset.of("+0325"));
		expect(ZoneId.of("-0325")).equal(ZoneOffset.of("-0325"));
		expect(ZoneId.of("+03:25")).equal(ZoneOffset.of("+03:25"));
		expect(ZoneId.of("-03:25")).equal(ZoneOffset.of("-03:25"));
		expect(ZoneId.of("+032545")).equal(ZoneOffset.of("+032545"));
		expect(ZoneId.of("-032545")).equal(ZoneOffset.of("-032545"));
		expect(ZoneId.of("+03:25:45")).equal(ZoneOffset.of("+03:25:45"));
		expect(ZoneId.of("-03:25:45")).equal(ZoneOffset.of("-03:25:45"));
	});

	it("should have normalized id if starts with UTC, UT or GMT", () => {
		expect(utcp3.id).equal("UTC+03:00");
		expect(utcm3.id).equal("UTC-03:00");
		expect(utp3.id).equal("UT+03:00");
		expect(utm3.id).equal("UT-03:00");
		expect(gmtp3.id).equal("GMT+03:00");
		expect(gmtm3.id).equal("GMT-03:00");
	});

	it("should have specified id if named", () => {
		expect(omsk.id).equal("Asia/Omsk");
		expect(berlin.id).equal("Europe/Berlin");
		expect(newYork.id).equal("America/New_York");
	});

	it("should return fixed offset by instant", () => {
		expect(utcp3.offsetAtInstant(winterInstant)).equal(ZoneOffset.of("+3"));
		expect(utcm3.offsetAtInstant(winterInstant)).equal(ZoneOffset.of("-3"));
		expect(utp3.offsetAtInstant(winterInstant)).equal(ZoneOffset.of("+3"));
		expect(utm3.offsetAtInstant(winterInstant)).equal(ZoneOffset.of("-3"));
		expect(gmtp3.offsetAtInstant(winterInstant)).equal(ZoneOffset.of("+3"));
		expect(gmtm3.offsetAtInstant(winterInstant)).equal(ZoneOffset.of("-3"));
	});

	it("should return winter offset by instant", () => {
		expect(omsk.offsetAtInstant(winterInstant)).equal(ZoneOffset.of("+6"));
		expect(berlin.offsetAtInstant(winterInstant)).equal(ZoneOffset.of("+1"));
		expect(newYork.offsetAtInstant(winterInstant)).equal(ZoneOffset.of("-5"));
	});

	it("should return summer offset by instant", () => {
		expect(omsk.offsetAtInstant(summerInstant)).equal(ZoneOffset.of("+6"));
		expect(berlin.offsetAtInstant(summerInstant)).equal(ZoneOffset.of("+2"));
		expect(newYork.offsetAtInstant(summerInstant)).equal(ZoneOffset.of("-4"));
	});

	it("should return edge offset by instant", () => {
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 31, 0, 59)))).equal(ZoneOffset.of("+1"));
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 31, 1, 0)))).equal(ZoneOffset.of("+2"));
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 31, 1, 1)))).equal(ZoneOffset.of("+2"));
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 9, 27, 0, 59)))).equal(ZoneOffset.of("+2"));
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 9, 27, 1, 0)))).equal(ZoneOffset.of("+1"));
		expect(berlin.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 9, 27, 1, 1)))).equal(ZoneOffset.of("+1"));

		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 10, 6, 59)))).equal(ZoneOffset.of("-5"));
		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 10, 7, 0)))).equal(ZoneOffset.of("-4"));
		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 2, 10, 7, 1)))).equal(ZoneOffset.of("-4"));
		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 10, 3, 5, 59)))).equal(ZoneOffset.of("-4"));
		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 10, 3, 6, 0)))).equal(ZoneOffset.of("-5"));
		expect(newYork.offsetAtInstant(Instant.ofEpochMs(Date.UTC(2019, 10, 3, 6, 1)))).equal(ZoneOffset.of("-5"));
	});

	it("should return fixed offset by local date/time", () => {
		expect(utcp3.offsetAtLocalDateTime(winterDateTime)).equal(ZoneOffset.of("+3"));
		expect(utcm3.offsetAtLocalDateTime(winterDateTime)).equal(ZoneOffset.of("-3"));
		expect(utp3.offsetAtLocalDateTime(winterDateTime)).equal(ZoneOffset.of("+3"));
		expect(utm3.offsetAtLocalDateTime(winterDateTime)).equal(ZoneOffset.of("-3"));
		expect(gmtp3.offsetAtLocalDateTime(winterDateTime)).equal(ZoneOffset.of("+3"));
		expect(gmtm3.offsetAtLocalDateTime(winterDateTime)).equal(ZoneOffset.of("-3"));
	});

	it("should return winter offset by local date/time", () => {
		expect(omsk.offsetAtLocalDateTime(winterDateTime)).equal(ZoneOffset.of("+6"));
		expect(berlin.offsetAtLocalDateTime(winterDateTime)).equal(ZoneOffset.of("+1"));
		expect(newYork.offsetAtLocalDateTime(winterDateTime)).equal(ZoneOffset.of("-5"));
	});

	it("should return summer offset by local date/time", () => {
		expect(omsk.offsetAtLocalDateTime(summerDateTime)).equal(ZoneOffset.of("+6"));
		expect(berlin.offsetAtLocalDateTime(summerDateTime)).equal(ZoneOffset.of("+2"));
		expect(newYork.offsetAtLocalDateTime(summerDateTime)).equal(ZoneOffset.of("-4"));
	});

	it("should prefer earlier offset by local date/time", () => {
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 31, 2, 0))).equal(ZoneOffset.of("+1"));
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 31, 2, 30))).equal(ZoneOffset.of("+1")); // gap
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 31, 3, 0))).equal(ZoneOffset.of("+2"));
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, OCTOBER, 27, 1, 59))).equal(ZoneOffset.of("+2"));
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, OCTOBER, 27, 2, 0))).equal(ZoneOffset.of("+2")); // overlap starts
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, OCTOBER, 27, 2, 59))).equal(ZoneOffset.of("+2")); // overlap goes
		expect(berlin.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, OCTOBER, 27, 3, 0))).equal(ZoneOffset.of("+1")); // overlap finishes

		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 10, 2, 0))).equal(ZoneOffset.of("-5"));
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 10, 2, 30))).equal(ZoneOffset.of("-5")); // gap
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, MARCH, 10, 3, 0))).equal(ZoneOffset.of("-4"));
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, NOVEMBER, 3, 0, 59))).equal(ZoneOffset.of("-4"));
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, NOVEMBER, 3, 1, 0))).equal(ZoneOffset.of("-4")); // overlap starts
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, NOVEMBER, 3, 1, 59))).equal(ZoneOffset.of("-4")); // overlap goes
		expect(newYork.offsetAtLocalDateTime(LocalDateTime.ofComponents(2019, NOVEMBER, 3, 2, 0))).equal(ZoneOffset.of("-5")); // overlap finishes
	});

	it("should return null by null ID", () => {
		expect(ZoneId.of(null)).equal(null);
	});

	it("should throw error by invalid ID", () => {
		expect(() => ZoneId.of("abc")).throw("Invalid time zone ID.");
	});

	it("should convert itself to a string", () => {
		expect(utcp3.toString()).equal("UTC+03:00");
		expect(utcm3.toString()).equal("UTC-03:00");
		expect(utp3.toString()).equal("UT+03:00");
		expect(utm3.toString()).equal("UT-03:00");
		expect(gmtp3.toString()).equal("GMT+03:00");
		expect(gmtm3.toString()).equal("GMT-03:00");

		expect(omsk.toString()).equal("Asia/Omsk");
		expect(berlin.toString()).equal("Europe/Berlin");
		expect(newYork.toString()).equal("America/New_York");
	});
});
