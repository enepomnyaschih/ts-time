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

export function isLeapYear(year: number) {
	return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
}

export function isTimeZoneSupport() {
	return typeof window === "undefined" || !(<any>window.document).documentMode;
}

export function requireTimeZoneSupport() {
	if (isTimeZoneSupport()) {
		return true;
	}
	if (supportWarning) {
		supportWarning = false;
		console.warn("This browser doesn't support IANA time zone library. "
			+ "All local time zones will have constant zero offset.")
	}
	return false;
}

let supportWarning = true;
