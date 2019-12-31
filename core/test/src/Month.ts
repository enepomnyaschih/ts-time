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

import Month, {
	APRIL,
	AUGUST,
	DECEMBER,
	FEBRUARY,
	JANUARY,
	JULY,
	JUNE,
	MARCH,
	MAY,
	NOVEMBER,
	OCTOBER,
	SEPTEMBER
} from "../../main/src/Month";

describe("Month", () => {
	it("should construct itself", () => {
		expect(Month.of(APRIL)).toBe(APRIL);
		expect(Month.of(1)).toBe(JANUARY);
		expect(Month.of(2)).toBe(FEBRUARY);
		expect(Month.of(3)).toBe(MARCH);
		expect(Month.of(4)).toBe(APRIL);
		expect(Month.of(5)).toBe(MAY);
		expect(Month.of(6)).toBe(JUNE);
		expect(Month.of(7)).toBe(JULY);
		expect(Month.of(8)).toBe(AUGUST);
		expect(Month.of(9)).toBe(SEPTEMBER);
		expect(Month.of(10)).toBe(OCTOBER);
		expect(Month.of(11)).toBe(NOVEMBER);
		expect(Month.of(12)).toBe(DECEMBER);
	});

	it("should have 1-based value", () => {
		expect(JANUARY.value).toBe(1);
		expect(FEBRUARY.value).toBe(2);
		expect(MARCH.value).toBe(3);
		expect(APRIL.value).toBe(4);
		expect(MAY.value).toBe(5);
		expect(JUNE.value).toBe(6);
		expect(JULY.value).toBe(7);
		expect(AUGUST.value).toBe(8);
		expect(SEPTEMBER.value).toBe(9);
		expect(OCTOBER.value).toBe(10);
		expect(NOVEMBER.value).toBe(11);
		expect(DECEMBER.value).toBe(12);
	});

	it("should have non-leap length", () => {
		expect(JANUARY.length(false)).toBe(31);
		expect(FEBRUARY.length(false)).toBe(28);
		expect(MARCH.length(false)).toBe(31);
		expect(APRIL.length(false)).toBe(30);
		expect(MAY.length(false)).toBe(31);
		expect(JUNE.length(false)).toBe(30);
		expect(JULY.length(false)).toBe(31);
		expect(AUGUST.length(false)).toBe(31);
		expect(SEPTEMBER.length(false)).toBe(30);
		expect(OCTOBER.length(false)).toBe(31);
		expect(NOVEMBER.length(false)).toBe(30);
		expect(DECEMBER.length(false)).toBe(31);
	});

	it("should have leap length", () => {
		expect(JANUARY.length(true)).toBe(31);
		expect(FEBRUARY.length(true)).toBe(29);
		expect(MARCH.length(true)).toBe(31);
		expect(APRIL.length(true)).toBe(30);
		expect(MAY.length(true)).toBe(31);
		expect(JUNE.length(true)).toBe(30);
		expect(JULY.length(true)).toBe(31);
		expect(AUGUST.length(true)).toBe(31);
		expect(SEPTEMBER.length(true)).toBe(30);
		expect(OCTOBER.length(true)).toBe(31);
		expect(NOVEMBER.length(true)).toBe(30);
		expect(DECEMBER.length(true)).toBe(31);
	});

	it("should compare itself", () => {
		expect(JANUARY.compareTo(APRIL)).toBeLessThan(0);
		expect(FEBRUARY.compareTo(APRIL)).toBeLessThan(0);
		expect(MARCH.compareTo(APRIL)).toBeLessThan(0);
		expect(APRIL.compareTo(APRIL)).toBe(0);
		expect(MAY.compareTo(APRIL)).toBeGreaterThan(0);
		expect(JUNE.compareTo(APRIL)).toBeGreaterThan(0);
		expect(DECEMBER.compareTo(APRIL)).toBeGreaterThan(0);
	});

	it("should compare itself statically", () => {
		expect(Month.compare(JANUARY, APRIL)).toBeLessThan(0);
		expect(Month.compare(FEBRUARY, APRIL)).toBeLessThan(0);
		expect(Month.compare(MARCH, APRIL)).toBeLessThan(0);
		expect(Month.compare(APRIL, APRIL)).toBe(0);
		expect(Month.compare(MAY, APRIL)).toBeGreaterThan(0);
		expect(Month.compare(JUNE, APRIL)).toBeGreaterThan(0);
		expect(Month.compare(DECEMBER, APRIL)).toBeGreaterThan(0);
	});

	it("should compare itself with null", () => {
		expect(APRIL.compareTo(null)).toBeGreaterThan(0);
		expect(Month.compare(APRIL, null)).toBeGreaterThan(0);
		expect(Month.compare(null, APRIL)).toBeLessThan(0);
		expect(Month.compare(null, null)).toBe(0);
	});

	it("should compare itself with isBefore method", () => {
		expect(JANUARY.isBefore(APRIL)).toBe(true);
		expect(APRIL.isBefore(APRIL)).toBe(false);
		expect(JUNE.isBefore(APRIL)).toBe(false);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(Month.isBefore(JANUARY, APRIL)).toBe(true);
		expect(Month.isBefore(APRIL, APRIL)).toBe(false);
		expect(Month.isBefore(JUNE, APRIL)).toBe(false);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(APRIL.isBefore(null)).toBe(false);
		expect(Month.isBefore(APRIL, null)).toBe(false);
		expect(Month.isBefore(null, APRIL)).toBe(true);
		expect(Month.isBefore(null, null)).toBe(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(JANUARY.isAfter(APRIL)).toBe(false);
		expect(APRIL.isAfter(APRIL)).toBe(false);
		expect(JUNE.isAfter(APRIL)).toBe(true);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(Month.isAfter(JANUARY, APRIL)).toBe(false);
		expect(Month.isAfter(APRIL, APRIL)).toBe(false);
		expect(Month.isAfter(JUNE, APRIL)).toBe(true);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(APRIL.isAfter(null)).toBe(true);
		expect(Month.isAfter(APRIL, null)).toBe(true);
		expect(Month.isAfter(null, APRIL)).toBe(false);
		expect(Month.isAfter(null, null)).toBe(false);
	});
});
