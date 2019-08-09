import Instant from "../../core/src/Instant";
import LocalDateTime from "../../core/src/LocalDateTime";
import {UTC, ZoneOffset} from "../../core/src/Zone";

describe("ZoneOffset", () => {
	const instant = Instant.fromNative(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4)));
	const dateTime = LocalDateTime.fromNativeUtc(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4)));
	const p12345 = ZoneOffset.ofTotalSeconds(12345);
	const m12345 = ZoneOffset.ofTotalSeconds(-12345);

	it("should have id", () => {
		expect(UTC.id).toBe("Z");
		expect(p12345.id).toBe("+03:25:45");
		expect(m12345.id).toBe("-03:25:45");
	});

	it("should return itself by instant", () => {
		expect(UTC.offsetAtInstant(instant)).toBe(UTC);
		expect(p12345.offsetAtInstant(instant)).toBe(p12345);
		expect(m12345.offsetAtInstant(instant)).toBe(m12345);
	});

	it("should return itself by local date/time", () => {
		expect(UTC.offsetAtLocalDateTime(dateTime)).toBe(UTC);
		expect(p12345.offsetAtLocalDateTime(dateTime)).toBe(p12345);
		expect(m12345.offsetAtLocalDateTime(dateTime)).toBe(m12345);
	});

	it("should return total seconds", () => {
		expect(UTC.totalSeconds).toBe(0);
		expect(p12345.totalSeconds).toBe(12345);
		expect(m12345.totalSeconds).toBe(-12345);
	});

	it("should return hours", () => {
		expect(UTC.hours).toBe(0);
		expect(p12345.hours).toBe(3);
		expect(m12345.hours).toBe(-3);
	});

	it("should return minutes", () => {
		expect(UTC.minutes).toBe(0);
		expect(p12345.minutes).toBe(25);
		expect(m12345.minutes).toBe(25);
	});

	it("should return seconds", () => {
		expect(UTC.seconds).toBe(0);
		expect(p12345.seconds).toBe(45);
		expect(m12345.seconds).toBe(45);
	});

	it("should return cached instances by ID", () => {
		expect(ZoneOffset.of("")).toBe(UTC);
		expect(ZoneOffset.of("+032545")).toBe(p12345);
		expect(ZoneOffset.of("-032545")).toBe(m12345);
		expect(ZoneOffset.of("+03:25:45")).toBe(p12345);
		expect(ZoneOffset.of("-03:25:45")).toBe(m12345);
	});

	it("should return cached instances by total seconds", () => {
		expect(ZoneOffset.ofTotalSeconds(0)).toBe(UTC);
		expect(ZoneOffset.ofTotalSeconds(12345)).toBe(p12345);
		expect(ZoneOffset.ofTotalSeconds(-12345)).toBe(m12345);
	});

	it("should get parsed from string", () => {
		expect(ZoneOffset.of("+3").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("+03").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("-3").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("-03").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("+0300").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("-0300").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("+03:00").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("-03:00").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("+030000").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("-030000").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("+03:00:00").totalSeconds).toBe(10800);
		expect(ZoneOffset.of("-03:00:00").totalSeconds).toBe(-10800);
		expect(ZoneOffset.of("+0325").totalSeconds).toBe(12300);
		expect(ZoneOffset.of("-0325").totalSeconds).toBe(-12300);
		expect(ZoneOffset.of("+03:25").totalSeconds).toBe(12300);
		expect(ZoneOffset.of("-03:25").totalSeconds).toBe(-12300);
		expect(ZoneOffset.of("+032545").totalSeconds).toBe(12345);
		expect(ZoneOffset.of("-032545").totalSeconds).toBe(-12345);
		expect(ZoneOffset.of("+03:25:45").totalSeconds).toBe(12345);
		expect(ZoneOffset.of("-03:25:45").totalSeconds).toBe(-12345);
	});
});
