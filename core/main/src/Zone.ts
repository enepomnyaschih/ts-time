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

import {compareBy, Dictionary, pad, spread, toInt, utc} from "./_internal";
import {MINUTES_PER_HOUR, MS_PER_SECOND, SECONDS_PER_HOUR, SECONDS_PER_MINUTE} from "./constants";
import Instant from "./Instant";
import LocalDateTime from "./LocalDateTime";
import OffsetDateTime from "./OffsetDateTime";
import {DAY_PERIOD} from "./Period";

// TODO: Auto-detect local time zone
// TODO: List all available time zones
export abstract class ZoneId {

	protected constructor(readonly id: string) {
	}

	abstract offsetAtInstant(instant: Instant): ZoneOffset;

	abstract offsetAtLocalDateTime(localDateTime: LocalDateTime): ZoneOffset;

	toString() {
		return this.id;
	}

	static of(id: string): ZoneId {
		if (id == null) {
			return null;
		}
		const totalSeconds = parseOffset(id);
		if (Number.isFinite(totalSeconds)) {
			return ZoneOffset.ofTotalSeconds(totalSeconds);
		}
		if (id.length === 1) {
			throw new Error("Invalid time zone ID.");
		}
		let offsetStart = 0;
		if (id.startsWith("GMT+") || id.startsWith("GMT-") || id.startsWith("UTC+") || id.startsWith("UTC-")) {
			offsetStart = 3;
		} else if (id.startsWith("UT+") || id.startsWith("UT-")) {
			offsetStart = 2;
		}
		if (offsetStart !== 0) {
			const offset = ZoneOffset.of(id.substr(offsetStart));
			if (offset == null) {
				throw new Error("Invalid time zone ID.");
			}
			const fixedId = id.substr(0, offsetStart) + offset.id;
			return getCached(fixedId, () => new FixedOffsetZoneConstructor(fixedId, offset.totalSeconds));
		}
		return getCached(id, () => {
			try {
				return new CustomZone(id).test();
			} catch (e) {
				return null;
			}
		});
	}

	static compareById(x: ZoneId, y: ZoneId) {
		return compareBy(x, y, t => t.id);
	}
}

class FixedOffsetZone extends ZoneId {

	protected constructor(id: string, readonly totalSeconds: number) {
		super(id);
	}

	get hours() {
		return toInt(this.totalSeconds / SECONDS_PER_HOUR);
	}

	get minutes() {
		return Math.floor(Math.abs(this.totalSeconds) / SECONDS_PER_MINUTE) % MINUTES_PER_HOUR;
	}

	get seconds() {
		return Math.abs(this.totalSeconds) % SECONDS_PER_MINUTE;
	}

	offsetAtInstant(_instant: Instant): ZoneOffset {
		return ZoneOffset.ofTotalSeconds(this.totalSeconds);
	}

	offsetAtLocalDateTime(_localDateTime: LocalDateTime): ZoneOffset {
		return ZoneOffset.ofTotalSeconds(this.totalSeconds);
	}
}

class FixedOffsetZoneConstructor extends FixedOffsetZone {

	constructor(id: string, totalSeconds: number) {
		super(id, totalSeconds);
	}
}

export class ZoneOffset extends FixedOffsetZone {

	protected constructor(totalSeconds: number) {
		super(getNormalizedOffsetId(totalSeconds), totalSeconds);
		offsetCache[this.totalSeconds] = this;
	}

	offsetAtInstant(_instant?: Instant): ZoneOffset {
		return this;
	}

	offsetAtLocalDateTime(_localDateTime?: LocalDateTime): ZoneOffset {
		return this;
	}

	// TODO: Rename to ofId, add of(hours, minutes, seconds).
	static of(id: string): ZoneOffset {
		return id != null ? ZoneOffset.ofTotalSeconds(parseOffset(id)) : null;
	}

	static ofComponents(hours: number, minutes: number = 0, seconds: number = 0): ZoneOffset {
		return ZoneOffset.ofTotalSeconds(SECONDS_PER_HOUR * hours + SECONDS_PER_MINUTE * minutes + seconds);
	}

