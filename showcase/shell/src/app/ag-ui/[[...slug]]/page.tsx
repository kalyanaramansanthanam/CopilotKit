import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Callout, Cards, Card, Accordions, Accordion } from "@/components/mdx-components";
import { PropertyReference } from "@/components/property-reference";

const CONTENT_DIR = path.join(process.cwd(), "src/content/ag-ui");

// Build sidebar nav from the file system
function getNavItems(): { section: string; items: { slug: string; title: string }[] }[] {
    const sections: Record<string, { slug: string; title: string }[]> = {
        "Getting Started": [],
        "Concepts": [],
        "Quick Start": [],
        "Drafts": [],
        "SDK — JavaScript": [],
        "SDK — Python": [],
        "SDK — Go": [],
        "Tutorials": [],
        "Development": [],
    };

    function scanDir(dir: string, prefix: string = "") {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isFile() && entry.name.endsWith(".mdx")) {
                const slug = prefix
                    ? `${prefix}/${entry.name.replace(".mdx", "")}`
                    : entry.name.replace(".mdx", "");
                const raw = fs.readFileSync(path.join(dir, entry.name), "utf-8");
                const titleMatch = raw.match(/^#\s+(.+)$/m) || raw.match(/title:\s*["']?(.+?)["']?\s*$/m);
                const title = titleMatch?.[1] || entry.name.replace(".mdx", "").replace(/-/g, " ");

                if (prefix.startsWith("concepts")) sections["Concepts"].push({ slug, title });
                else if (prefix.startsWith("quickstart")) sections["Quick Start"].push({ slug, title });
                else if (prefix.startsWith("drafts")) sections["Drafts"].push({ slug, title });
                else if (prefix.startsWith("sdk/js")) sections["SDK — JavaScript"].push({ slug, title });
                else if (prefix.startsWith("sdk/python")) sections["SDK — Python"].push({ slug, title });
                else if (prefix.startsWith("sdk/go")) sections["SDK — Go"].push({ slug, title });
                else if (prefix.startsWith("tutorials")) sections["Tutorials"].push({ slug, title });
                else if (prefix.startsWith("development")) sections["Development"].push({ slug, title });
                else sections["Getting Started"].push({ slug, title });
            } else if (entry.isDirectory()) {
                scanDir(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
            }
        }
    }

    scanDir(CONTENT_DIR);
    return Object.entries(sections)
        .filter(([, items]) => items.length > 0)
        .map(([section, items]) => ({ section, items }));
}

const components = {
    Callout,
    Cards,
    Card,
    Accordions,
    Accordion,
    PropertyReference,
    Note: Callout,
    Warning: ({ children }: { children: React.ReactNode }) => (
        <Callout type="warn">{children}</Callout>
    ),
    Tip: ({ children }: { children: React.ReactNode }) => (
        <Callout type="info">{children}</Callout>
    ),
    // Mintlify components we shim
    CardGroup: Cards,
    Steps: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Step: ({ children, title }: { children: React.ReactNode; title?: string }) => (
        <div style={{ marginBottom: "1rem" }}>
            {title && <h4 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{title}</h4>}
            {children}
        </div>
    ),
};

export default async function AgUiDocPage({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}) {
    const { slug } = await params;
    const slugPath = slug?.join("/") || "introduction";
    const filePath = path.join(CONTENT_DIR, `${slugPath}.mdx`);

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const source = fs.readFileSync(filePath, "utf-8");
    // Strip frontmatter
    const content = source.replace(/^---[\s\S]*?---\n?/, "");
    const titleMatch = source.match(/title:\s*["']?(.+?)["']?\s*$/m)
        || content.match(/^#\s+(.+)$/m);
    const title = titleMatch?.[1] || slugPath.split("/").pop()?.replace(/-/g, " ") || "AG-UI";

    const nav = getNavItems();

    return (
        <div className="flex" style={{ minHeight: "calc(100vh - 52px)" }}>
            {/* Sidebar */}
            <aside className="w-[220px] shrink-0 border-r border-[var(--border)] bg-[var(--bg)] overflow-y-auto p-4">
                <Link
                    href="/ag-ui"
                    className="block text-xs font-mono uppercase tracking-widest text-[var(--violet)] mb-4"
                >
                    AG-UI Protocol
                </Link>
                {nav.map(({ section, items }) => (
                    <div key={section} className="mb-4">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)] mb-2">
                            {section}
                        </div>
                        {items.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/ag-ui/${item.slug}`}
                                className={`block py-1 text-xs transition-colors ${
                                    item.slug === slugPath
                                        ? "text-[var(--violet)] font-medium"
                                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                }`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                ))}
            </aside>

            {/* Content */}
            <main className="flex-1 max-w-3xl px-8 py-8">
                <h1 className="text-2xl font-semibold text-[var(--text)] tracking-tight mb-6">
                    {title}
                </h1>
                <div className="reference-content">
                    <MDXRemote source={content} components={components} />
                </div>
            </main>
        </div>
    );
}
