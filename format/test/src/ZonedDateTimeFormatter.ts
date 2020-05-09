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
import ZonedDateTimeFormatter, {ZONED_DATE_TIME_COMPILERS} from "ts-time-format/ZonedDateTimeFormatter";
import LocalDateTime from "ts-time/LocalDateTime";
import {DECEMBER} from "ts-time/Month";
import {isTimeZoneSupport} from "ts-time/utils";
import {ZoneId} from "ts-time/Zone";
import ZonedDateTime from "ts-time/ZonedDateTime";
import {buildPattern} from "./_utils";

describe("ZonedDateTimeFormatter", () => {
	const formatter = ZonedDateTimeFormatter.ofPattern(buildPattern(ZONED_DATE_TIME_COMPILERS));

	it("should format date/time", () => {
		expect(formatter.format(ZonedDateTime.ofDateTime(
			LocalDateTime.ofComponents(2008, DECEMBER, 30, 22, 30, 15, 225), ZoneId.of("Europe/Berlin")))).equal(
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
			"2 02 Tue Tuesday T\n" +
			"22 22\n" +
			"10 10\n" +
			"30 30\n" +
			"15 15\n" +
			"2 22 225\n" +
			"10 10\n" +
			"22 22\n" +
			"PM\n" +
			(isTimeZoneSupport() ? "+01 +0100 +01:00 +0100 +01:00\n" : "Z Z Z Z Z\n")  +
			(isTimeZoneSupport() ? "+01 +0100 +01:00 +0100 +01:00\n" : "+00 +0000 +00:00 +0000 +00:00\n") +
			"Europe/Berlin"
		);
	});
});
