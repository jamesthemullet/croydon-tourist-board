import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const vercelJsonPath = fileURLToPath(new URL("../vercel.json", import.meta.url));
const config = JSON.parse(readFileSync(vercelJsonPath, "utf-8"));

describe("vercel.json security headers", () => {
	it("applies a headers rule to every route", () => {
		expect(Array.isArray(config.headers)).toBe(true);
		const rule = config.headers.find((entry: { source: string }) => entry.source === "/(.*)");
		expect(rule).toBeTruthy();
	});

	it("sets the expected security headers", () => {
		const rule = config.headers.find((entry: { source: string }) => entry.source === "/(.*)");
		const keys = rule.headers.map((header: { key: string }) => header.key);

		expect(keys).toContain("Strict-Transport-Security");
		expect(keys).toContain("X-Content-Type-Options");
		expect(keys).toContain("Referrer-Policy");
		expect(keys).toContain("Content-Security-Policy");
	});

	it("sets X-Content-Type-Options to nosniff", () => {
		const rule = config.headers.find((entry: { source: string }) => entry.source === "/(.*)");
		const header = rule.headers.find((entry: { key: string }) => entry.key === "X-Content-Type-Options");
		expect(header.value).toBe("nosniff");
	});
});
