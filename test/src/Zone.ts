import Instant from "../../core/src/Instant";
import LocalDateTime from "../../core/src/LocalDateTime";
import {UTC, ZoneId, ZoneOffset} from "../../core/src/Zone";

describe("ZoneOffset", () => {
	// TODO: Initialize values in beforeAll
	const instant = Instant.fromNative(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4))),
		dateTime = LocalDateTime.fromNativeUtc(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4))),
		p12345 = ZoneOffset.ofTotalSeconds(12345),
		m12345 = ZoneOffset.ofTotalSeconds(-12345);

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

	it("should normalize ID and return cached instances by ID", () => {
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

	// TODO: Test compare
});

describe("ZoneId", () => {
	// TODO: Initialize values in beforeAll
	const utcp3 = ZoneId.of("UTC+3"),
		utcm3 = ZoneId.of("UTC-3"),
		utp3 = ZoneId.of("UT+3"),
		utm3 = ZoneId.of("UT-3"),
		gmtp3 = ZoneId.of("GMT+3"),
		gmtm3 = ZoneId.of("GMT-3"),
		omsk = ZoneId.of("Asia/Omsk"),
		berlin = ZoneId.of("Europe/Berlin"),
		newYork = ZoneId.of("America/New_York"),
		winterInstant = Instant.fromNative(new Date(Date.UTC(2019, 1, 5, 1, 2, 3, 4))),
		summerInstant = Instant.fromNative(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4))),
		winterDateTime = LocalDateTime.fromNativeUtc(new Date(Date.UTC(2019, 1, 5, 1, 2, 3, 4))),
		summerDateTime = LocalDateTime.fromNativeUtc(new Date(Date.UTC(2019, 6, 5, 1, 2, 3, 4)));

	it("should get parsed as offset", () => {
		expect(ZoneId.of("")).toBe(UTC);
		expect(ZoneId.of("+3")).toBe(ZoneOffset.of("+3"));
		expect(ZoneId.of("+03")).toBe(ZoneOffset.of("+03"));
		expect(ZoneId.of("-3")).toBe(ZoneOffset.of("-3"));
		expect(ZoneId.of("-03")).toBe(ZoneOffset.of("-03"));
		expect(ZoneId.of("+0300")).toBe(ZoneOffset.of("+0300"));
		expect(ZoneId.of("-0300")).toBe(ZoneOffset.of("-0300"));
		expect(ZoneId.of("+03:00")).toBe(ZoneOffset.of("+03:00"));
		expect(ZoneId.of("-03:00")).toBe(ZoneOffset.of("-03:00"));
		expect(ZoneId.of("+030000")).toBe(ZoneOffset.of("+030000"));
		expect(ZoneId.of("-030000")).toBe(ZoneOffset.of("-030000"));
		expect(ZoneId.of("+03:00:00")).toBe(ZoneOffset.of("+03:00:00"));
		expect(ZoneId.of("-03:00:00")).toBe(ZoneOffset.of("-03:00:00"));
		expect(ZoneId.of("+0325")).toBe(ZoneOffset.of("+0325"));
		expect(ZoneId.of("-0325")).toBe(ZoneOffset.of("-0325"));
		expect(ZoneId.of("+03:25")).toBe(ZoneOffset.of("+03:25"));
		expect(ZoneId.of("-03:25")).toBe(ZoneOffset.of("-03:25"));
		expect(ZoneId.of("+032545")).toBe(ZoneOffset.of("+032545"));
		expect(ZoneId.of("-032545")).toBe(ZoneOffset.of("-032545"));
		expect(ZoneId.of("+03:25:45")).toBe(ZoneOffset.of("+03:25:45"));
		expect(ZoneId.of("-03:25:45")).toBe(ZoneOffset.of("-03:25:45"));
	});

	it("should have id", () => {
		expect(utcp3.id).toBe("UTC+3");
		expect(utcm3.id).toBe("UTC-3");
		expect(utp3.id).toBe("UT+3");
		expect(utm3.id).toBe("UT-3");
		expect(gmtp3.id).toBe("GMT+3");
		expect(gmtm3.id).toBe("GMT-3");
		expect(omsk.id).toBe("Asia/Omsk");
		expect(berlin.id).toBe("Europe/Berlin");
		expect(newYork.id).toBe("America/New_York");
	});

	it("should return fixed offset by instant", () => {
		expect(utcp3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("+3"));
		expect(utcm3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("-3"));
		expect(utp3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("+3"));
		expect(utm3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("-3"));
		expect(gmtp3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("+3"));
		expect(gmtm3.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("-3"));
	});

	it("should return non-DST offset by instant", () => {
		expect(omsk.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("+6"));
		expect(berlin.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("+1"));
		expect(newYork.offsetAtInstant(winterInstant)).toBe(ZoneOffset.of("-2"));
	});

	it("should return DST offset by instant", () => {
		expect(omsk.offsetAtInstant(summerInstant)).toBe(ZoneOffset.of("+7"));
		expect(berlin.offsetAtInstant(summerInstant)).toBe(ZoneOffset.of("+2"));
		expect(newYork.offsetAtInstant(summerInstant)).toBe(ZoneOffset.of("-1"));
	});

	it("should return edge offset by instant", () => {
		// TODO: Test right before and after DST change
	});

	it("should return fixed offset by local date/time", () => {
		expect(utcp3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("+3"));
		expect(utcm3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("-3"));
		expect(utp3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("+3"));
		expect(utm3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("-3"));
		expect(gmtp3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("+3"));
		expect(gmtm3.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("-3"));
	});

	it("should return non-DST offset by local date/time", () => {
		expect(omsk.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("+6"));
		expect(berlin.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("+1"));
		expect(newYork.offsetAtLocalDateTime(winterDateTime)).toBe(ZoneOffset.of("-2"));
	});

	it("should return DST offset by local date/time", () => {
		expect(omsk.offsetAtLocalDateTime(summerDateTime)).toBe(ZoneOffset.of("+7"));
		expect(berlin.offsetAtLocalDateTime(summerDateTime)).toBe(ZoneOffset.of("+2"));
		expect(newYork.offsetAtLocalDateTime(summerDateTime)).toBe(ZoneOffset.of("-1"));
	});

	it("should prefer earlier instant by local date/time", () => {
		// TODO: Test in an hour of DST change
	});
});
