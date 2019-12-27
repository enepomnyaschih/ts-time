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

import {compare} from "./_internal";
import {MS_PER_SECOND} from "./constants";
import DayOfWeek from "./DayOfWeek";
import Duration from "./Duration";
import Era from "./Era";
import Instant from "./Instant";
import LocalDate from "./LocalDate";
import LocalDateTime from "./LocalDateTime";
import LocalTime from "./LocalTime";
import Month from "./Month";
import Period from "./Period";
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

	get isLeapYear() {
		return this.dateTime.isLeapYear;
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

	plusDuration(duration: Duration) {
		return duration.ms !== 0 ? new OffsetDateTime(this.instant.plus(duration), this.offset) : this;
	}

	plusPeriod(period: Period) {
		return period.empty ? this : OffsetDateTime.ofDateTime(this.dateTime.plusPeriod(period), this.offset);
	}

	minusDuration(duration: Duration) {
		return duration.ms !== 0 ? new OffsetDateTime(this.instant.minus(duration), this.offset) : this;
	}

	minusPeriod(period: Period) {
		return period.empty ? this : OffsetDateTime.ofDateTime(this.dateTime.minusPeriod(period), this.offset);
	}

	withYear(year: number) {
		return OffsetDateTime.ofDateTime(this.dateTime.withYear(year), this.offset);
	}

	withMonth(month: number | Month) {
		return OffsetDateTime.ofDateTime(this.dateTime.withMonth(month), this.offset);
	}

	withDayOfMonth(dayOfMonth: number) {
		return OffsetDateTime.ofDateTime(this.dateTime.withDayOfMonth(dayOfMonth), this.offset);
	}

	withDayOfWeek(dayOfWeek: number | DayOfWeek) {
		return OffsetDateTime.ofDateTime(this.dateTime.withDayOfWeek(dayOfWeek), this.offset);
	}

	withDayOfYear(dayOfYear: number) {
		return OffsetDateTime.ofDateTime(this.dateTime.withDayOfYear(dayOfYear), this.offset);
	}

	withHour(hour: number) {
		return OffsetDateTime.ofDateTime(this.dateTime.withHour(hour), this.offset);
	}

	withMinute(minute: number) {
		return OffsetDateTime.ofDateTime(this.dateTime.withMinute(minute), this.offset);
	}

	withSecond(second: number) {
		return OffsetDateTime.ofDateTime(this.dateTime.withSecond(second), this.offset);
	}

	withMs(ms: number) {
		return OffsetDateTime.ofDateTime(this.dateTime.withMs(ms), this.offset);
	}

	toString() {
		return `${this.dateTime.toString()}${this.offset.toString()}`;
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

	static parse(str: string) {
		const t = str.indexOf("T");
		if (t === -1) {
			throw new Error("Invalid date format.")
		}
		const matches = /[Z+\-]/i.exec(str.substr(t));
		if (!matches) {
			throw new Error("Invalid date format.")
		}
		return OffsetDateTime.ofDateTime(
			LocalDateTime.parse(str.substr(0, t + matches.index)),
			ZoneOffset.of(str.substr(t + matches.index)));
	}

	static compare(x: OffsetDateTime, y: OffsetDateTime) {
		if (x == null && y == null) {
			return 0;
		}
		return compare(x != null, y != null)
			|| Instant.compare(x.instant, y.instant) || ZoneOffset.compare(x.offset, y.offset);
	}

	static equal(x: OffsetDateTime, y: OffsetDateTime) {
		if (x == null && y == null) {
			return true;
		}
		if (x == null || y == null) {
			return false;
		}
		return Instant.equal(x.instant, y.instant) && x.offset === y.offset;
	}
}

export default OffsetDateTime;
