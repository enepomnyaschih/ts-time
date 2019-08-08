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
import Duration from "./Duration";
import OffsetDateTime from "./OffsetDateTime";
import {ZoneId, ZoneOffset} from "./Zone";
import ZonedDateTime from "./ZonedDateTime";

class Instant {

	private constructor(readonly native: Date) {
	}

	get epochMs() {
		return this.native.getTime();
	}

	atOffset(offset: ZoneOffset) {
		return OffsetDateTime.ofInstant(this, offset);
	}

	atZone(zone: ZoneId) {
		return ZonedDateTime.ofInstant(this, zone);
	}

	compareTo(other: Instant) {
		return Instant.compare(this, other);
	}

	equals(other: Instant) {
		return Instant.equal(this, other);
	}

	isAfter(other: Instant) {
		return Instant.isAfter(this, other);
	}

	isBefore(other: Instant) {
		return Instant.isBefore(this, other);
	}

	plus(ms: number | Duration) {
		return Instant.ofEpochMs(this.epochMs + Duration.of(ms).ms);
	}

	minus(ms: number | Duration) {
		return Instant.ofEpochMs(this.epochMs - Duration.of(ms).ms);
	}

	until(instant: Instant) {
		return Duration.ofMs(instant.epochMs - this.epochMs);
	}

	toString() {
		return `${this.native.getUTCFullYear()}-${pad(this.native.getUTCMonth(), 2)}-${pad(this.native.getUTCDate(), 2)}`
			+ `T${pad(this.native.getUTCHours(), 2)}:${pad(this.native.getUTCMinutes(), 2)}`
			+ `:${pad(this.native.getUTCSeconds(), 2)}.${pad(this.native.getUTCMilliseconds(), 3)}Z`;
	}

	static now() {
		return new Instant(new Date());
	}

	static ofEpochMs(epochMs: number) {
		return new Instant(new Date(epochMs));
	}

	static fromNative(native: Date) {
		return new Instant(native);
	}

	static parse(str: string) {
		const matches = /^(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+).(\d+)Z$/i.exec(str);
		if (!matches) {
			throw new Error("Invalid instant format.");
		}
		const year = +matches[0],
			month = +matches[1],
			day = +matches[2],
			hour = +matches[3],
			minute = +matches[4],
			second = +matches[5],
			ms = +matches[6];
		if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute) || isNaN(second) || isNaN(ms)) {
			throw new Error("Invalid instant format.");
		}
		const date = new Date(Date.UTC(year, month, day, hour, minute, second, ms));
		if (year !== date.getUTCFullYear() || month !== date.getUTCMonth() || day !== date.getUTCDate()
			|| hour !== date.getUTCHours() || minute !== date.getUTCMinutes() || second !== date.getUTCSeconds()
			|| ms !== date.getUTCMilliseconds()) {
			throw new Error("Invalid instant format.");
		}
		return new Instant(date);
	}

	static compare(x: Instant, y: Instant) {
		return compareByNumber(x, y, t => t.epochMs);
	}

	static equal(x: Instant, y: Instant) {
		return equalBy(x, y, t => t.epochMs);
	}

	static isAfter(x: Instant, y: Instant) {
		return Instant.compare(x, y) > 0;
	}

	static isBefore(x: Instant, y: Instant) {
		return Instant.compare(x, y) < 0;
	}
}

export const EPOCH = Instant.ofEpochMs(0);

export default Instant;
