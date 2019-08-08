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

import {Enum} from "../_internal";
import {TemporalCompiler} from "./TemporalCompiler";
import {CompiledFormatComponent, LiteralFormatComponent, TemporalFormatComponent} from "./TemporalFormatter";

export function parsePattern<T>(pattern: string, compilers: Enum<TemporalCompiler<T>>) {
	const components: TemporalFormatComponent<T>[] = [];
	let index = 0;
	let literal = "";
	let escape = false;
	while (index < pattern.length) {
		const char = pattern.charAt(index);
		if (!escape) {
			const compiler = compilers.dict[char];
			if (compiler) {
				if (literal) {
					components.push(new LiteralFormatComponent<T>(literal));
					literal = "";
				}
				let length = 1;
				while (length < compiler.maxLength && pattern.charAt(index + length) === compiler.char) {
					++length;
				}
				components.push(new CompiledFormatComponent<T>(compiler, length));
				index += length;
				continue;
			}
		}
		if (char !== "'") {
			literal += char;
			++index;
			continue;
		}
		const next = pattern.charAt(index + 1);
		if (next === "'") {
			literal += "'";
			index += 2;
			continue;
		}
		escape = !escape;
		++index;
	}
	if (literal) {
		components.push(new LiteralFormatComponent<T>(literal));
	}
	return components;
}