	static ofTotalSeconds(totalSeconds: number): ZoneOffset {
		if (!Number.isFinite(totalSeconds)) {
			throw new Error("Invalid time zone offset.");
		}
		return offsetCache[totalSeconds] || new ZoneOffset(totalSeconds);
	}

	static compare(x: ZoneOffset, y: ZoneOffset) {
		return compareBy(x, y, t => t.totalSeconds);
	}
}

class CustomZone extends ZoneId {

	readonly formatter: any;

	constructor(id: string) {
		super(id);
		this.formatter = new Intl.DateTimeFormat("en-US", {
			hour12: false,
			timeZone: id,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			era: "narrow"
		});
	}

	test(): this {
		this.formatter.format();
		return this;
	}

	offsetAtInstant(instant: Instant): ZoneOffset {
		const native = instant.native;
		const components = getComponents(this.formatter, native);
		return ZoneOffset.ofTotalSeconds((components.getTime() - native.getTime()) / MS_PER_SECOND);
	}

	offsetAtLocalDateTime(localDateTime: LocalDateTime): ZoneOffset {
		// Note: The implementation assumes that there are no 2 transitions within 2 consequent days.
		const beforeOffset = this.offsetAtInstant(
			OffsetDateTime.ofDateTime(localDateTime.minusPeriod(DAY_PERIOD), UTC).instant);
		const afterOffset = this.offsetAtInstant(
			OffsetDateTime.ofDateTime(localDateTime.plusPeriod(DAY_PERIOD), UTC).instant);
		if (beforeOffset === afterOffset) {
			return beforeOffset;
		}
		if (this.offsetAtInstant(OffsetDateTime.ofDateTime(localDateTime, beforeOffset).instant) === beforeOffset) {
			return beforeOffset;
		}
		if (this.offsetAtInstant(OffsetDateTime.ofDateTime(localDateTime, afterOffset).instant) === afterOffset) {
			return afterOffset;
		}
		return beforeOffset;
	}
}

function getComponents(formatter: Intl.DateTimeFormat, date: Date): Date {
	const matches = /^(\d+) (\d+), (\d+) ([AB]), (\d+):(\d+):(\d+)$/.exec(formatter.format(date)),
		[, month, dayOfMonth, year, era, hour, minute, second] = matches;
	return utc((era === "A") ? +year : (-year + 1),
		+month - 1, +dayOfMonth, +hour, +minute, +second, date.getUTCMilliseconds());
}

function getNormalizedOffsetId(totalSeconds: number) {
	if (totalSeconds === 0) {
		return "Z";
	}
	const [hours, minutes, seconds] = spread(Math.abs(totalSeconds), SECONDS_PER_MINUTE, MINUTES_PER_HOUR);
	const prefix = `${totalSeconds > 0 ? "+" : "-"}${pad(hours, 2)}:${pad(minutes, 2)}`;
	return (seconds === 0) ? prefix : `${prefix}:${pad(seconds, 2)}`;
}

function parseOffset(id: string): number {
	if (!id || id === "Z") {
		return 0;
	}
	{
		if (/^[-+]\d+$/.test(id) && [2, 3, 5, 7].indexOf(id.length) !== -1) {
			return (id.charAt(0) === "+" ? 1 : -1)
				* ((+id.substr(1, 2) || 0) * 3600 + (+id.substr(3, 2) || 0) * 60 + (+id.substr(5, 2) || 0));
		}
	}
	{
		const matches = /^[-+](\d\d):(\d\d)(?::(\d\d))?$/.exec(id);
		if (matches) {
			return (id.charAt(0) === "+" ? 1 : -1)
				* ((+matches[1] || 0) * 3600 + (+matches[2] || 0) * 60 + (+matches[3] || 0));
		}
	}
	return null;
}

function getCached(id: string, supplier: () => ZoneId): ZoneId {
	const cached = zoneCache[id];
	if (cached) {
		return cached;
	}
	if (cached === null) {
		throw new Error("Invalid time zone ID.");
	}
	const supplied = supplier();
	if (supplied == null) {
		throw new Error("Invalid time zone ID.");
	}
	zoneCache[id] = supplied;
	return supplied;
}

const offsetCache: Dictionary<ZoneOffset> = {}; // from totalSeconds
const zoneCache: Dictionary<ZoneId> = {}; // from id

export const UTC = ZoneOffset.of("Z");
