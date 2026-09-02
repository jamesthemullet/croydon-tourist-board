import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const indexPath = fileURLToPath(new URL("../src/pages/index.astro", import.meta.url));
const source = readFileSync(indexPath, "utf-8");

const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/);
if (!frontmatterMatch) {
	throw new Error("Could not locate frontmatter in index.astro");
}
const frontmatter = frontmatterMatch[1];
const attractionBlocks =
	frontmatter.match(/\{[^{}]*href:\s*'[^']+'[^{}]*\}/g) ?? [];

describe("homepage attractions list", () => {
	it("defines at least one attraction", () => {
		expect(attractionBlocks.length).toBeGreaterThan(0);
	});

	it("every internal attraction href resolves to a page file under src/pages/attractions", () => {
		for (const block of attractionBlocks) {
			const href = block.match(/href:\s*'([^']+)'/)?.[1];
			const isExternal = /external:\s*true/.test(block);

			expect(href).toBeTruthy();

			if (isExternal) {
				expect(href).toMatch(/^https?:\/\//);
				continue;
			}

			expect(href).toMatch(/^\/attractions\//);
			const slug = href?.replace(/^\/attractions\//, "");
			const pageFile = path.join(
				path.dirname(indexPath),
				"attractions",
				`${slug}.astro`,
			);
			expect(
				existsSync(pageFile),
				`expected ${pageFile} to exist for href ${href}`,
			).toBe(true);
		}
	});
});
