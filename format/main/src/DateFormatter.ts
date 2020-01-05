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

import {Dictionary, pad} from "ts-time/_internal";
import LocalDate from "ts-time/LocalDate";
import {DEFAULT_TEMPORAL_CONTEXT} from "./constants";
import {TemporalCompiler} from "./TemporalCompiler";
import TemporalFormatter, {TemporalFormatComponent} from "./TemporalFormatter";
import {parsePattern} from "./utils";

export interface DateCompiler extends TemporalCompiler<LocalDate> {
}

class YearCompiler implements DateCompiler {

	constructor(private getter: (date: LocalDate) => number) {
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

	constructor(readonly maxLength: number, private getter: (date: LocalDate) => number) {
	}

	compile(date: LocalDate, length: number): string {
		return compileNumber(this.getter(date), length);
	}
}

class TextCompiler implements DateCompiler {

	constructor(readonly maxLength: number, private group: string, private getter: (date: LocalDate) => number) {
	}

	compile(date: LocalDate, length: number, context: any): string {
		return compileText(context, this.group, this.getter(date), length);
	}
}

class NumberTextCompiler implements DateCompiler {

	constructor(readonly maxLength: number, private group: string, private getter: (date: LocalDate) => number,
				private textOffset: number = 0) {
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

export const ERA_COMPILER: DateCompiler = new TextCompiler(3, "era", date => date.era.value);
export const YEAR_COMPILER: DateCompiler = new YearCompiler(date => date.year);
export const YEAR_OF_ERA_COMPILER: DateCompiler = new YearCompiler(date => date.yearOfEra);
export const DAY_OF_YEAR_COMPILER: DateCompiler = new NumberCompiler(3, date => date.dayOfYear);
export const MONTH_OF_YEAR_COMPILER: DateCompiler = new NumberTextCompiler(5, "month", date => date.month.value, -1);
export const DAY_OF_MONTH_COMPILER: DateCompiler = new NumberCompiler(2, date => date.dayOfMonth);

export const QUARTER_OF_YEAR_COMPILER: DateCompiler = new NumberTextCompiler(4, "quarter", date => date.quarterOfYear, -1);
export const WEEK_BASED_YEAR_COMPILER: DateCompiler = new YearCompiler(date => date.weekBasedYear);
export const WEEK_OF_WEEK_BASED_YEAR_COMPILER: DateCompiler = new NumberCompiler(2, date => date.weekOfWeekBasedYear);
//export const WEEK_MONTH_COMPILER: DateCompiler = new NumberCompiler(2, date => date.weekOfMonth);
export const DAY_OF_WEEK_TEXT_COMPILER: DateCompiler = new TextCompiler(3, "dayOfWeek", date => date.dayOfWeek.value - 1);
export const DAY_OF_WEEK_COMPILER: DateCompiler = new NumberTextCompiler(5, "dayOfWeek", date => date.dayOfWeek.value, -1);

export const DATE_COMPILERS: Dictionary<DateCompiler> = {
	G: ERA_COMPILER,
	u: YEAR_COMPILER,
	y: YEAR_OF_ERA_COMPILER,
	D: DAY_OF_YEAR_COMPILER,
	M: MONTH_OF_YEAR_COMPILER,
	L: MONTH_OF_YEAR_COMPILER,
	d: DAY_OF_MONTH_COMPILER,

	Q: QUARTER_OF_YEAR_COMPILER,
	q: QUARTER_OF_YEAR_COMPILER,
	Y: WEEK_BASED_YEAR_COMPILER,
	w: WEEK_OF_WEEK_BASED_YEAR_COMPILER,
	//W: WEEK_MONTH_COMPILER,
	//F: WEEK_MONTH_COMPILER,
	E: DAY_OF_WEEK_TEXT_COMPILER,
	e: DAY_OF_WEEK_COMPILER,
	c: DAY_OF_WEEK_COMPILER
};

class DateFormatter extends TemporalFormatter<LocalDate> {

	static of(components: TemporalFormatComponent<LocalDate>[]) {
		return new DateFormatter(components);
	}

	static ofPattern(pattern: string, compilers: Dictionary<DateCompiler> = DATE_COMPILERS) {
		return new DateFormatter(parsePattern(pattern, compilers));
	}
}

export default DateFormatter;
