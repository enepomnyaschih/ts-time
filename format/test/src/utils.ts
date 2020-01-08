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
import DateFormatter from "ts-time-format/DateFormatter";
import LocalDate from "ts-time/LocalDate";
import {DECEMBER} from "ts-time/Month";

describe("parsePattern", () => {
	it("should parse pattern", () => {
		const date = LocalDate.of(2011, DECEMBER, 3),
			formatter = DateFormatter.ofPattern("d MMM uuuu");
		expect(formatter.format(date)).equal("3 Dec 2011");
	});

	it("should escape characters", () => {
		const date = LocalDate.of(2011, DECEMBER, 3),
			formatter = DateFormatter.ofPattern("'Mud'dr''");
		expect(formatter.format(date)).equal("Mud3r'");
	});
});
