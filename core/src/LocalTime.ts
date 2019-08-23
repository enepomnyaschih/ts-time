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

import {compareByNumber, equalBy, mod, pad} from "./_internal";
import {
	HOURS_PER_DAY,
	MINUTES_PER_HOUR,
	MS_PER_DAY,
	MS_PER_HOUR,
	MS_PER_MINUTE,
	MS_PER_SECOND,
	SECONDS_PER_MINUTE
} from "./constants";
import Duration from "./Duration";
import LocalDate from "./LocalDate";
import LocalDateTime from "./LocalDateTime";
import TimeField from "./TimeField";

class LocalTime {

	private constructor(readonly totalMs: number) {
	}

	get hour() {
		return Math.floor(this.totalMs / MS_PER_HOUR);
	}

	get minute() {
		return Math.floor(this.totalMs / MS_PER_MINUTE) % MINUTES_PER_HOUR;
	}

	get second() {
		return Math.floor(this.totalMs / MS_PER_SECOND) % SECONDS_PER_MINUTE;
	}

	get ms() {
		return this.totalMs % MS_PER_SECOND;
	}

	get(field: TimeField) {
		return field.get(this);
	}

	compareTo(other: LocalTime) {
		return LocalTime.compare(this, other);
	}

	equals(other: LocalTime) {
		return LocalTime.equal(this, other);
	}

	isAfter(other: LocalTime) {
		return LocalTime.isAfter(this, other);
	}

	isBefore(other: LocalTime) {
		return LocalTime.isBefore(this, other);
	}

	atDate(date: LocalDate) {
		return LocalDateTime.of(date, this);
	}

	plus(duration: Duration) {
		return LocalTime.ofTotalMs(this.totalMs + duration.ms);
	}

	minus(duration: Duration) {
		return LocalTime.ofTotalMs(this.totalMs - duration.ms);
	}

	withHour(hour: number) {
		return LocalTime.of(hour, this.minute, this.second, this.ms);
	}

	withMinute(minute: number) {
		return LocalTime.of(this.hour, minute, this.second, this.ms);
	}

	withSecond(second: number) {
		return LocalTime.of(this.hour, this.minute, second, this.ms);
	}

	withMs(ms: number) {
		return LocalTime.of(this.hour, this.minute, this.second, ms);
	}

	truncateToHour() {
		return LocalTime.ofTotalMs(Math.floor(this.totalMs / MS_PER_HOUR) * MS_PER_HOUR);
	}

	truncateToMinute() {
		return LocalTime.ofTotalMs(Math.floor(this.totalMs / MS_PER_MINUTE) * MS_PER_MINUTE);
	}

	truncateToSecond() {
		return LocalTime.ofTotalMs(Math.floor(this.totalMs / MS_PER_SECOND) * MS_PER_SECOND);
	}

	toString() {
		return `${pad(this.hour, 2)}:${pad(this.minute, 2)}:${pad(this.second, 2)}.${pad(this.ms, 3)}`;
	}

	static of(hour: number, minute: number, second: number, ms: number) {
		return LocalTime.ofTotalMs(hour * MS_PER_HOUR + minute * MS_PER_MINUTE + second * MS_PER_SECOND + ms);
	}

	static ofTotalMs(totalMs: number) {
		return new LocalTime(mod(totalMs, MS_PER_DAY));
	}

	static fromNativeLocal(date: Date) {
		return LocalTime.of(
			date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
	}

	static fromNativeUtc(date: Date) {
		return LocalTime.of(
			date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
	}

	static parse(str: string) {
		const matches = /^(\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?$/.exec(str);
		if (!matches) {
			throw new Error("Invalid time format.");
		}
		const hour = +matches[0],
			minute = +matches[1],
			second = +matches[2] || 0,
			ms = +matches[3] || 0;
		if (isNaN(hour) || isNaN(minute) || isNaN(second) || isNaN(ms) || hour >= HOURS_PER_DAY
			|| minute >= MINUTES_PER_HOUR || second >= SECONDS_PER_MINUTE || ms >= MS_PER_SECOND) {
			throw new Error("Invalid time format.");
		}
		return LocalTime.of(hour, minute, second, ms);
	}

	static compare(x: LocalTime, y: LocalTime) {
		return compareByNumber(x, y, t => t.totalMs);
	}

	static equal(x: LocalTime, y: LocalTime) {
		return equalBy(x, y, t => t.totalMs);
	}

	static isAfter(x: LocalTime, y: LocalTime) {
		return LocalTime.compare(x, y) > 0;
	}

	static isBefore(x: LocalTime, y: LocalTime) {
		return LocalTime.compare(x, y) < 0;
	}
}

export default LocalTime;

export const MIN_TIME = LocalTime.ofTotalMs(0);
export const MAX_TIME = LocalTime.ofTotalMs(MS_PER_DAY - 1);
export const MIDNIGHT = MIN_TIME;
export const NOON = LocalTime.ofTotalMs(MS_PER_DAY / 2);
