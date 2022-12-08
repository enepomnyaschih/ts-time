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
