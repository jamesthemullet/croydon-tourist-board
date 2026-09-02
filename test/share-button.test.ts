import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const attractionsDir = fileURLToPath(
	new URL("../src/pages/attractions", import.meta.url),
);
const attractionFiles = readdirSync(attractionsDir).filter((file) =>
	file.endsWith(".astro"),
);

describe("attraction page share buttons", () => {
	it("finds at least one attraction page to check", () => {
		expect(attractionFiles.length).toBeGreaterThan(0);
	});

	for (const file of attractionFiles) {
		it(`${file} imports and renders ShareButton`, () => {
			const source = readFileSync(
				path.join(attractionsDir, file),
				"utf-8",
			);

			expect(source).toMatch(
				/import ShareButton from ['"]\.\.\/\.\.\/components\/ShareButton\.astro['"]/,
			);
			expect(source).toMatch(/<ShareButton\b/);
		});
	}
});
