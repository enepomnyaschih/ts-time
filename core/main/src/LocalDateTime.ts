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

import {compareByNumber, equalBy, LOCAL_DATE_TIME_ISO_FORMAT, parseAs, utc} from "./_internal";
import {MS_PER_DAY} from "./constants";
import DayOfWeek from "./DayOfWeek";
import Duration from "./Duration";
import Era from "./Era";
import LocalDate from "./LocalDate";
import LocalTime, {MIDNIGHT} from "./LocalTime";
import Month, {JANUARY} from "./Month";
import OffsetDateTime from "./OffsetDateTime";
import Period from "./Period";
import {ZoneId, ZoneOffset} from "./Zone";
import ZonedDateTime from "./ZonedDateTime";

class LocalDateTime {

	private constructor(readonly date: LocalDate, readonly time: LocalTime) {
	}

	get nativeLocal() {
		return new Date(
			this.date.year, this.date.month.value - 1, this.date.dayOfMonth,
			this.time.hour, this.time.minute, this.time.second, this.time.ms);
	}

	get nativeUtc() {
		return new Date(this.epochMsUtc);
	}

	get epochMsUtc() {
		return utc(
			this.date.year, this.date.month.value - 1, this.date.dayOfMonth,
			this.time.hour, this.time.minute, this.time.second, this.time.ms).getTime();
	}

	get era(): Era {
		return this.date.era;
	}

	get year() {
		return this.date.year;
	}

	get yearOfEra() {
		return this.date.yearOfEra;
	}

	get weekBasedYear() {
		return this.date.weekBasedYear;
	}

	get month() {
		return this.date.month;
	}

	get weekOfWeekBasedYear() {
		return this.date.weekOfWeekBasedYear;
	}

	get dayOfYear() {
		return this.date.dayOfYear;
	}

	get dayOfWeekBasedYear() {
		return this.date.dayOfWeekBasedYear;
	}

	get dayOfMonth() {
		return this.date.dayOfMonth;
	}

	get dayOfWeek() {
		return this.date.dayOfWeek;
	}

	get epochDay() {
		return this.date.epochDay;
	}

	get quarterOfYear() {
		return this.date.quarterOfYear;
	}

	get isLeapYear() {
		return this.date.isLeapYear;
	}

	get lengthOfYear() {
		return this.date.lengthOfYear;
	}

	get hour() {
		return this.time.hour;
	}

	get minute() {
		return this.time.minute;
	}

	get second() {
		return this.time.second;
	}

	get ms() {
		return this.time.ms;
	}

	compareTo(other: LocalDateTime) {
		return LocalDateTime.compare(this, other);
	}

	equals(other: LocalDateTime) {
		return LocalDateTime.equal(this, other);
	}

	isAfter(other: LocalDateTime) {
		return LocalDateTime.isAfter(this, other);
	}

	isBefore(other: LocalDateTime) {
		return LocalDateTime.isBefore(this, other);
	}

	atZone(zone: ZoneId) {
		return ZonedDateTime.ofDateTime(this, zone);
	}

	atOffset(offset: ZoneOffset) {
		return OffsetDateTime.ofDateTime(this, offset);
	}

	plusDuration(duration: Duration) {
		return duration.ms !== 0 ? LocalDateTime.fromNativeUtc(new Date(this.nativeUtc.getTime() + duration.ms)) : this;
	}

	plusPeriod(period: Period) {
		return period.empty ? this : new LocalDateTime(this.date.plus(period), this.time);
	}

	minusDuration(duration: Duration) {
		return duration.ms !== 0 ? LocalDateTime.fromNativeUtc(new Date(this.nativeUtc.getTime() - duration.ms)) : this;
	}

	minusPeriod(period: Period) {
		return period.empty ? this : new LocalDateTime(this.date.minus(period), this.time);
	}

	withYear(year: number) {
		return new LocalDateTime(this.date.withYear(year), this.time);
	}

	withMonth(month: number | Month) {
		return new LocalDateTime(this.date.withMonth(month), this.time);
	}

