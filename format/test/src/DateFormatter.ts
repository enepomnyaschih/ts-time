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
import DateFormatter, {DATE_COMPILERS} from "ts-time-format/DateFormatter";
import LocalDate from "ts-time/LocalDate";
import {DECEMBER, FEBRUARY, JANUARY} from "ts-time/Month";
import {buildPattern} from "./_utils";

describe("DateFormatter", () => {
	const formatter = DateFormatter.ofPattern(buildPattern(DATE_COMPILERS));

	it("should format long date", () => {
		expect(formatter.format(LocalDate.of(2008, DECEMBER, 30))).equal(
			"AD Anno Domini A\n" +
			"2008 08 2008 2008\n" +
			"2008 08 2008 2008\n" +
			"365 365 365\n" +
			"12 12 Dec December D\n" +
			"12 12 Dec December D\n" +
			"30 30\n" +
			"4 04 Q4 4th quarter\n" +
			"4 04 Q4 4th quarter\n" +
			"2009 09 2009 2009\n" +
			"1 01\n" +
			"Tue Tuesday T\n" +
			"2 02 Tue Tuesday T\n" +
			"2 02 Tue Tuesday T"
		);
	});

	it("should format short date", () => {
		expect(formatter.format(LocalDate.of(9, JANUARY, 5))).equal(
			"AD Anno Domini A\n" +
			"9 09 9 9\n" +
			"9 09 9 9\n" +
			"5 05 005\n" +
			"1 01 Jan January J\n" +
			"1 01 Jan January J\n" +
			"5 05\n" +
			"1 01 Q1 1st quarter\n" +
			"1 01 Q1 1st quarter\n" +
			"9 09 9 9\n" +
			"2 02\n" +
			"Mon Monday M\n" +
			"1 01 Mon Monday M\n" +
			"1 01 Mon Monday M"
		);
	});

	it("should format negative date", () => {
		expect(formatter.format(LocalDate.of(-305, FEBRUARY, 10))).equal(
			"BC Before Christ B\n" +
			"-305 -05 -305 -305\n" +
			"305 05 305 305\n" +
			"41 41 041\n" +
			"2 02 Feb February F\n" +
			"2 02 Feb February F\n" +
			"10 10\n" +
			"1 01 Q1 1st quarter\n" +
			"1 01 Q1 1st quarter\n" +
			"-305 -05 -305 -305\n" +
			"6 06\n" +
			"Thu Thursday T\n" +
			"4 04 Thu Thursday T\n" +
			"4 04 Thu Thursday T"
		);
	});
});
