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

import {Enum, pad, parsePattern} from "./_internal";
import {HOURS_PER_DAY} from "./constants";
import LocalTime from "./LocalTime";
import {TemporalCompiler} from "./TemporalCompiler";
import {TemporalFormatComponent, TemporalFormatter} from "./TemporalFormatter";
import TimeField, {HOUR12_FIELD, HOUR_FIELD, MINUTE_FIELD, MS_FIELD, SECOND_FIELD} from "./TimeField";

export interface TimeCompiler extends TemporalCompiler<LocalTime> {
}

class FieldCompiler implements TimeCompiler {

	constructor(readonly char: string, private field: TimeField) {
	}

	get maxLength() {
		return 2;
	}

	compile(time: LocalTime, length: number): string {
		const value = time.get(this.field);
		return length === 1 ? String(value) : pad(value, 2);
	}
}

class NonZeroFieldCompiler implements TimeCompiler {

	constructor(readonly char: string, private field: TimeField) {
	}

	get maxLength() {
		return 2;
	}

	compile(time: LocalTime, length: number): string {
		const value = time.minus(this.field.getDuration()).get(this.field) + 1;
		return length === 1 ? String(value) : pad(value, 2);
	}
}

class AmPmCompiler implements TimeCompiler {

	get char() {
		return "a";
	}

	get maxLength() {
		return 1;
	}

	compile(time: LocalTime, _length: number): string {
		return (2 * time.hour < HOURS_PER_DAY) ? "AM" : "PM";
	}
}

export const TIME_COMPILERS = new Enum<TimeCompiler>([
	new FieldCompiler("H", HOUR_FIELD),
	new FieldCompiler("K", HOUR12_FIELD),
	new FieldCompiler("m", MINUTE_FIELD),
	new FieldCompiler("s", SECOND_FIELD),
	new FieldCompiler("S", MS_FIELD),
	new NonZeroFieldCompiler("h", HOUR12_FIELD),
	new NonZeroFieldCompiler("k", HOUR_FIELD),
	new AmPmCompiler()
], compiler => compiler.char);

class TimeFormatter extends TemporalFormatter<LocalTime> {

	static of(components: TemporalFormatComponent<LocalTime>[]) {
		return new TimeFormatter(components);
	}

	static ofPattern(pattern: string, compilers: Enum<TimeCompiler> = TIME_COMPILERS) {
		return new TimeFormatter(parsePattern(pattern, compilers));
	}
}

export default TimeFormatter;
