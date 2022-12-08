/*
MIT License

Copyright (c) 2019-2022 Egor Nepomnyaschih

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

import {TemporalCompiler} from "./TemporalCompiler";

export interface TemporalFormatComponent<T> {
	write(value: T, context: any): string;
}

export class LiteralFormatComponent<T> implements TemporalFormatComponent<T> {

	constructor(private literal: string) {
	}

	write(): string {
		return this.literal;
	}
}

export class CompiledFormatComponent<T> implements TemporalFormatComponent<T> {

	constructor(private compiler: TemporalCompiler<T>, private length: number) {
	}

	write(value: T, context: any): string {
		return this.compiler.compile(value, this.length, context);
	}
}

export default class TemporalFormatter<T> {

	constructor(private components: TemporalFormatComponent<T>[]) {
	}

	format(value: T, context?: any): string {
		return this.components.reduce((acc, component) => acc + component.write(value, context), "");
	}
}