	withDayOfMonth(dayOfMonth: number) {
		return new LocalDateTime(this.date.withDayOfMonth(dayOfMonth), this.time);
	}

	withDayOfWeek(dayOfWeek: number | DayOfWeek) {
		return new LocalDateTime(this.date.withDayOfWeek(dayOfWeek), this.time);
	}

	withDayOfYear(dayOfYear: number) {
		return new LocalDateTime(this.date.withDayOfYear(dayOfYear), this.time);
	}

	withHour(hour: number) {
		return new LocalDateTime(this.date, this.time.withHour(hour));
	}

	withMinute(minute: number) {
		return new LocalDateTime(this.date, this.time.withMinute(minute));
	}

	withSecond(second: number) {
		return new LocalDateTime(this.date, this.time.withSecond(second));
	}

	withMs(ms: number) {
		return new LocalDateTime(this.date, this.time.withMs(ms));
	}

	get truncateToYear() {
		return new LocalDateTime(this.date.truncateToYear, MIDNIGHT);
	}

	get truncateToWeekBasedYear() {
		return new LocalDateTime(this.date.truncateToWeekBasedYear, MIDNIGHT);
	}

	get truncateToMonth() {
		return new LocalDateTime(this.date.truncateToMonth, MIDNIGHT);
	}

	get truncateToWeek() {
		return new LocalDateTime(this.date.truncateToWeek, MIDNIGHT);
	}

	get truncateToDay() {
		return new LocalDateTime(this.date, MIDNIGHT);
	}

	get truncateToHour() {
		return new LocalDateTime(this.date, this.time.truncateToHour);
	}

	get truncateToMinute() {
		return new LocalDateTime(this.date, this.time.truncateToMinute);
	}

	get truncateToSecond() {
		return new LocalDateTime(this.date, this.time.truncateToSecond);
	}

	toString() {
		return `${this.date}T${this.time}`;
	}

	static of(date: LocalDate, time: LocalTime) {
		return new LocalDateTime(date, time);
	}

	static ofComponents(year: number, month: Month | number = JANUARY, dayOfMonth: number = 1, hour: number = 0, minute: number = 0, second: number = 0, ms: number = 0) {
		return new LocalDateTime(LocalDate.of(year, month, dayOfMonth), LocalTime.of(hour, minute, second, ms));
	}

	static ofEpochMsUtc(ms: number) {
		return new LocalDateTime(
			LocalDate.ofEpochDay(Math.floor(ms / MS_PER_DAY)),
			LocalTime.ofTotalMs(ms % MS_PER_DAY));
	}

	static fromNativeLocal(date: Date) {
		return date != null ? LocalDateTime.of(LocalDate.fromNativeLocal(date), LocalTime.fromNativeLocal(date)) : null;
	}

	static fromNativeUtc(date: Date) {
		return date != null ? LocalDateTime.of(LocalDate.fromNativeUtc(date), LocalTime.fromNativeUtc(date)) : null;
	}

	static parse(str: string) {
		return parseAs(str, () => LocalDateTime.parseComponent(str), "local date/time", LOCAL_DATE_TIME_ISO_FORMAT);
	}

	static parseComponent(str: string) {
		const t = str.indexOf("T");
		return LocalDateTime.of(
			LocalDate.parseComponent(t !== -1 ? str.substr(0, t) : str),
			t !== -1 ? LocalTime.parseComponent(str.substr(t + 1)) : MIDNIGHT);
	}

	static compare(x: LocalDateTime, y: LocalDateTime) {
		return compareByNumber(x, y, t => t.epochMsUtc);
	}

	static equal(x: LocalDateTime, y: LocalDateTime) {
		return equalBy(x, y, t => t.epochMsUtc);
	}

	static isAfter(x: LocalDateTime, y: LocalDateTime) {
		return LocalDateTime.compare(x, y) > 0;
	}

	static isBefore(x: LocalDateTime, y: LocalDateTime) {
		return LocalDateTime.compare(x, y) < 0;
	}
}

export default LocalDateTime;
