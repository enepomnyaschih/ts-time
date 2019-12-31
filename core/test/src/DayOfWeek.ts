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

import DayOfWeek, {FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY} from "../../main/src/DayOfWeek";

describe("DayOfWeek", () => {
	it("should have 1-based value", () => {
		expect(MONDAY.value).toBe(1);
		expect(TUESDAY.value).toBe(2);
		expect(WEDNESDAY.value).toBe(3);
		expect(THURSDAY.value).toBe(4);
		expect(FRIDAY.value).toBe(5);
		expect(SATURDAY.value).toBe(6);
		expect(SUNDAY.value).toBe(7);
	});

	it("should be returned by value", () => {
		expect(DayOfWeek.of(1)).toBe(MONDAY);
		expect(DayOfWeek.of(2)).toBe(TUESDAY);
		expect(DayOfWeek.of(3)).toBe(WEDNESDAY);
		expect(DayOfWeek.of(4)).toBe(THURSDAY);
		expect(DayOfWeek.of(5)).toBe(FRIDAY);
		expect(DayOfWeek.of(6)).toBe(SATURDAY);
		expect(DayOfWeek.of(7)).toBe(SUNDAY);
	});

	it("should throw an error if value is out of range", () => {
		expect(() => DayOfWeek.of(0)).toThrow(new Error("Invalid day of week value."));
		expect(() => DayOfWeek.of(8)).toThrow(new Error("Invalid day of week value."));
	});

	it("should be returned by instance", () => {
		expect(DayOfWeek.of(MONDAY)).toBe(MONDAY);
		expect(DayOfWeek.of(TUESDAY)).toBe(TUESDAY);
		expect(DayOfWeek.of(WEDNESDAY)).toBe(WEDNESDAY);
		expect(DayOfWeek.of(THURSDAY)).toBe(THURSDAY);
		expect(DayOfWeek.of(FRIDAY)).toBe(FRIDAY);
		expect(DayOfWeek.of(SATURDAY)).toBe(SATURDAY);
		expect(DayOfWeek.of(SUNDAY)).toBe(SUNDAY);
	});

	it("should return null by null", () => {
		expect(DayOfWeek.of(null)).toBeNull();
	});

	it("should compare itself", () => {
		expect(MONDAY.compareTo(MONDAY)).toBe(0);
		expect(MONDAY.compareTo(TUESDAY)).toBe(-1);
		expect(MONDAY.compareTo(FRIDAY)).toBe(-4);
		expect(MONDAY.compareTo(SUNDAY)).toBe(-6);
		expect(WEDNESDAY.compareTo(MONDAY)).toBe(2);
		expect(WEDNESDAY.compareTo(WEDNESDAY)).toBe(0);
		expect(WEDNESDAY.compareTo(SATURDAY)).toBe(-3);
		expect(SUNDAY.compareTo(MONDAY)).toBe(6);
		expect(SUNDAY.compareTo(TUESDAY)).toBe(5);
		expect(SUNDAY.compareTo(SATURDAY)).toBe(1);
		expect(SUNDAY.compareTo(SUNDAY)).toBe(0);
	});

	it("should compare itself statically", () => {
		expect(DayOfWeek.compare(MONDAY, MONDAY)).toBe(0);
		expect(DayOfWeek.compare(MONDAY, TUESDAY)).toBe(-1);
		expect(DayOfWeek.compare(MONDAY, FRIDAY)).toBe(-4);
		expect(DayOfWeek.compare(MONDAY, SUNDAY)).toBe(-6);
		expect(DayOfWeek.compare(WEDNESDAY, MONDAY)).toBe(2);
		expect(DayOfWeek.compare(WEDNESDAY, WEDNESDAY)).toBe(0);
		expect(DayOfWeek.compare(WEDNESDAY, SATURDAY)).toBe(-3);
		expect(DayOfWeek.compare(SUNDAY, MONDAY)).toBe(6);
		expect(DayOfWeek.compare(SUNDAY, TUESDAY)).toBe(5);
		expect(DayOfWeek.compare(SUNDAY, SATURDAY)).toBe(1);
		expect(DayOfWeek.compare(SUNDAY, SUNDAY)).toBe(0);
	});

	it("should compare itself with null", () => {
		expect(WEDNESDAY.compareTo(null)).toBe(1);
		expect(DayOfWeek.compare(WEDNESDAY, null)).toBe(1);
		expect(DayOfWeek.compare(null, WEDNESDAY)).toBe(-1);
		expect(DayOfWeek.compare(null, null)).toBe(0);
	});

	it("should compare itself with isBefore method", () => {
		expect(WEDNESDAY.isBefore(MONDAY)).toBe(false);
		expect(WEDNESDAY.isBefore(TUESDAY)).toBe(false);
		expect(WEDNESDAY.isBefore(WEDNESDAY)).toBe(false);
		expect(WEDNESDAY.isBefore(THURSDAY)).toBe(true);
		expect(WEDNESDAY.isBefore(SUNDAY)).toBe(true);
	});

	it("should compare itself with isBefore method statically", () => {
		expect(DayOfWeek.isBefore(WEDNESDAY, MONDAY)).toBe(false);
		expect(DayOfWeek.isBefore(WEDNESDAY, TUESDAY)).toBe(false);
		expect(DayOfWeek.isBefore(WEDNESDAY, WEDNESDAY)).toBe(false);
		expect(DayOfWeek.isBefore(WEDNESDAY, THURSDAY)).toBe(true);
		expect(DayOfWeek.isBefore(WEDNESDAY, SUNDAY)).toBe(true);
	});

	it("should compare itself with null with isBefore method", () => {
		expect(WEDNESDAY.isBefore(null)).toBe(false);
		expect(DayOfWeek.isBefore(WEDNESDAY, null)).toBe(false);
		expect(DayOfWeek.isBefore(null, WEDNESDAY)).toBe(true);
		expect(DayOfWeek.isBefore(null, null)).toBe(false);
	});

	it("should compare itself with isAfter method", () => {
		expect(WEDNESDAY.isAfter(MONDAY)).toBe(true);
		expect(WEDNESDAY.isAfter(TUESDAY)).toBe(true);
		expect(WEDNESDAY.isAfter(WEDNESDAY)).toBe(false);
		expect(WEDNESDAY.isAfter(THURSDAY)).toBe(false);
		expect(WEDNESDAY.isAfter(SUNDAY)).toBe(false);
	});

	it("should compare itself with isAfter method statically", () => {
		expect(DayOfWeek.isAfter(WEDNESDAY, MONDAY)).toBe(true);
		expect(DayOfWeek.isAfter(WEDNESDAY, TUESDAY)).toBe(true);
		expect(DayOfWeek.isAfter(WEDNESDAY, WEDNESDAY)).toBe(false);
		expect(DayOfWeek.isAfter(WEDNESDAY, THURSDAY)).toBe(false);
		expect(DayOfWeek.isAfter(WEDNESDAY, SUNDAY)).toBe(false);
	});

	it("should compare itself with null with isAfter method", () => {
		expect(WEDNESDAY.isAfter(null)).toBe(true);
		expect(DayOfWeek.isAfter(WEDNESDAY, null)).toBe(true);
		expect(DayOfWeek.isAfter(null, WEDNESDAY)).toBe(false);
		expect(DayOfWeek.isAfter(null, null)).toBe(false);
	});
});
