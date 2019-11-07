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
	});

	it("should return null by null", () => {
		expect(Duration.of(null)).toBeNull();
	});

	it("should multiply itself", () => {
		expect(Duration.ofSeconds(12).multiply(5).ms).toBe(60000);
	});
});
