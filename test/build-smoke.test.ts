import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const distDir = path.join(rootDir, "dist");
const attractionSlugs = readdirSync(
	path.join(rootDir, "src/pages/attractions"),
)
	.filter((file) => file.endsWith(".astro"))
	.map((file) => file.replace(/\.astro$/, ""));

beforeAll(() => {
	execFileSync("yarn", ["build"], { cwd: rootDir, stdio: "pipe" });
}, 120_000);

describe("production build output", () => {
	it("generates the homepage", () => {
		expect(existsSync(path.join(distDir, "index.html"))).toBe(true);
	});

	it("generates the sitemap", () => {
		expect(existsSync(path.join(distDir, "sitemap-index.xml"))).toBe(true);
		expect(existsSync(path.join(distDir, "sitemap-0.xml"))).toBe(true);
	});

	it("generates every attraction route", () => {
		expect(attractionSlugs.length).toBeGreaterThan(0);
		for (const slug of attractionSlugs) {
			const pageFile = path.join(distDir, "attractions", slug, "index.html");
			expect(
				existsSync(pageFile),
				`expected ${pageFile} to exist for attraction "${slug}"`,
			).toBe(true);
		}
	});
});
