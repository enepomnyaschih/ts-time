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
import {TemporalCompiler} from "./TemporalCompiler";
import {TemporalFormatComponent, TemporalFormatter} from "./TemporalFormatter";
import {ZoneOffset} from "./Zone";

export class OffsetCompiler implements TemporalCompiler<ZoneOffset> {

	constructor(readonly char: string, private zeroZ: boolean) {
	}

	get maxLength() {
		return 5;
	}

	compile(value: ZoneOffset, length: number): string {
		if (this.zeroZ && value.totalSeconds === 0) {
			return "Z";
		}
		const {hours, minutes, seconds} = value;
		switch (length) {
			case 1:
				return pad(hours, 2, true) + (minutes ? pad(minutes, 2) : "");
			case 2:
				return pad(hours, 2, true) + pad(minutes, 2);
			case 3:
				return pad(hours, 2, true) + ":" + pad(minutes, 2);
			case 4:
				return pad(hours, 2, true) + pad(minutes, 2) + (seconds ? pad(seconds, 2) : "");
			case 5:
				return pad(hours, 2, true) + pad(minutes, 2) + pad(seconds, 2);
			default:
				return null;
		}
	}
}

export const OFFSET_COMPILERS = new Enum<OffsetCompiler>([
	new OffsetCompiler("X", true),
	new OffsetCompiler("x", false)
], compiler => compiler.char);

class OffsetFormatter extends TemporalFormatter<ZoneOffset> {

	static of(components: TemporalFormatComponent<ZoneOffset>[]) {
		return new OffsetFormatter(components);
	}

	static ofPattern(pattern: string, compilers: Enum<OffsetCompiler> = OFFSET_COMPILERS) {
		return new OffsetFormatter(parsePattern(pattern, compilers));
	}
}

export default OffsetFormatter;
