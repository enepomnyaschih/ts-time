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

import {FRIDAY, MONDAY, SATURDAY, SUNDAY} from "../../dist/src/DayOfWeek";
import {AD} from "../../dist/src/Era";
import LocalDate, {EPOCH_DATE} from "../../dist/src/LocalDate";
import {DECEMBER, JANUARY, JULY, SEPTEMBER} from "../../dist/src/Month";

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
		expect(date.epochDay).toBe(365 * 49 + 12 + date.dayOfYear);
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
		expect(date.epochDay).toBe(1000);
	});

	it("should provide epoch date", () => {
		expect(EPOCH_DATE.year).toBe(1970);
		expect(EPOCH_DATE.month).toBe(JANUARY);
		expect(EPOCH_DATE.dayOfYear).toBe(1);
	});

	it("should have matching epoch constructor and field", () => {
		expect(LocalDate.ofEpochDay(1).epochDay).toBe(1);
		expect(LocalDate.ofEpochDay(0).epochDay).toBe(0);
		expect(LocalDate.ofEpochDay(-1).epochDay).toBe(-1);
		expect(LocalDate.ofEpochDay(1000).epochDay).toBe(1000);
		expect(LocalDate.ofEpochDay(-1000).epochDay).toBe(-1000);
		expect(LocalDate.ofEpochDay(100000).epochDay).toBe(100000);
	});

	it("should properly detect week based fields", () => {
		const date1 = LocalDate.of(2018, JANUARY, 1);
		expect(date1.dayOfWeek).toBe(MONDAY);
		expect(date1.weekBasedYear).toBe(2018);
		expect(date1.weekOfWeekBasedYear).toBe(1);
		expect(date1.dayOfWeekBasedYear).toBe(1);

		const date2 = LocalDate.of(2017, DECEMBER, 31);
		expect(date2.dayOfWeek).toBe(SUNDAY);
		expect(date2.weekBasedYear).toBe(2017);
		expect(date2.weekOfWeekBasedYear).toBe(52);
		expect(date2.dayOfWeekBasedYear).toBe(364);

		const date3 = LocalDate.of(2017, JANUARY, 2);
		expect(date3.dayOfWeek).toBe(MONDAY);
		expect(date3.weekBasedYear).toBe(2017);
		expect(date3.weekOfWeekBasedYear).toBe(1);
		expect(date3.dayOfWeekBasedYear).toBe(1);

		const date4 = LocalDate.of(2017, JANUARY, 1);
		expect(date4.dayOfWeek).toBe(SUNDAY);
		expect(date4.weekBasedYear).toBe(2016);
		expect(date4.weekOfWeekBasedYear).toBe(52);
		expect(date4.dayOfWeekBasedYear).toBe(364);

		const date5 = LocalDate.of(2016, DECEMBER, 31);
		expect(date5.dayOfWeek).toBe(SATURDAY);
		expect(date5.weekBasedYear).toBe(2016);
		expect(date5.weekOfWeekBasedYear).toBe(52);
		expect(date5.dayOfWeekBasedYear).toBe(363);

		const date6 = LocalDate.of(2016, JANUARY, 4);
		expect(date6.dayOfWeek).toBe(MONDAY);
		expect(date6.weekBasedYear).toBe(2016);
		expect(date6.weekOfWeekBasedYear).toBe(1);
		expect(date6.dayOfWeekBasedYear).toBe(1);

		const date7 = LocalDate.of(2016, JANUARY, 3);
		expect(date7.dayOfWeek).toBe(SUNDAY);
		expect(date7.weekBasedYear).toBe(2015);
		expect(date7.weekOfWeekBasedYear).toBe(53);
		expect(date7.dayOfWeekBasedYear).toBe(371);
	});
});
