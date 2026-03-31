/**
 * Generate Search Index
 *
 * Scans reference MDX files, AG-UI content, and registry data to produce
 * a search index JSON for the shell's Cmd-K search modal.
 *
 * Usage: npx tsx showcase/scripts/generate-search-index.ts
 *
 * Output: showcase/shell/src/data/search-index.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SHELL_DIR = path.join(ROOT, "shell", "src");
const OUTPUT_PATH = path.join(SHELL_DIR, "data", "search-index.json");

interface SearchEntry {
    type: "page" | "reference" | "ag-ui";
    title: string;
    subtitle: string;
    href: string;
}

function extractTitle(content: string, filename: string): string {
    // Try frontmatter title
    const fmMatch = content.match(/^---[\s\S]*?title:\s*["']?(.+?)["']?\s*$/m);
    if (fmMatch) return fmMatch[1];

    // Try first heading
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) return h1Match[1];

    // Fall back to filename
    return filename.replace(".mdx", "").replace(/-/g, " ");
}

function extractDescription(content: string): string {
    // Strip frontmatter
    const stripped = content.replace(/^---[\s\S]*?---\n?/, "");
    // Strip headings and find first paragraph
    const lines = stripped.split("\n").filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("import") && !l.startsWith("<") && !l.startsWith("```"));
    const first = lines[0]?.trim() || "";
    return first.slice(0, 120);
}

function scanMdxDir(
    dir: string,
    hrefPrefix: string,
    type: "reference" | "ag-ui"
): SearchEntry[] {
    const entries: SearchEntry[] = [];

    function walk(currentDir: string, pathPrefix: string) {
        if (!fs.existsSync(currentDir)) return;
        const items = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory()) {
                walk(
                    path.join(currentDir, item.name),
                    `${pathPrefix}/${item.name}`
                );
            } else if (item.name.endsWith(".mdx")) {
                const slug = item.name.replace(".mdx", "");
                const href =
                    slug === "index"
                        ? hrefPrefix + pathPrefix
                        : `${hrefPrefix}${pathPrefix}/${slug}`;

                const content = fs.readFileSync(
                    path.join(currentDir, item.name),
                    "utf-8"
                );
                const title = extractTitle(content, item.name);
                const subtitle = extractDescription(content);

                entries.push({ type, title, subtitle, href });
            }
        }
    }

    walk(dir, "");
    return entries;
}

function main() {
    const entries: SearchEntry[] = [];

    // Static pages
    entries.push(
        { type: "page", title: "Home", subtitle: "Front door", href: "/" },
        { type: "page", title: "Integrations", subtitle: "All integrations", href: "/integrations" },
        { type: "page", title: "Feature Matrix", subtitle: "Compare features across integrations", href: "/matrix" },
        { type: "page", title: "API Reference", subtitle: "CopilotKit components and hooks", href: "/reference" },
        { type: "page", title: "AG-UI Overview", subtitle: "The Agent-User Interaction Protocol", href: "/ag-ui" }
    );

    // CopilotKit Reference
    const refDir = path.join(SHELL_DIR, "content", "reference");
    if (fs.existsSync(refDir)) {
        const refEntries = scanMdxDir(refDir, "/reference", "reference");
        entries.push(...refEntries);
        console.log(`  Reference: ${refEntries.length} entries`);
    }

    // AG-UI docs
    const aguiDir = path.join(SHELL_DIR, "content", "ag-ui");
    if (fs.existsSync(aguiDir)) {
        const aguiEntries = scanMdxDir(aguiDir, "/ag-ui", "ag-ui");
        entries.push(...aguiEntries);
        console.log(`  AG-UI: ${aguiEntries.length} entries`);
    }

    // Write
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2) + "\n");
    console.log(`\nSearch index: ${OUTPUT_PATH} (${entries.length} entries)`);
}

main();
