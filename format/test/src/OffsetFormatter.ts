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
import OffsetFormatter, {OFFSET_COMPILERS} from "ts-time-format/OffsetFormatter";
import {UTC, ZoneOffset} from "ts-time/Zone";
import {buildPattern} from "./_utils";

describe("OffsetFormatter", () => {
	const formatter = OffsetFormatter.ofPattern(buildPattern(OFFSET_COMPILERS));

	it("should format UTC", () => {
		expect(formatter.format(UTC)).equal(
			"Z Z Z Z Z\n" +
			"+00 +0000 +00:00 +0000 +00:00"
		);
	});

	it("should format second-precise positive offset", () => {
		expect(formatter.format(ZoneOffset.ofComponents(5, 6, 7))).equal(
			"+0506 +0506 +05:06 +050607 +05:06:07\n" +
			"+0506 +0506 +05:06 +050607 +05:06:07"
		);
	});

	it("should format minute-precise positive offset", () => {
		expect(formatter.format(ZoneOffset.ofComponents(5, 6))).equal(
			"+0506 +0506 +05:06 +0506 +05:06\n" +
			"+0506 +0506 +05:06 +0506 +05:06"
		);
	});

	it("should format hour-precise positive offset", () => {
		expect(formatter.format(ZoneOffset.ofComponents(5))).equal(
			"+05 +0500 +05:00 +0500 +05:00\n" +
			"+05 +0500 +05:00 +0500 +05:00"
		);
	});

	it("should format second-precise negative offset", () => {
		expect(formatter.format(ZoneOffset.ofComponents(-5, -6, -7))).equal(
			"-0506 -0506 -05:06 -050607 -05:06:07\n" +
			"-0506 -0506 -05:06 -050607 -05:06:07"
		);
	});

	it("should format minute-precise negative offset", () => {
		expect(formatter.format(ZoneOffset.ofComponents(-5, -6))).equal(
			"-0506 -0506 -05:06 -0506 -05:06\n" +
			"-0506 -0506 -05:06 -0506 -05:06"
		);
	});

	it("should format hour-precise negative offset", () => {
		expect(formatter.format(ZoneOffset.ofComponents(-5))).equal(
			"-05 -0500 -05:00 -0500 -05:00\n" +
			"-05 -0500 -05:00 -0500 -05:00"
		);
	});
});
