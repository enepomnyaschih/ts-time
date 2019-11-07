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

import {compareByNumber, equalBy, pad} from "./_internal";
import {DAYS_PER_LEAP_YEAR, DAYS_PER_NON_LEAP_YEAR} from "./constants";
import DayOfWeek, {THURSDAY} from "./DayOfWeek";
import Era, {AD, BC} from "./Era";
import LocalDateTime from "./LocalDateTime";
import LocalTime, {MIDNIGHT} from "./LocalTime";
import Month, {JANUARY} from "./Month";
import Period, {DAY_PERIOD, WEEK_PERIOD} from "./Period";
import {isLeapYear} from "./utils";

class LocalDate {

	private _weekBasedYear: number = null;

	private constructor(readonly nativeUtc: Date) {
	}

	get nativeLocal() {
		return new Date(this.nativeUtc.getUTCFullYear(), this.nativeUtc.getUTCMonth(), this.nativeUtc.getUTCDate());
	}

	get era(): Era {
		return this.year > 0 ? AD : BC;
	}

	get year() {
		return this.nativeUtc.getUTCFullYear();
	}

	get yearOfEra() {
		return Math.abs(this.year); // BC starts from 0, AD starts from 1
	}

	get weekBasedYear() {
		return this._weekBasedYear = this._weekBasedYear || this._computeWeekBasedYear();
	}

	get month() {
		return Month.of(this.nativeUtc.getUTCMonth() + 1);
	}

	get weekOfWeekBasedYear() {
		return WEEK_PERIOD.between(this.truncateToWeekBasedYear, this) + 1;
	}

	get dayOfYear() {
		return DAY_PERIOD.between(this.truncateToYear, this) + 1;
	}

	get dayOfWeekBasedYear() {
		return DAY_PERIOD.between(this.truncateToWeekBasedYear, this) + 1;
	}

	get dayOfMonth() {
		return this.nativeUtc.getUTCDate();
	}

	get dayOfWeek() {
		const day = this.nativeUtc.getUTCDay();
		return DayOfWeek.of(day === 0 ? 7 : day);
	}

	get epochDay() {
		return DAY_PERIOD.between(EPOCH_DATE, this) + 1;
	}

	get quarterOfYear() {
		return Math.floor((this.month.value + 2) / 3);
	}

	get isLeapYear() {
		return isLeapYear(this.year);
	}

	get lengthOfYear() {
		return this.isLeapYear ? DAYS_PER_LEAP_YEAR : DAYS_PER_NON_LEAP_YEAR;
	}

	compareTo(other: LocalDate) {
		return LocalDate.compare(this, other);
	}

	equals(other: LocalDate) {
		return LocalDate.equal(this, other);
	}

	isAfter(other: LocalDate) {
		return LocalDate.isAfter(this, other);
	}

	isBefore(other: LocalDate) {
		return LocalDate.isBefore(this, other);
	}

	get atStartOfDay() {
		return LocalDateTime.of(this, MIDNIGHT);
	}

	atTime(time: LocalTime) {
		return LocalDateTime.of(this, time);
	}

	get truncateToYear() {
		return LocalDate.of(this.year, JANUARY, 1);
	}

	get truncateToWeekBasedYear() {
		return getWeekBasedYearStart(this.weekBasedYear);
	}

	get truncateToMonth() {
		return LocalDate.of(this.year, this.month, 1);
	}

	get truncateToWeek() {
		return this.minus(Period.ofDays(this.dayOfWeek.value - 1));
	}

	plus(period: Period) {
		return period.addTo(this, 1);
	}

	minus(period: Period) {
		return period.addTo(this, -1);
	}

	withYear(year: number) {
		return LocalDate.of(year, this.month, this.dayOfMonth)._normalizeMonth(this);
	}

	withMonth(month: number | Month) {
		return LocalDate.of(this.year, Month.of(month), this.dayOfMonth)._normalizeMonth(this);
	}

	withDayOfMonth(dayOfMonth: number) {
		return LocalDate.of(this.year, this.month, dayOfMonth);
	}

	withDayOfWeek(dayOfWeek: number | DayOfWeek) {
		return this.truncateToWeek.plus(Period.ofDays(DayOfWeek.of(dayOfWeek).value - 1));
	}

