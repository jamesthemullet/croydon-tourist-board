import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const headersPath = fileURLToPath(new URL("../public/_headers", import.meta.url));
const lines = readFileSync(headersPath, "utf-8").split("\n");

const allRoutesIndex = lines.findIndex((line) => line.trim() === "/*");
const headers = new Map<string, string>();
for (const line of lines.slice(allRoutesIndex + 1)) {
	if (!/^\s/.test(line) || !line.trim()) break;
	const [key, ...value] = line.trim().split(":");
	headers.set(key, value.join(":").trim());
}

describe("Cloudflare _headers security headers", () => {
	it("applies a headers rule to every route", () => {
		expect(allRoutesIndex).toBeGreaterThanOrEqual(0);
	});

	it("sets the expected security headers", () => {
		expect(headers.has("Strict-Transport-Security")).toBe(true);
		expect(headers.has("X-Content-Type-Options")).toBe(true);
		expect(headers.has("Referrer-Policy")).toBe(true);
		expect(headers.has("Content-Security-Policy")).toBe(true);
	});

	it("sets X-Content-Type-Options to nosniff", () => {
		expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
	});
});
