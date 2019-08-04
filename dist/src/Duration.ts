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

import {MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE, MS_PER_SECOND, MS_PER_WEEK} from "./constants";

class Duration {

	private constructor(readonly ms: number) {
	}

	multiply(multiplier: number): Duration {
		return Duration.ofMs(this.ms * multiplier);
	}

	static of(value: number | Duration) {
		return typeof value === "number" ? new Duration(value) : value;
	}

	static ofMs(ms: number) {
		return new Duration(ms);
	}

	static ofSeconds(seconds: number) {
		return new Duration(seconds * MS_PER_SECOND);
	}

	static ofMinutes(minutes: number) {
		return new Duration(minutes * MS_PER_MINUTE);
	}

	static ofHours(hours: number) {
		return new Duration(hours * MS_PER_HOUR);
	}

	static ofDays(days: number) {
		return new Duration(days * MS_PER_DAY);
	}

	static ofWeeks(weeks: number) {
		return new Duration(weeks * MS_PER_WEEK);
	}
}

export const NULL_DURATION = Duration.ofMs(0);
export const MS_DURATION = Duration.ofMs(1);
export const SECOND_DURATION = Duration.ofMs(MS_PER_SECOND);
export const MINUTE_DURATION = Duration.ofMs(MS_PER_MINUTE);
export const HOUR_DURATION = Duration.ofMs(MS_PER_HOUR);
export const DAY_DURATION = Duration.ofMs(MS_PER_DAY);
export const WEEK_DURATION = Duration.ofMs(MS_PER_WEEK);

export default Duration;
