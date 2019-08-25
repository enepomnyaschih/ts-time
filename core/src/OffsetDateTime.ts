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

import {MS_PER_SECOND} from "./constants";
import DayOfWeek from "./DayOfWeek";
import Era from "./Era";
import Instant from "./Instant";
import LocalDate from "./LocalDate";
import LocalDateTime from "./LocalDateTime";
import LocalTime from "./LocalTime";
import Month from "./Month";
import {ZoneOffset} from "./Zone";

class OffsetDateTime {

	private _dateTime: LocalDateTime;

	private constructor(readonly instant: Instant, readonly offset: ZoneOffset) {
	}

	get dateTime() {
		return this._dateTime = this._dateTime || this._computeDateTime();
	}

	get date(): LocalDate {
		return this.dateTime.date;
	}

	get time(): LocalTime {
		return this.dateTime.time;
	}

	get native() {
		return this.instant.native;
	}

	get epochMs() {
		return this.instant.epochMs;
	}

	get era(): Era {
		return this.dateTime.era;
	}

	get year() {
		return this.dateTime.year;
	}

	get yearOfEra() {
		return this.dateTime.yearOfEra;
	}

	get weekBasedYear() {
		return this.dateTime.weekBasedYear;
	}

	get month(): Month {
		return this.dateTime.month;
	}

	get weekOfWeekBasedYear() {
		return this.dateTime.weekOfWeekBasedYear;
	}

	get dayOfYear() {
		return this.dateTime.dayOfYear;
	}

	get dayOfWeekBasedYear() {
		return this.dateTime.dayOfWeekBasedYear;
	}

	get dayOfMonth() {
		return this.dateTime.dayOfMonth;
	}

	get dayOfWeek(): DayOfWeek {
		return this.dateTime.dayOfWeek;
	}

	get epochDay() {
		return this.dateTime.epochDay;
	}

	get quarterOfYear() {
		return this.dateTime.quarterOfYear;
	}

	get lengthOfYear() {
		return this.dateTime.lengthOfYear;
	}

	get hour() {
		return this.dateTime.hour;
	}

	get minute() {
		return this.dateTime.minute;
	}

	get second() {
		return this.dateTime.second;
	}

	get ms() {
		return this.dateTime.ms;
	}

	compareTo(other: OffsetDateTime) {
		return OffsetDateTime.compare(this, other);
	}

	equals(other: OffsetDateTime) {
		return OffsetDateTime.equal(this, other);
	}

	isAfter(other: OffsetDateTime) {
		return OffsetDateTime.isAfter(this, other);
	}

	isBefore(other: OffsetDateTime) {
		return OffsetDateTime.isBefore(this, other);
	}

	private _computeDateTime() {
		return LocalDateTime.fromNativeUtc(
			new Date(this.instant.epochMs + this.offset.totalSeconds * MS_PER_SECOND));
	}

	static ofInstant(instant: Instant, offset: ZoneOffset) {
		return new OffsetDateTime(instant, offset);
	}

	static ofDateTime(localDateTime: LocalDateTime, offset: ZoneOffset) {
		const instant = Instant.ofEpochMs(localDateTime.epochMsUtc - offset.totalSeconds * MS_PER_SECOND);
		return new OffsetDateTime(instant, offset);
	}

	static compare(x: OffsetDateTime, y: OffsetDateTime) {
		return Instant.compare(x.instant, y.instant) || ZoneOffset.compare(x.offset, y.offset);
	}

	static equal(x: OffsetDateTime, y: OffsetDateTime) {
		return Instant.equal(x.instant, y.instant) && x.offset === y.offset;
	}

	static isAfter(x: OffsetDateTime, y: OffsetDateTime) {
		return OffsetDateTime.compare(x, y) > 0;
	}

	static isBefore(x: OffsetDateTime, y: OffsetDateTime) {
		return OffsetDateTime.compare(x, y) < 0;
	}
}

export default OffsetDateTime;
