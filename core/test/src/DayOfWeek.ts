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
import DayOfWeek, {FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY} from "ts-time/DayOfWeek";

describe("DayOfWeek", () => {
	it("should have 1-based value", () => {
		expect(MONDAY.value).equal(1);
		expect(TUESDAY.value).equal(2);
		expect(WEDNESDAY.value).equal(3);
		expect(THURSDAY.value).equal(4);
		expect(FRIDAY.value).equal(5);
		expect(SATURDAY.value).equal(6);
		expect(SUNDAY.value).equal(7);
	});

	it("should be returned by value", () => {
		expect(DayOfWeek.of(1)).equal(MONDAY);
		expect(DayOfWeek.of(2)).equal(TUESDAY);
		expect(DayOfWeek.of(3)).equal(WEDNESDAY);
		expect(DayOfWeek.of(4)).equal(THURSDAY);
		expect(DayOfWeek.of(5)).equal(FRIDAY);
		expect(DayOfWeek.of(6)).equal(SATURDAY);
		expect(DayOfWeek.of(7)).equal(SUNDAY);
	});

	it("should throw an error if value is out of range", () => {
		expect(() => DayOfWeek.of(0)).throw("Invalid day of week value.");
		expect(() => DayOfWeek.of(8)).throw("Invalid day of week value.");
	});

	it("should be returned by instance", () => {
		expect(DayOfWeek.of(MONDAY)).equal(MONDAY);
		expect(DayOfWeek.of(TUESDAY)).equal(TUESDAY);
		expect(DayOfWeek.of(WEDNESDAY)).equal(WEDNESDAY);
		expect(DayOfWeek.of(THURSDAY)).equal(THURSDAY);
		expect(DayOfWeek.of(FRIDAY)).equal(FRIDAY);
		expect(DayOfWeek.of(SATURDAY)).equal(SATURDAY);
		expect(DayOfWeek.of(SUNDAY)).equal(SUNDAY);
	});

	it("should return null by null", () => {
		expect(DayOfWeek.of(null)).equal(null);
	});

	it("should compare itself", () => {
		expect(MONDAY.compareTo(MONDAY)).equal(0);
		expect(MONDAY.compareTo(TUESDAY)).equal(-1);
		expect(MONDAY.compareTo(FRIDAY)).equal(-4);
		expect(MONDAY.compareTo(SUNDAY)).equal(-6);
		expect(WEDNESDAY.compareTo(MONDAY)).equal(2);
		expect(WEDNESDAY.compareTo(WEDNESDAY)).equal(0);
		expect(WEDNESDAY.compareTo(SATURDAY)).equal(-3);
		expect(SUNDAY.compareTo(MONDAY)).equal(6);
		expect(SUNDAY.compareTo(TUESDAY)).equal(5);
		expect(SUNDAY.compareTo(SATURDAY)).equal(1);
		expect(SUNDAY.compareTo(SUNDAY)).equal(0);
	});

	it("should compare itself statically", () => {
		expect(DayOfWeek.compare(MONDAY, MONDAY)).equal(0);
		expect(DayOfWeek.compare(MONDAY, TUESDAY)).equal(-1);
		expect(DayOfWeek.compare(MONDAY, FRIDAY)).equal(-4);
		expect(DayOfWeek.compare(MONDAY, SUNDAY)).equal(-6);
		expect(DayOfWeek.compare(WEDNESDAY, MONDAY)).equal(2);
		expect(DayOfWeek.compare(WEDNESDAY, WEDNESDAY)).equal(0);
		expect(DayOfWeek.compare(WEDNESDAY, SATURDAY)).equal(-3);
		expect(DayOfWeek.compare(SUNDAY, MONDAY)).equal(6);
		expect(DayOfWeek.compare(SUNDAY, TUESDAY)).equal(5);
		expect(DayOfWeek.compare(SUNDAY, SATURDAY)).equal(1);
		expect(DayOfWeek.compare(SUNDAY, SUNDAY)).equal(0);
	});

	it("should compare itself with null", () => {
		expect(WEDNESDAY.compareTo(null)).equal(1);
		expect(DayOfWeek.compare(WEDNESDAY, null)).equal(1);
		expect(DayOfWeek.compare(null, WEDNESDAY)).equal(-1);
		expect(DayOfWeek.compare(null, null)).equal(0);
	});

	it("should compare itself with isBefore method", () => {
		expect(WEDNESDAY.isBefore(MONDAY)).equal(false);
		expect(WEDNESDAY.isBefore(TUESDAY)).equal(false);
		expect(WEDNESDAY.isBefore(WEDNESDAY)).equal(false);
		expect(WEDNESDAY.isBefore(THURSDAY)).equal(true);
		expect(WEDNESDAY.isBefore(SUNDAY)).equal(true);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(DayOfWeek.isBefore(WEDNESDAY, MONDAY)).equal(false);
		expect(DayOfWeek.isBefore(WEDNESDAY, TUESDAY)).equal(false);
		expect(DayOfWeek.isBefore(WEDNESDAY, WEDNESDAY)).equal(false);
		expect(DayOfWeek.isBefore(WEDNESDAY, THURSDAY)).equal(true);
		expect(DayOfWeek.isBefore(WEDNESDAY, SUNDAY)).equal(true);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(WEDNESDAY.isBefore(null)).equal(false);
		expect(DayOfWeek.isBefore(WEDNESDAY, null)).equal(false);
		expect(DayOfWeek.isBefore(null, WEDNESDAY)).equal(true);
		expect(DayOfWeek.isBefore(null, null)).equal(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(WEDNESDAY.isAfter(MONDAY)).equal(true);
		expect(WEDNESDAY.isAfter(TUESDAY)).equal(true);
		expect(WEDNESDAY.isAfter(WEDNESDAY)).equal(false);
		expect(WEDNESDAY.isAfter(THURSDAY)).equal(false);
		expect(WEDNESDAY.isAfter(SUNDAY)).equal(false);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(DayOfWeek.isAfter(WEDNESDAY, MONDAY)).equal(true);
		expect(DayOfWeek.isAfter(WEDNESDAY, TUESDAY)).equal(true);
		expect(DayOfWeek.isAfter(WEDNESDAY, WEDNESDAY)).equal(false);
		expect(DayOfWeek.isAfter(WEDNESDAY, THURSDAY)).equal(false);
		expect(DayOfWeek.isAfter(WEDNESDAY, SUNDAY)).equal(false);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(WEDNESDAY.isAfter(null)).equal(true);
		expect(DayOfWeek.isAfter(WEDNESDAY, null)).equal(true);
		expect(DayOfWeek.isAfter(null, WEDNESDAY)).equal(false);
		expect(DayOfWeek.isAfter(null, null)).equal(false);
	});
});
