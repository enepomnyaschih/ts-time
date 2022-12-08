/*
MIT License

Copyright (c) 2022 Egor Nepomnyaschih

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

export class TemporalError extends Error {
}

export class TemporalParsingError extends TemporalError {
	constructor(readonly str: string, readonly cls: string, readonly reason: string) {
		super(`Unable to parse '${str}' as ${cls}. ${reason}`);
	}

	static ofLocalDate(str: string, reason: string) {
		return new TemporalParsingError(str, "a local date", reason);
	}

	static ofLocalTime(str: string, reason: string) {
		return new TemporalParsingError(str, "local time", reason);
	}

	static ofLocalDateTime(str: string, reason: string) {
		return new TemporalParsingError(str, "local date/time", reason)
	}

	static ofOffsetDateTime(str: string, reason: string) {
		return new TemporalParsingError(str, "date/time with offset", reason);
	}

	static ofZonedDateTime(str: string, reason: string) {
		return new TemporalParsingError(str, "date/time with zone", reason);
	}

	static ofInstant(str: string, reason: string) {
		return new TemporalParsingError(str, "an instant", reason);
	}

	static ofZoneOffset(str: string, reason: string) {
		return new TemporalParsingError(str, "a time zone offset", reason);
	}
}

export class InvalidTemporalFormatError extends TemporalError {
	constructor(readonly expectedFormat: string) {
		super(InvalidTemporalFormatError.getMessage(expectedFormat));
	}

	static getMessage(expectedFormat: string) {
		return `ISO 8601 ${expectedFormat} expected.`;
	}
}

export class InvalidTimeZoneError extends TemporalError {
	constructor(readonly id: string) {
		super(`Invalid or unrecognized time zone ID or offset: '${id}'.`);
	}
}

export class MismatchingOffsetError extends TemporalError {
	constructor(readonly offset: string, readonly zonedDateTime: string) {
		super(`Date/time ${zonedDateTime} has an offset different from ${offset}.`);
	}
}

export class InvalidDayOfWeekError extends TemporalError {
	constructor(readonly value: number) {
		super(`Invalid day of week: ${value}.`);
	}
}

export class InvalidMonthError extends TemporalError {
	constructor(readonly value: number) {
		super(`Invalid month: ${value}.`);
	}
}
