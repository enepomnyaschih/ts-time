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
import LocalDate from "ts-time/LocalDate";
import {DEFAULT_TEMPORAL_CONTEXT} from "./constants";
import {TemporalCompiler} from "./TemporalCompiler";
import {TemporalFormatComponent, TemporalFormatter} from "./TemporalFormatter";
import {parsePattern} from "./utils";

export interface DateCompiler extends TemporalCompiler<LocalDate> {
}

class YearCompiler implements DateCompiler {

	constructor(readonly char: string, private getter: (date: LocalDate) => number) {
	}

	get maxLength() {
		return 4;
	}

	compile(date: LocalDate, length: number): string {
		const value = this.getter(date);
		switch (length) {
			case 2:
				return pad(value % 100, 2);
			default:
				return String(value);
		}
	}
}

// TODO: Extract DayOfWeekFormatters (with dayOfWeek.format method) and so on.
class NumberCompiler implements DateCompiler {

	constructor(readonly char: string, readonly maxLength: number, private getter: (date: LocalDate) => number) {
	}

	compile(date: LocalDate, length: number): string {
		return compileNumber(this.getter(date), length);
	}
}

class TextCompiler implements DateCompiler {

	constructor(readonly char: string, readonly maxLength: number,
				private group: string, private getter: (date: LocalDate) => number) {
	}

	compile(date: LocalDate, length: number, context: any): string {
		return compileText(context, this.group, this.getter(date), length);
	}
}

class NumberTextCompiler implements DateCompiler {

	constructor(readonly char: string, readonly maxLength: number,
				private group: string, private getter: (date: LocalDate) => number, private textOffset: number = 0) {
	}

	compile(date: LocalDate, length: number, context: any): string {
		return compileNumberText(context, this.group, this.getter(date), length, this.textOffset);
	}
}

function compileText(context: any, group: string, value: number, length: number): string {
	context = context || {};
	const key = group + (length === 1 ? "ShortNames" : length === 2 ? "Names" : "Abbreviations");
	return ((context || {})[key] || DEFAULT_TEMPORAL_CONTEXT[key])[value];
}

function compileNumber(value: number, length: number): string {
	return (length === 1) ? String(value) : pad(value, length);
}

function compileNumberText(context: any, group: string, value: number, length: number, textOffset: number): string {
	return (length <= 2) ? compileNumber(value, length) : compileText(context, group, value + textOffset, length - 2);
}

export const ERA_COMPILER: DateCompiler = new TextCompiler("G", 3, "era", date => date.era.value);
export const YEAR_COMPILER: DateCompiler = new YearCompiler("u", date => date.year);
export const YEAR_OF_ERA_COMPILER: DateCompiler = new YearCompiler("y", date => date.yearOfEra);
export const DAY_OF_YEAR_COMPILER: DateCompiler = new NumberCompiler("D", 3, date => date.dayOfYear);
export const MONTH_OF_YEAR_COMPILER_M: DateCompiler = new NumberTextCompiler("M", 5, "month", date => date.month.value, -1);
export const MONTH_OF_YEAR_COMPILER_L: DateCompiler = new NumberTextCompiler("L", 5, "month", date => date.month.value, -1);
export const DAY_OF_MONTH_COMPILER: DateCompiler = new NumberCompiler("d", 2, date => date.dayOfMonth);

export const QUARTER_OF_YEAR_COMPILER_Q: DateCompiler = new NumberTextCompiler("Q", 4, "quarter", date => date.quarterOfYear, -1);
export const QUARTER_OF_YEAR_COMPILER_q: DateCompiler = new NumberTextCompiler("q", 4, "quarter", date => date.quarterOfYear, -1);
export const WEEK_BASED_YEAR_COMPILER: DateCompiler = new YearCompiler("Y", date => date.weekBasedYear);
export const WEEK_OF_WEEK_BASED_YEAR_COMPILER: DateCompiler = new NumberCompiler("w", 2, date => date.weekOfWeekBasedYear);
//export const WEEK_MONTH_COMPILER_W: DateCompiler = new NumberCompiler("W", 2, date => date.weekOfMonth);
//export const WEEK_MONTH_COMPILER_F: DateCompiler = new NumberCompiler("F", 2, date => date.weekOfMonth);
export const DAY_OF_WEEK_COMPILER_E: DateCompiler = new TextCompiler("E", 3, "dayOfWeek", date => date.dayOfWeek.value - 1);
export const DAY_OF_WEEK_COMPILER_e: DateCompiler = new NumberTextCompiler("e", 5, "dayOfWeek", date => date.dayOfWeek.value, -1);
export const DAY_OF_WEEK_COMPILER_c: DateCompiler = new NumberTextCompiler("c", 5, "dayOfWeek", date => date.dayOfWeek.value, -1);

export const DATE_COMPILERS = new Enum<DateCompiler>([
	ERA_COMPILER,
	YEAR_COMPILER,
	YEAR_OF_ERA_COMPILER,
	DAY_OF_YEAR_COMPILER,
	MONTH_OF_YEAR_COMPILER_M,
	MONTH_OF_YEAR_COMPILER_L,
	DAY_OF_MONTH_COMPILER,

	QUARTER_OF_YEAR_COMPILER_Q,
	QUARTER_OF_YEAR_COMPILER_q,
	WEEK_BASED_YEAR_COMPILER,
	WEEK_OF_WEEK_BASED_YEAR_COMPILER,
	//WEEK_MONTH_COMPILER_W,
	//WEEK_MONTH_COMPILER_F,
	DAY_OF_WEEK_COMPILER_E,
	DAY_OF_WEEK_COMPILER_e,
	DAY_OF_WEEK_COMPILER_c
], compiler => compiler.char);

class DateFormatter extends TemporalFormatter<LocalDate> {

	static of(components: TemporalFormatComponent<LocalDate>[]) {
		return new DateFormatter(components);
	}

	static ofPattern(pattern: string, compilers: Enum<DateCompiler> = DATE_COMPILERS) {
		return new DateFormatter(parsePattern(pattern, compilers));
	}
}

export default DateFormatter;
