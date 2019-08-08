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

import {compareByNumber, equalBy} from "./_internal";
import DayOfWeek from "./DayOfWeek";
import Duration from "./Duration";
import LocalDate from "./LocalDate";
import LocalTime, {MIDNIGHT} from "./LocalTime";
import Month from "./Month";
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
		return new Date(this.epochMs);
	}

	get epochMs() {
		return Date.UTC(
			this.date.year, this.date.month.value - 1, this.date.dayOfMonth,
			this.time.hour, this.time.minute, this.time.second, this.time.ms);
	}

	get era() {
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

	plus(duration: Duration | Period) {
		return (duration instanceof Duration)
			? LocalDateTime.fromNativeUtc(new Date(this.nativeUtc.getTime() + duration.ms))
			: LocalDateTime.of(this.date.plus(duration), this.time);
	}

	minus(duration: Duration | Period) {
		return (duration instanceof Duration)
			? LocalDateTime.fromNativeUtc(new Date(this.nativeUtc.getTime() - duration.ms))
			: LocalDateTime.of(this.date.minus(duration), this.time);
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

	truncateToYear() {
		return new LocalDateTime(this.date.truncateToYear, MIDNIGHT);
	}

	truncateToWeekBasedYear() {
		return new LocalDateTime(this.date.truncateToWeekBasedYear, MIDNIGHT);
	}

	truncateToMonth() {
		return new LocalDateTime(this.date.truncateToMonth, MIDNIGHT);
	}

	truncateToWeek() {
		return new LocalDateTime(this.date.truncateToWeek, MIDNIGHT);
	}

	truncateToDay() {
		return new LocalDateTime(this.date, MIDNIGHT);
	}

	truncateToHour() {
		return new LocalDateTime(this.date, this.time.truncateToHour());
	}

	truncateToMinute() {
		return new LocalDateTime(this.date, this.time.truncateToMinute());
	}

	truncateToSecond() {
		return new LocalDateTime(this.date, this.time.truncateToSecond());
	}

	toString() {
		return `${this.date}T${this.time}`;
	}

	static of(date: LocalDate, time: LocalTime) {
		return new LocalDateTime(date, time);
	}

	static ofEpochMs(epochMs: number) {
		return LocalDateTime.fromNativeUtc(new Date(epochMs));
	}

	static fromNativeLocal(date: Date) {
		return LocalDateTime.of(LocalDate.fromNativeLocal(date), LocalTime.fromNativeLocal(date));
	}

	static fromNativeUtc(date: Date) {
		return LocalDateTime.of(LocalDate.fromNativeUtc(date), LocalTime.fromNativeUtc(date));
	}

	static parse(str: string) {
		const t = str.indexOf("T");
		return LocalDateTime.of(
			LocalDate.parse(t !== -1 ? str.substr(0, t) : str),
			t !== -1 ? LocalTime.parse(str.substr(t + 1)) : MIDNIGHT);
	}

	static compare(x: LocalDateTime, y: LocalDateTime) {
		return compareByNumber(x, y, t => t.epochMs);
	}

	static equal(x: LocalDateTime, y: LocalDateTime) {
		return equalBy(x, y, t => t.epochMs);
	}

	static isAfter(x: LocalDateTime, y: LocalDateTime) {
		return LocalDateTime.compare(x, y) > 0;
	}

	static isBefore(x: LocalDateTime, y: LocalDateTime) {
		return LocalDateTime.compare(x, y) < 0;
	}
}

export default LocalDateTime;
