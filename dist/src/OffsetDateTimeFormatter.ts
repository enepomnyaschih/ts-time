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

import {Enum, parsePattern} from "./_internal";
import {DATE_TIME_COMPILERS, DateTimeCompiler} from "./DateTimeFormatter";
import OffsetDateTime from "./OffsetDateTime";
import {OFFSET_COMPILERS, OffsetCompiler} from "./OffsetFormatter";
import {TemporalCompiler} from "./TemporalCompiler";
import {TemporalFormatComponent, TemporalFormatter} from "./TemporalFormatter";

export interface OffsetDateTimeCompiler extends TemporalCompiler<OffsetDateTime> {
}

// TODO: Extract AbstractDelegateCompiler
class DateTimeDelegateCompiler implements OffsetDateTimeCompiler {

	constructor(private delegated: DateTimeCompiler) {
	}

	get char() {
		return this.delegated.char;
	}

	get maxLength() {
		return this.delegated.maxLength;
	}

	compile(value: OffsetDateTime, length: number, context: any): string {
		return this.delegated.compile(value.dateTime, length, context);
	}
}

class OffsetDelegateCompiler implements OffsetDateTimeCompiler {

	constructor(private delegated: OffsetCompiler) {
	}

	get char() {
		return this.delegated.char;
	}

	get maxLength() {
		return this.delegated.maxLength;
	}

	compile(value: OffsetDateTime, length: number): string {
		return this.delegated.compile(value.offset, length);
	}
}

export const OFFSET_DATE_TIME_COMPILERS = new Enum<OffsetDateTimeCompiler>([
	...DATE_TIME_COMPILERS.array.map(delegated => new DateTimeDelegateCompiler(delegated)),
	...OFFSET_COMPILERS.array.map(delegated => new OffsetDelegateCompiler(delegated))
], compiler => compiler.char);

class OffsetDateTimeFormatter extends TemporalFormatter<OffsetDateTime> {

	static of(components: TemporalFormatComponent<OffsetDateTime>[]) {
		return new OffsetDateTimeFormatter(components);
	}

	static ofPattern(pattern: string, compilers: Enum<OffsetDateTimeCompiler> = OFFSET_DATE_TIME_COMPILERS) {
		return new OffsetDateTimeFormatter(parsePattern(pattern, compilers));
	}
}

export default OffsetDateTimeFormatter;
