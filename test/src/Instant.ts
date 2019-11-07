import Instant from "../../core/src/Instant";
import {ZoneOffset} from "../../core/src/Zone";

describe("Instant", () => {
	it("should construct itself", () => {
		expect(Instant.ofEpochMs(123456789).epochMs).toBe(123456789);
		expect(Instant.fromNative(new Date(123456789)).epochMs).toBe(123456789);
		expect(Math.abs(Instant.now().epochMs - new Date().getTime())).toBeLessThan(100);
	});

	it("should return native date", () => {
		expect(Instant.ofEpochMs(123456789).native.getTime()).toBe(123456789);
	});

	it("should return offset date/time", () => {
		expect(Instant.fromNative(new Date(Date.UTC(2019, 8, 10, 10))).atOffset(ZoneOffset.of("+3")).toString())
			.toBe("2019-09-10T13:00:00.000+03:00");
	});
});
