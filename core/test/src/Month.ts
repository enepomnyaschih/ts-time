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
} from "ts-time/Month";

describe("Month", () => {
	it("should construct itself", () => {
		expect(Month.of(APRIL)).equal(APRIL);
		expect(Month.of(1)).equal(JANUARY);
		expect(Month.of(2)).equal(FEBRUARY);
		expect(Month.of(3)).equal(MARCH);
		expect(Month.of(4)).equal(APRIL);
		expect(Month.of(5)).equal(MAY);
		expect(Month.of(6)).equal(JUNE);
		expect(Month.of(7)).equal(JULY);
		expect(Month.of(8)).equal(AUGUST);
		expect(Month.of(9)).equal(SEPTEMBER);
		expect(Month.of(10)).equal(OCTOBER);
		expect(Month.of(11)).equal(NOVEMBER);
		expect(Month.of(12)).equal(DECEMBER);
	});

	it("should have 1-based value", () => {
		expect(JANUARY.value).equal(1);
		expect(FEBRUARY.value).equal(2);
		expect(MARCH.value).equal(3);
		expect(APRIL.value).equal(4);
		expect(MAY.value).equal(5);
		expect(JUNE.value).equal(6);
		expect(JULY.value).equal(7);
		expect(AUGUST.value).equal(8);
		expect(SEPTEMBER.value).equal(9);
		expect(OCTOBER.value).equal(10);
		expect(NOVEMBER.value).equal(11);
		expect(DECEMBER.value).equal(12);
	});

	it("should have non-leap length", () => {
		expect(JANUARY.length(false)).equal(31);
		expect(FEBRUARY.length(false)).equal(28);
		expect(MARCH.length(false)).equal(31);
		expect(APRIL.length(false)).equal(30);
		expect(MAY.length(false)).equal(31);
		expect(JUNE.length(false)).equal(30);
		expect(JULY.length(false)).equal(31);
		expect(AUGUST.length(false)).equal(31);
		expect(SEPTEMBER.length(false)).equal(30);
		expect(OCTOBER.length(false)).equal(31);
		expect(NOVEMBER.length(false)).equal(30);
		expect(DECEMBER.length(false)).equal(31);
	});

	it("should have leap length", () => {
		expect(JANUARY.length(true)).equal(31);
		expect(FEBRUARY.length(true)).equal(29);
		expect(MARCH.length(true)).equal(31);
		expect(APRIL.length(true)).equal(30);
		expect(MAY.length(true)).equal(31);
		expect(JUNE.length(true)).equal(30);
		expect(JULY.length(true)).equal(31);
		expect(AUGUST.length(true)).equal(31);
		expect(SEPTEMBER.length(true)).equal(30);
		expect(OCTOBER.length(true)).equal(31);
		expect(NOVEMBER.length(true)).equal(30);
		expect(DECEMBER.length(true)).equal(31);
	});

	it("should compare itself", () => {
		expect(JANUARY.compareTo(APRIL)).lessThan(0);
		expect(FEBRUARY.compareTo(APRIL)).lessThan(0);
		expect(MARCH.compareTo(APRIL)).lessThan(0);
		expect(APRIL.compareTo(APRIL)).equal(0);
		expect(MAY.compareTo(APRIL)).greaterThan(0);
		expect(JUNE.compareTo(APRIL)).greaterThan(0);
		expect(DECEMBER.compareTo(APRIL)).greaterThan(0);
	});

	it("should compare itself statically", () => {
		expect(Month.compare(JANUARY, APRIL)).lessThan(0);
		expect(Month.compare(FEBRUARY, APRIL)).lessThan(0);
		expect(Month.compare(MARCH, APRIL)).lessThan(0);
		expect(Month.compare(APRIL, APRIL)).equal(0);
		expect(Month.compare(MAY, APRIL)).greaterThan(0);
		expect(Month.compare(JUNE, APRIL)).greaterThan(0);
		expect(Month.compare(DECEMBER, APRIL)).greaterThan(0);
	});

	it("should compare itself with null", () => {
		expect(APRIL.compareTo(null)).greaterThan(0);
		expect(Month.compare(APRIL, null)).greaterThan(0);
		expect(Month.compare(null, APRIL)).lessThan(0);
		expect(Month.compare(null, null)).equal(0);
	});

	it("should compare itself with isBefore method", () => {
		expect(JANUARY.isBefore(APRIL)).equal(true);
		expect(APRIL.isBefore(APRIL)).equal(false);
		expect(JUNE.isBefore(APRIL)).equal(false);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(Month.isBefore(JANUARY, APRIL)).equal(true);
		expect(Month.isBefore(APRIL, APRIL)).equal(false);
		expect(Month.isBefore(JUNE, APRIL)).equal(false);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(APRIL.isBefore(null)).equal(false);
		expect(Month.isBefore(APRIL, null)).equal(false);
		expect(Month.isBefore(null, APRIL)).equal(true);
		expect(Month.isBefore(null, null)).equal(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(JANUARY.isAfter(APRIL)).equal(false);
		expect(APRIL.isAfter(APRIL)).equal(false);
		expect(JUNE.isAfter(APRIL)).equal(true);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(Month.isAfter(JANUARY, APRIL)).equal(false);
		expect(Month.isAfter(APRIL, APRIL)).equal(false);
		expect(Month.isAfter(JUNE, APRIL)).equal(true);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(APRIL.isAfter(null)).equal(true);
		expect(Month.isAfter(APRIL, null)).equal(true);
		expect(Month.isAfter(null, APRIL)).equal(false);
		expect(Month.isAfter(null, null)).equal(false);
	});
});
