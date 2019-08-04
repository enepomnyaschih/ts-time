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

import {FRIDAY} from "../../dist/src/DayOfWeek";
import {AD} from "../../dist/src/Era";
import LocalDate from "../../dist/src/LocalDate";
import {JULY, SEPTEMBER} from "../../dist/src/Month";

describe("LocalDate", () => {
	it("should have proper fields", () => {
		const date = LocalDate.of(2019, JULY, 5);
		expect(date.year).toBe(2019);
		expect(date.month).toBe(JULY);
		expect(date.dayOfWeek).toBe(FRIDAY);
		expect(date.dayOfMonth).toBe(5);
		expect(date.dayOfYear).toBe(31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(date.dayOfWeekBasedYear).toBe(1 + 31 + 28 + 31 + 30 + 31 + 30 + 5);
		expect(date.era).toBe(AD);
		//expect(date.epochDay).toBe(365 * 49 + 11 + date.dayOfYear);
		expect(date.lengthOfYear).toBe(365);
		expect(date.nativeUtc).toEqual(new Date(Date.UTC(2019, 6, 5)));
		expect(date.nativeLocal).toEqual(new Date(2019, 6, 5));
		expect(date.quarterOfYear).toBe(3);
		expect(date.weekBasedYear).toBe(2019);
		expect(date.weekOfWeekBasedYear).toBe(27);
		expect(date.yearOfEra).toBe(2019);
	});

	it("should construct from epoch day", () => {
		const date = LocalDate.ofEpochDay(1000); // 365 + 365 + (31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 26)
		expect(date.year).toBe(1972);
		expect(date.month).toBe(SEPTEMBER);
		expect(date.dayOfMonth).toBe(26);
	});
});
