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
import TimeFormatter, {TIME_COMPILERS} from "ts-time-format/TimeFormatter";
import LocalTime, {MAX_TIME, MIDNIGHT, NOON} from "ts-time/LocalTime";
import {buildPattern} from "./_utils";

describe("TimeFormatter", () => {
	const formatter = TimeFormatter.ofPattern(buildPattern(TIME_COMPILERS));

	it("should format long time", () => {
		expect(formatter.format(LocalTime.of(22, 30, 15, 225))).equal(
			"22 22\n" +
			"10 10\n" +
			"30 30\n" +
			"15 15\n" +
			"2 22 225\n" +
			"10 10\n" +
			"22 22\n" +
			"PM"
		);
	});

	it("should format short time", () => {
		expect(formatter.format(LocalTime.of(5, 3, 5, 2))).equal(
			"5 05\n" +
			"5 05\n" +
			"3 03\n" +
			"5 05\n" +
			"0 00 002\n" +
			"5 05\n" +
			"5 05\n" +
			"AM"
		);
	});

	it("should format 1 ms before midnight", () => {
		expect(formatter.format(MAX_TIME)).equal(
			"23 23\n" +
			"11 11\n" +
			"59 59\n" +
			"59 59\n" +
			"9 99 999\n" +
			"11 11\n" +
			"23 23\n" +
			"PM"
		);
	});

	it("should format midnight", () => {
		expect(formatter.format(MIDNIGHT)).equal(
			"0 00\n" +
			"0 00\n" +
			"0 00\n" +
			"0 00\n" +
			"0 00 000\n" +
			"12 12\n" +
			"24 24\n" +
			"AM"
		);
	});

	it("should format 1 ms before 1 AM", () => {
		expect(formatter.format(LocalTime.of(0, 59, 59, 999))).equal(
			"0 00\n" +
			"0 00\n" +
			"59 59\n" +
			"59 59\n" +
			"9 99 999\n" +
			"12 12\n" +
			"24 24\n" +
			"AM"
		);
	});

	it("should format 1 AM", () => {
		expect(formatter.format(LocalTime.of(1))).equal(
			"1 01\n" +
			"1 01\n" +
			"0 00\n" +
			"0 00\n" +
			"0 00 000\n" +
			"1 01\n" +
			"1 01\n" +
			"AM"
		);
	});

	it("should format 1 ms before noon", () => {
		expect(formatter.format(LocalTime.of(11, 59, 59, 999))).equal(
			"11 11\n" +
			"11 11\n" +
			"59 59\n" +
			"59 59\n" +
			"9 99 999\n" +
			"11 11\n" +
			"11 11\n" +
			"AM"
		);
	});

	it("should format noon", () => {
		expect(formatter.format(NOON)).equal(
			"12 12\n" +
			"0 00\n" +
			"0 00\n" +
			"0 00\n" +
			"0 00 000\n" +
			"12 12\n" +
			"12 12\n" +
			"PM"
		);
	});

	it("should format 1 ms before 1 PM", () => {
		expect(formatter.format(LocalTime.of(12, 59, 59, 999))).equal(
			"12 12\n" +
			"0 00\n" +
			"59 59\n" +
			"59 59\n" +
			"9 99 999\n" +
			"12 12\n" +
			"12 12\n" +
			"PM"
		);
	});

	it("should format 1 PM", () => {
		expect(formatter.format(LocalTime.of(13))).equal(
			"13 13\n" +
			"1 01\n" +
			"0 00\n" +
			"0 00\n" +
			"0 00 000\n" +
			"1 01\n" +
			"13 13\n" +
			"PM"
		);
	});
});
