/*
MIT License

Copyright (c) 2023 Egor Nepomnyaschih

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
import Duration, {NULL_DURATION} from "ts-time/Duration";
import LocalDate from "ts-time/LocalDate";
import LocalTime from "ts-time/LocalTime";
import {JUNE} from "ts-time/Month";
import {DAY_PERIOD} from "ts-time/Period";
import {ZoneId} from "ts-time/Zone";
import ZonedDateTime from "ts-time/ZonedDateTime";

describe("Home page examples", () => {
	it("example 1", () => {
		const startDate = LocalDate.of(2022, JUNE);
		const formatter = DateFormatter.ofPattern("d - EE");
		const output = [];
		for (let date = startDate; date.month === startDate.month; date = date.plus(DAY_PERIOD)) {
			output.push(formatter.format(date));
		}

		expect(output).eql([
			"1 - Wednesday",
			"2 - Thursday",
			"3 - Friday",
			"4 - Saturday",
			"5 - Sunday",
			"6 - Monday",
			"7 - Tuesday",
			"8 - Wednesday",
			"9 - Thursday",
			"10 - Friday",
			"11 - Saturday",
			"12 - Sunday",
			"13 - Monday",
			"14 - Tuesday",
			"15 - Wednesday",
			"16 - Thursday",
			"17 - Friday",
			"18 - Saturday",
			"19 - Sunday",
			"20 - Monday",
			"21 - Tuesday",
			"22 - Wednesday",
			"23 - Thursday",
			"24 - Friday",
			"25 - Saturday",
			"26 - Sunday",
			"27 - Monday",
			"28 - Tuesday",
			"29 - Wednesday",
			"30 - Thursday"
		]);
	});

	it("example 2.a", () => {
		const startTime = LocalTime.of(9); // 9:00 AM
		const schedule: Duration[] = [
			Duration.ofMinutes(90), // First lesson
			Duration.ofMinutes(10), // Break
			Duration.ofMinutes(90), // Second lesson
			Duration.ofHours(1),    // Lunch time
			Duration.ofHours(2),    // Third lesson
		];
		const endTime = schedule.reduce((time, duration) => time.plus(duration), startTime);

		expect(endTime.toString()).equal("15:10:00.000");
	});

	it("example 2.b", () => {
		const startTime = LocalTime.of(9); // 9:00 AM
		const schedule: Duration[] = [
			Duration.ofMinutes(90), // First lesson
			Duration.ofMinutes(10), // Break
			Duration.ofMinutes(90), // Second lesson
			Duration.ofHours(1),    // Lunch time
			Duration.ofHours(2),    // Third lesson
		];
		const totalDuration = schedule.reduce((x, y) => x.plus(y), NULL_DURATION);
		const endTime = startTime.plus(totalDuration);

		expect(endTime.toString()).equal("15:10:00.000");
	});

	it("example 3.a", () => {
		const departureTime = ZonedDateTime.parse("2022-06-15T18:30:00.000+02:00[Europe/Berlin]");
		const arrivalTimeZone = ZoneId.of("Europe/London");
		const flightDuration = Duration.ofComponents(0, 1, 50); // 0 days 1 hour 50 minutes

		const arrivalTime = departureTime.instant.plus(flightDuration).atZone(arrivalTimeZone);

		expect(arrivalTime.toString()).equal("2022-06-15T19:20:00.000+01:00[Europe/London]");
	});

	it("example 3.b", () => {
		const departureTime = ZonedDateTime.parse("2022-06-15T18:30:00.000+02:00[Europe/Berlin]");
		const arrivalTimeZone = ZoneId.of("Europe/London");
		const flightDuration = Duration.ofComponents(0, 1, 50); // 0 days 1 hour 50 minutes

		const arrivalTime = departureTime.plusDuration(flightDuration).instant.atZone(arrivalTimeZone);

		expect(arrivalTime.toString()).equal("2022-06-15T19:20:00.000+01:00[Europe/London]");
	});
});