	withDayOfYear(dayOfYear: number) {
		return this.truncateToYear.plus(Period.ofDays(dayOfYear - 1));
	}

	toString() {
		return `${this.nativeUtc.getUTCFullYear()}-${pad(this.nativeUtc.getUTCMonth() + 1, 2)}-${pad(this.nativeUtc.getUTCDate(), 2)}`;
	}

	// Months have different amount of days. When you change year or month value, you should call this method to
	// make sure that the date doesn't switch to the next month due to smaller number of days in target month.
	_normalizeMonth(originalDate: LocalDate) {
		return (this.dayOfMonth === originalDate.dayOfMonth) ? this : this.minus(Period.ofDays(this.dayOfMonth));
	}

	// TODO: Find a more efficient implementation and remove cached _weekBasedYear
	private _computeWeekBasedYear() {
		for (let i = 1; i >= -1; --i) {
			const weekBasedYearStart = getWeekBasedYearStart(this.year + i);
			if (!weekBasedYearStart.isAfter(this)) {
				return this.year + i;
			}
		}
		return null;
	}

	static of(year: number, month: number | Month = JANUARY, dayOfMonth: number = 1) {
		const date = new Date(Date.UTC(year, Month.of(month).value - 1, dayOfMonth, 0, 0, 0, 0));
		if (year >= 0 && year <= 99) {
			// Work around a REALLY STUPID feature of Date.UTC to treat 00-99 years as 1900-1999
			date.setUTCFullYear(year);
		}
		return new LocalDate(date);
	}

	static ofEpochDay(epochDay: number) {
		return EPOCH_DATE.plus(Period.ofDays(epochDay - 1));
	}

	static ofYearDay(year: number, dayOfYear: number) {
		return LocalDate.of(year, 1, 1).plus(Period.ofDays(dayOfYear - 1));
	}

	static ofWeek(year: number, week: number, dayOfWeek: number | DayOfWeek) {
		return getWeekBasedYearStart(year)
			.plus(Period.ofWeeks(week - 1))
			.plus(Period.ofDays(DayOfWeek.of(dayOfWeek).value - 1));
	}

	static ofWeekBasedYearDay(year: number, dayOfWeekBasedYear: number) {
		return getWeekBasedYearStart(year).plus(Period.ofDays(dayOfWeekBasedYear - 1));
	}

	static fromNativeLocal(date: Date) {
		return date != null ? LocalDate.of(date.getFullYear(), date.getMonth() + 1, date.getDate()) : null;
	}

	static fromNativeUtc(date: Date) {
		return date != null ? new LocalDate(date) : null;
	}

	static parse(str: string) {
		const matches = /^(\d+)-(\d+)-(\d+)$/.exec(str);
		if (!matches) {
			throw new Error("Invalid date format.");
		}
		const year = +matches[1],
			month = +matches[2],
			day = +matches[3];
		if (isNaN(year) || isNaN(month) || isNaN(day)) {
			throw new Error("Invalid date format.");
		}
		const date = new Date(Date.UTC(year, month - 1, day));
		if (year !== date.getUTCFullYear() || month - 1 !== date.getUTCMonth() || day !== date.getUTCDate()) {
			throw new Error("Invalid date format.");
		}
		return new LocalDate(date);
	}

	static compare(x: LocalDate, y: LocalDate) {
		return compareByNumber(x, y, t => t.nativeUtc.getTime());
	}

	static equal(x: LocalDate, y: LocalDate) {
		return equalBy(x, y, t => t.nativeUtc.getTime());
	}

	static isAfter(x: LocalDate, y: LocalDate) {
		return LocalDate.compare(x, y) > 0;
	}

	static isBefore(x: LocalDate, y: LocalDate) {
		return LocalDate.compare(x, y) < 0;
	}
}

export default LocalDate;

function getWeekBasedYearStart(year: number) {
	const firstDay = LocalDate.of(year, JANUARY, 1),
		dayOfWeek = firstDay.dayOfWeek;
	return dayOfWeek.isAfter(THURSDAY)
		? firstDay.plus(Period.ofDays(8 - dayOfWeek.value))
		: firstDay.minus(Period.ofDays(dayOfWeek.value - 1));
}

export const EPOCH_DATE = LocalDate.of(1970, 1, 1);
