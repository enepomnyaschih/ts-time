import Duration from "../../core/src/Duration";

describe("Duration", () => {
	it("should support various constructors", () => {
		const d = Duration.of(12345);
		expect(d.ms).toBe(12345);
		expect(Duration.of(d)).toBe(d);

		expect(Duration.ofMs(12345).ms).toBe(12345);
		expect(Duration.ofSeconds(12).ms).toBe(12000);
		expect(Duration.ofMinutes(12).ms).toBe(720000);
		expect(Duration.ofHours(12).ms).toBe(43200000);
		expect(Duration.ofDays(12).ms).toBe(1036800000);
		expect(Duration.ofWeeks(12).ms).toBe(7257600000);
		expect(Duration.ofComponents(1, 2, 3, 4, 5).ms).toBe(93784005);
	});

	it("should return null by null", () => {
		expect(Duration.of(null)).toBeNull();
	});

	it("should multiply itself", () => {
		expect(Duration.ofSeconds(12).multiply(5).ms).toBe(60000);
	});

	it("should add milliseconds", () => {
		expect(Duration.of(123).plus(456).ms).toBe(579);
		expect(Duration.of(456).plus(-123).ms).toBe(333);
	});

	it("should add duration", () => {
		expect(Duration.of(123).plus(Duration.of(456)).ms).toBe(579);
		expect(Duration.of(456).plus(Duration.of(-123)).ms).toBe(333);
	});

	it("should subtract milliseconds", () => {
		expect(Duration.of(456).minus(123).ms).toBe(333);
		expect(Duration.of(456).minus(-123).ms).toBe(579);
	});

	it("should subtract duration", () => {
		expect(Duration.of(456).minus(Duration.of(123)).ms).toBe(333);
		expect(Duration.of(456).minus(Duration.of(-123)).ms).toBe(579);
	});
});
