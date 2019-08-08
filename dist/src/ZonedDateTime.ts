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
import {ZoneId, ZoneOffset} from "./Zone";

class ZonedDateTime {

	private _dateTime: LocalDateTime;
	private _offset: ZoneOffset;

	private constructor(readonly instant: Instant, readonly zone: ZoneId) {
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

	get offset() {
		return this._offset = this._offset || this.zone.offsetAtInstant(this.instant);
	}

	compareTo(other: ZonedDateTime) {
		return ZonedDateTime.compare(this, other);
	}

	equals(other: ZonedDateTime) {
		return ZonedDateTime.equal(this, other);
	}

	private _computeDateTime() {
		return LocalDateTime.fromNativeUtc(
			new Date(this.instant.native.getTime() - this.offset.totalSeconds * MS_PER_SECOND));
	}

	static ofInstant(instant: Instant, zone: ZoneId) {
		return new ZonedDateTime(instant, zone);
	}

	static ofDateTime(localDateTime: LocalDateTime, zone: ZoneId) {
		const instant = Instant.ofEpochMs(
			localDateTime.epochMs + zone.offsetAtLocalDateTime(localDateTime).totalSeconds);
		return new ZonedDateTime(instant, zone);
	}

	static compare(x: ZonedDateTime, y: ZonedDateTime) {
		return Instant.compare(x.instant, y.instant) || ZoneId.compareById(x.zone, y.zone);
	}

	static equal(x: ZonedDateTime, y: ZonedDateTime) {
		return Instant.equal(x.instant, y.instant) && ZoneId.equal(x.zone, y.zone);
	}
}

export default ZonedDateTime;
