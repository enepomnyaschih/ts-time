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

import {Enum} from "ts-time/_internal";
import LocalDate from "ts-time/LocalDate";
import LocalDateTime from "ts-time/LocalDateTime";
import LocalTime from "ts-time/LocalTime";
import {DATE_COMPILERS} from "./DateFormatter";
import {TemporalCompiler} from "./TemporalCompiler";
import TemporalFormatter, {TemporalFormatComponent} from "./TemporalFormatter";
import {TIME_COMPILERS} from "./TimeFormatter";
import {parsePattern} from "./utils";

export interface DateTimeCompiler extends TemporalCompiler<LocalDateTime> {
}

abstract class AbstractDelegateCompiler<T> implements DateTimeCompiler {

	constructor(private delegated: TemporalCompiler<T>) {
	}

	get char() {
		return this.delegated.char;
	}

	get maxLength() {
		return this.delegated.maxLength;
	}

	abstract getDelegatedValue(value: LocalDateTime): T;

	compile(value: LocalDateTime, length: number, context: any): string {
		return this.delegated.compile(this.getDelegatedValue(value), length, context);
	}
}

class DateDelegateCompiler extends AbstractDelegateCompiler<LocalDate> {

	getDelegatedValue(value: LocalDateTime): LocalDate {
		return value.date;
	}
}

class TimeDelegateCompiler extends AbstractDelegateCompiler<LocalTime> {

	getDelegatedValue(value: LocalDateTime): LocalTime {
		return value.time;
	}
}

export const DATE_TIME_COMPILERS = new Enum<DateTimeCompiler>([
	...DATE_COMPILERS.array.map(delegated => new DateDelegateCompiler(delegated)),
	...TIME_COMPILERS.array.map(delegated => new TimeDelegateCompiler(delegated))
], compiler => compiler.char);

class DateTimeFormatter extends TemporalFormatter<LocalDateTime> {

	static of(components: TemporalFormatComponent<LocalDateTime>[]) {
		return new DateTimeFormatter(components);
	}

	static ofPattern(pattern: string, compilers: Enum<DateTimeCompiler> = DATE_TIME_COMPILERS) {
		return new DateTimeFormatter(parsePattern(pattern, compilers));
	}
}

export default DateTimeFormatter;
