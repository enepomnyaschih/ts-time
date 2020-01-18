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

import ZonedDateTime from "ts-time/ZonedDateTime";
import {Dictionary} from "ts-time/_internal";
import {mapDictionary} from "./_internal";
import {DATE_TIME_COMPILERS, DateTimeCompiler} from "./DateTimeFormatter";
import {OFFSET_COMPILERS, OffsetCompiler} from "./OffsetFormatter";
import {TemporalCompiler} from "./TemporalCompiler";
import TemporalFormatter, {TemporalFormatComponent} from "./TemporalFormatter";
import {parsePattern} from "./utils";

export interface ZonedDateTimeCompiler extends TemporalCompiler<ZonedDateTime> {
}

class DateTimeDelegateCompiler implements ZonedDateTimeCompiler {

	constructor(private delegated: DateTimeCompiler) {
	}

	get maxLength() {
		return this.delegated.maxLength;
	}

	compile(value: ZonedDateTime, length: number, context: any): string {
		return this.delegated.compile(value.dateTime, length, context);
	}
}

class OffsetDelegateCompiler implements ZonedDateTimeCompiler {

	constructor(private delegated: OffsetCompiler) {
	}

	get maxLength() {
		return this.delegated.maxLength;
	}

	compile(value: ZonedDateTime, length: number, context: any): string {
		return this.delegated.compile(value.offset, length, context);
	}
}

class ZoneIdCompiler implements ZonedDateTimeCompiler {

	get maxLength() {
		return 1;
	}

	compile(value: ZonedDateTime, _length: number, _context: any): string {
		return value.zone.id;
	}

}

export const ZONE_ID_COMPILER: ZonedDateTimeCompiler = new ZoneIdCompiler();

export const ZONED_DATE_TIME_COMPILERS: Dictionary<ZonedDateTimeCompiler> = {
	...mapDictionary(DATE_TIME_COMPILERS, delegated => new DateTimeDelegateCompiler(delegated)),
	...mapDictionary(OFFSET_COMPILERS, delegated => new OffsetDelegateCompiler(delegated)),
	V: ZONE_ID_COMPILER
};

class ZonedDateTimeFormatter extends TemporalFormatter<ZonedDateTime> {

	static of(components: TemporalFormatComponent<ZonedDateTime>[]) {
		return new ZonedDateTimeFormatter(components);
	}

	static ofPattern(pattern: string, compilers: Dictionary<ZonedDateTimeCompiler> = ZONED_DATE_TIME_COMPILERS) {
		return new ZonedDateTimeFormatter(parsePattern(pattern, compilers));
	}
}

export default ZonedDateTimeFormatter;
