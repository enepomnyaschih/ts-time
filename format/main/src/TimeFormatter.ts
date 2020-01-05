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

import {Enum, pad} from "ts-time/_internal";
import {HOURS_PER_DAY} from "ts-time/constants";
import LocalTime from "ts-time/LocalTime";
import TimeField, {HOUR12_FIELD, HOUR_FIELD, MINUTE_FIELD, SECOND_FIELD} from "ts-time/TimeField";
import {TemporalCompiler} from "./TemporalCompiler";
import TemporalFormatter, {TemporalFormatComponent} from "./TemporalFormatter";
import {parsePattern} from "./utils";

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

class MsCompiler implements TimeCompiler {

	constructor(readonly char: string) {
	}

	get maxLength() {
		return 3;
	}

	compile(time: LocalTime, length: number): string {
		return pad(time.ms, 3).substr(0, length);
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

export const HOUR_COMPILER: TimeCompiler = new FieldCompiler("H", HOUR_FIELD);
export const HOUR12_COMPILER: TimeCompiler = new FieldCompiler("K", HOUR12_FIELD);
export const MINUTE_COMPILER: TimeCompiler = new FieldCompiler("m", MINUTE_FIELD);
export const SECOND_COMPILER: TimeCompiler = new FieldCompiler("s", SECOND_FIELD);
export const MS_COMPILER: TimeCompiler = new MsCompiler("S");
export const HOUR_NZ_COMPILER: TimeCompiler = new NonZeroFieldCompiler("h", HOUR12_FIELD);
export const HOUR12_NZ_COMPILER: TimeCompiler = new NonZeroFieldCompiler("k", HOUR_FIELD);
export const AM_PM_COMPILER: TimeCompiler = new AmPmCompiler();

export const TIME_COMPILERS = new Enum<TimeCompiler>([
	HOUR_COMPILER,
	HOUR12_COMPILER,
	MINUTE_COMPILER,
	SECOND_COMPILER,
	MS_COMPILER,
	HOUR_NZ_COMPILER,
	HOUR12_NZ_COMPILER,
	AM_PM_COMPILER
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
