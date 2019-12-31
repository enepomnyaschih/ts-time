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

import Duration, {HOUR_DURATION, MINUTE_DURATION, MS_DURATION, SECOND_DURATION} from "./Duration";
import LocalTime from "./LocalTime";

interface TimeField {

	get(time: LocalTime): number;

	getDuration(): Duration;
}

class HourField implements TimeField {

	get(time: LocalTime) {
		return time.hour;
	}

	getDuration(): Duration {
		return HOUR_DURATION;
	}
}

class Hour12Field implements TimeField {

	get(time: LocalTime) {
		return time.hour % 12;
	}

	getDuration(): Duration {
		return HOUR_DURATION;
	}
}

class MinuteField implements TimeField {

	get(time: LocalTime) {
		return time.minute;
	}

	getDuration(): Duration {
		return MINUTE_DURATION;
	}
}

class SecondField implements TimeField {

	get(time: LocalTime) {
		return time.second;
	}

	getDuration(): Duration {
		return SECOND_DURATION;
	}
}

class MsField implements TimeField {

	get(time: LocalTime) {
		return time.ms;
	}

	getDuration(): Duration {
		return MS_DURATION;
	}
}

export default TimeField;

export const HOUR_FIELD: TimeField = new HourField();
export const HOUR12_FIELD: TimeField = new Hour12Field();
export const MINUTE_FIELD: TimeField = new MinuteField();
export const SECOND_FIELD: TimeField = new SecondField();
export const MS_FIELD: TimeField = new MsField();
