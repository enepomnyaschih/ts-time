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

import {compareBy, Dictionary, pad, spread, toInt} from "./_internal";
import {MINUTES_PER_HOUR, SECONDS_PER_HOUR, SECONDS_PER_MINUTE} from "./constants";
import Instant from "./Instant";
import LocalDateTime from "./LocalDateTime";
import OffsetDateTime from "./OffsetDateTime";

export abstract class ZoneId {

	protected constructor(readonly id: string) {
	}

	abstract offsetAtInstant(instant: Instant): ZoneOffset;

	abstract offsetAtLocalDateTime(localDateTime: LocalDateTime): ZoneOffset;

	static of(id: string): ZoneId {
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

export class FixedOffsetZone extends ZoneId {

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
		return ZoneOffset.ofTotalSeconds(parseOffset(id));
	}

	static ofTotalSeconds(totalSeconds: number): ZoneOffset {
		if (!Number.isFinite(totalSeconds)) {
			throw new Error("Invalid time zone offset.");
		}
		return offsetCache[totalSeconds] || new ZoneOffsetConstructor(totalSeconds);
	}

	static compare(x: ZoneOffset, y: ZoneOffset) {
		return compareBy(x, y, t => t.totalSeconds);
	}
}

class ZoneOffsetConstructor extends ZoneOffset {

	constructor(totalSeconds: number) {
		super(totalSeconds);
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
			second: "2-digit"
		});
	}

	test(): this {
		this.formatter.format();
		return this;
	}

	offsetAtInstant(instant: Instant): ZoneOffset {
		const parts: number[] = this.formatter.formatToParts
			? partsOffset(this.formatter, instant.native)
			: hackyOffset(this.formatter, instant.native);
		const zonedTime = utcFromComponents(parts);
		let instantTime = instant.native.getTime();
		instantTime -= instantTime % 1000;
		return ZoneOffset.ofTotalSeconds((zonedTime - instantTime) / 1000);
	}

	offsetAtLocalDateTime(localDateTime: LocalDateTime): ZoneOffset {
		const provisionalOffset = UTC.offsetAtLocalDateTime(localDateTime);
		const instant = OffsetDateTime.ofDateTime(localDateTime, provisionalOffset).instant;
		return ZoneOffset.ofTotalSeconds(this.offsetAtInstant(instant).totalSeconds);
	}
}

const typeToPos: Dictionary<number> = {
	year: 0,
	month: 1,
	day: 2,
	hour: 3,
	minute: 4,
	second: 5
};

function partsOffset(formatter: any, date: Date): number[] {
	const formatted = formatter.formatToParts(date),
		filled: number[] = [];
	for (let i = 0; i < formatted.length; i++) {
		const {type, value} = formatted[i],
			pos = typeToPos[type];
		if (pos != null) {
			filled[pos] = parseInt(value, 10);
		}
	}
	return filled;
}

function hackyOffset(formatter: Intl.DateTimeFormat, date: Date): number[] {
	const formatted = formatter.format(date).replace(/\u200E/g, ""),
		matches = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted),
		[, fMonth, fDay, fYear, fHour, fMinute, fSecond] = matches;
	return [+fYear, +fMonth, +fDay, +fHour, +fMinute, +fSecond];
}

function utcFromComponents(arr: number[]) {
	let d: any = Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] || 0, arr[4] || 0, arr[5] || 0, arr[6] || 0);
	if (arr[0] < 100 && arr[0] >= 0) {
		d = new Date(d);
		d.setUTCFullYear(d.getUTCFullYear() - 1900);
	}
	return +d;
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

export const UTC = ZoneOffset.of(null);
