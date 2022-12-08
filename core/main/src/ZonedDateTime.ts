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

import {compare, parseAs, ZONED_DATE_TIME_ISO_FORMAT} from "./_internal";
import {MS_PER_SECOND} from "./constants";
import DayOfWeek from "./DayOfWeek";
import Duration from "./Duration";
import Era from "./Era";
import {MismatchingOffsetError} from "./errors";
import Instant from "./Instant";
import LocalDate from "./LocalDate";
import LocalDateTime from "./LocalDateTime";
import LocalTime from "./LocalTime";
import Month from "./Month";
import OffsetDateTime from "./OffsetDateTime";
import Period from "./Period";
import {ZoneId, ZoneOffset} from "./Zone";

class ZonedDateTime {

	private _dateTime: LocalDateTime;
	private _offset: ZoneOffset;
	private _offsetDateTime: OffsetDateTime;

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

	// TODO: Add truncates?

	get offset() {
		return this._offset = this._offset || this.zone.offsetAtInstant(this.instant);
	}

	get offsetDateTime() {
		return this._offsetDateTime = this._offsetDateTime || OffsetDateTime.ofDateTime(this.dateTime, this.offset);
	}

	compareTo(other: ZonedDateTime) {
		return ZonedDateTime.compare(this, other);
	}

	equals(other: ZonedDateTime) {
		return ZonedDateTime.equal(this, other);
	}

	plusDuration(duration: Duration) {
		return duration.ms !== 0 ? new ZonedDateTime(this.instant.plus(duration), this.zone) : this;
	}

	plusPeriod(period: Period) {
		return period.empty ? this : ZonedDateTime.ofDateTime(this.dateTime.plusPeriod(period), this.zone);
	}

	minusDuration(duration: Duration) {
		return duration.ms !== 0 ? new ZonedDateTime(this.instant.minus(duration), this.zone) : this;
	}

	minusPeriod(period: Period) {
		return period.empty ? this : ZonedDateTime.ofDateTime(this.dateTime.minusPeriod(period), this.zone);
	}

	withYear(year: number) {
		return ZonedDateTime.ofDateTime(this.dateTime.withYear(year), this.zone);
	}

	withMonth(month: number | Month) {
		return ZonedDateTime.ofDateTime(this.dateTime.withMonth(month), this.zone);
	}

	withDayOfMonth(dayOfMonth: number) {
		return ZonedDateTime.ofDateTime(this.dateTime.withDayOfMonth(dayOfMonth), this.zone);
	}

	withDayOfWeek(dayOfWeek: number | DayOfWeek) {
		return ZonedDateTime.ofDateTime(this.dateTime.withDayOfWeek(dayOfWeek), this.zone);
	}

	withDayOfYear(dayOfYear: number) {
		return ZonedDateTime.ofDateTime(this.dateTime.withDayOfYear(dayOfYear), this.zone);
	}

	withHour(hour: number) {
		return ZonedDateTime.ofDateTime(this.dateTime.withHour(hour), this.zone);
	}

	withMinute(minute: number) {
		return ZonedDateTime.ofDateTime(this.dateTime.withMinute(minute), this.zone);
	}

	withSecond(second: number) {
		return ZonedDateTime.ofDateTime(this.dateTime.withSecond(second), this.zone);
	}

	withMs(ms: number) {
		return ZonedDateTime.ofDateTime(this.dateTime.withMs(ms), this.zone);
	}

	toString() {
		return `${this.offsetDateTime.toString()}${this.zone !== this.offset ? `[${this.zone.id}]` : ""}`;
	}

	private _computeDateTime() {
		return LocalDateTime.fromNativeUtc(
			new Date(this.instant.native.getTime() + this.offset.totalSeconds * MS_PER_SECOND));
	}

	static ofInstant(instant: Instant, zone: ZoneId) {
		return new ZonedDateTime(instant, zone);
	}

	static ofDateTime(localDateTime: LocalDateTime, zone: ZoneId) {
		const instant = Instant.ofEpochMs(
			localDateTime.epochMsUtc - zone.offsetAtLocalDateTime(localDateTime).totalSeconds * MS_PER_SECOND);
		return new ZonedDateTime(instant, zone);
	}

	static parse(str: string) {
		return parseAs(str, () => ZonedDateTime.parseComponent(str), "date/time with zone", ZONED_DATE_TIME_ISO_FORMAT);
	}

	static parseComponent(str: string) {
		const t = str.indexOf("["),
			offsetDateTime = OffsetDateTime.parseComponent(t !== -1 ? str.substr(0, t) : str),
			zoneId = t !== -1 ? ZoneId.parseComponent(str.substr(t + 1, str.length - t - 2)) : offsetDateTime.offset,
			zonedDateTime = ZonedDateTime.ofDateTime(offsetDateTime.dateTime, zoneId);
		if (zonedDateTime.offset !== offsetDateTime.offset) {
			throw new MismatchingOffsetError(String(offsetDateTime.offset), String(zonedDateTime));
		}
		return zonedDateTime;
	}

	static compare(x: ZonedDateTime, y: ZonedDateTime) {
		if (x == null && y == null) {
			return 0;
		}
		return compare(x != null, y != null)
			|| Instant.compare(x.instant, y.instant) || ZoneId.compareById(x.zone, y.zone);
	}

	static equal(x: ZonedDateTime, y: ZonedDateTime) {
		if (x == null && y == null) {
			return true;
		}
		if (x == null || y == null) {
			return false;
		}
		return Instant.equal(x.instant, y.instant) && x.zone === y.zone;
	}
}

export default ZonedDateTime;
