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

	private constructor(readonly epochMs: number) {
	}

	get native() {
		return new Date(this.epochMs);
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
		const native = this.native;
		return `${native.getUTCFullYear()}-${pad(native.getUTCMonth() + 1, 2)}-${pad(native.getUTCDate(), 2)}`
			+ `T${pad(native.getUTCHours(), 2)}:${pad(native.getUTCMinutes(), 2)}`
			+ `:${pad(native.getUTCSeconds(), 2)}.${pad(native.getUTCMilliseconds(), 3)}Z`;
	}

	static now() {
		return new Instant(new Date().getTime());
	}

	static ofEpochMs(epochMs: number) {
		return new Instant(epochMs);
	}

	static fromNative(native: Date) {
		return new Instant(native.getTime());
	}

	static parse(str: string) {
		try {
			return ZonedDateTime.parse(str).instant;
		} catch (e) {
			throw new Error("Invalid instant format.");
		}
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

export default Instant;

export const EPOCH = Instant.ofEpochMs(0);
