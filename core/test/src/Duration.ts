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
import Duration from "ts-time/Duration";

describe("Duration", () => {
	it("should support various constructors", () => {
		const d = Duration.of(12345);
		expect(d.ms).equal(12345);
		expect(Duration.of(d)).equal(d);

		expect(Duration.ofMs(12345).ms).equal(12345);
		expect(Duration.ofSeconds(12).ms).equal(12000);
		expect(Duration.ofMinutes(12).ms).equal(720000);
		expect(Duration.ofHours(12).ms).equal(43200000);
		expect(Duration.ofDays(12).ms).equal(1036800000);
		expect(Duration.ofWeeks(12).ms).equal(7257600000);
		expect(Duration.ofComponents(1, 2, 3, 4, 5).ms).equal(93784005);
	});

	it("should return null by null", () => {
		expect(Duration.of(null)).equal(null);
	});

	it("should multiply itself", () => {
		expect(Duration.ofSeconds(12).multiply(5).ms).equal(60000);
	});

	it("should add milliseconds", () => {
		expect(Duration.of(123).plus(456).ms).equal(579);
		expect(Duration.of(456).plus(-123).ms).equal(333);
	});

	it("should add duration", () => {
		expect(Duration.of(123).plus(Duration.of(456)).ms).equal(579);
		expect(Duration.of(456).plus(Duration.of(-123)).ms).equal(333);
	});

	it("should subtract milliseconds", () => {
		expect(Duration.of(456).minus(123).ms).equal(333);
		expect(Duration.of(456).minus(-123).ms).equal(579);
	});

	it("should subtract duration", () => {
		expect(Duration.of(456).minus(Duration.of(123)).ms).equal(333);
		expect(Duration.of(456).minus(Duration.of(-123)).ms).equal(579);
	});
});
