import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Callout, Cards, Card, Accordions, Accordion } from "@/components/mdx-components";
import { PropertyReference } from "@/components/property-reference";

const CONTENT_DIR = path.join(process.cwd(), "src/content/docs");

function getNavItems(): { section: string; items: { slug: string; title: string }[] }[] {
    const sections: Record<string, { slug: string; title: string }[]> = {};

    function walk(dir: string, prefix: string = "") {
        if (!fs.existsSync(dir)) return;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (entry.name.startsWith(".") || entry.name.startsWith("(")) continue;
            if (entry.isDirectory()) {
                walk(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
            } else if (entry.name.endsWith(".mdx")) {
                const slug = prefix
                    ? `${prefix}/${entry.name.replace(".mdx", "")}`
                    : entry.name.replace(".mdx", "");
                const raw = fs.readFileSync(path.join(dir, entry.name), "utf-8");
                const titleMatch = raw.match(/title:\s*["']?(.+?)["']?\s*$/m) || raw.match(/^#\s+(.+)$/m);
                const title = titleMatch?.[1] || entry.name.replace(".mdx", "").replace(/-/g, " ");
                const section = prefix.split("/")[0] || "Guides";
                const sectionLabel = section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, " ");
                if (!sections[sectionLabel]) sections[sectionLabel] = [];
                sections[sectionLabel].push({ slug, title });
            }
        }
    }

    walk(CONTENT_DIR);
    return Object.entries(sections)
        .filter(([, items]) => items.length > 0)
        .map(([section, items]) => ({ section, items: items.slice(0, 20) }));
}

const components = {
    Callout, Cards, Card, Accordions, Accordion, PropertyReference,
    Note: Callout,
    Warning: ({ children }: { children: React.ReactNode }) => <Callout type="warn">{children}</Callout>,
    Tip: ({ children }: { children: React.ReactNode }) => <Callout type="info">{children}</Callout>,
    Steps: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Step: ({ children, title }: { children: React.ReactNode; title?: string }) => (
        <div style={{ marginBottom: "1rem" }}>
            {title && <h4 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{title}</h4>}
            {children}
        </div>
    ),
    CardGroup: Cards,
    Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Tab: ({ children, title }: { children: React.ReactNode; title?: string }) => (
        <div style={{ marginBottom: "1rem" }}>
            {title && <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>{title}</div>}
            {children}
        </div>
    ),
    Frame: ({ children }: { children: React.ReactNode }) => <div style={{ border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "1rem", marginBottom: "1rem" }}>{children}</div>,
    // Fumadocs-specific components we shim
    IntegrationGrid: ({ path }: { path?: string }) => <div style={{ padding: "1rem", background: "var(--bg-elevated)", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>See <a href="/integrations" style={{ color: "var(--accent)" }}>Integrations</a> for all available frameworks{path ? ` (${path})` : ""}.</div>,
    FeatureGrid: ({ children }: { children?: React.ReactNode }) => <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>{children}</div>,
    Feature: ({ children, title }: { children?: React.ReactNode; title?: string }) => <div style={{ border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "1rem" }}>{title && <h4 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{title}</h4>}{children}</div>,
    video: (props: Record<string, unknown>) => <video {...props} className={undefined} style={{ borderRadius: "0.5rem", width: "100%", marginBottom: "1rem" }} />,
    img: (props: Record<string, unknown>) => <img {...props} className={undefined} style={{ borderRadius: "0.5rem", maxWidth: "100%", marginBottom: "1rem" }} />,
    CodeGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Snippet: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Info: Callout,
    Caution: ({ children }: { children: React.ReactNode }) => <Callout type="warn">{children}</Callout>,
};

export default async function DocsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = await params;
    const slugPath = slug?.join("/") || "index";
    let filePath = path.join(CONTENT_DIR, `${slugPath}.mdx`);

    // Try index.mdx if the path is a directory
    if (!fs.existsSync(filePath)) {
        const indexPath = path.join(CONTENT_DIR, slugPath, "index.mdx");
        if (fs.existsSync(indexPath)) {
            filePath = indexPath;
        } else {
            notFound();
        }
    }

    const source = fs.readFileSync(filePath, "utf-8");
    const content = source.replace(/^---[\s\S]*?---\n?/, "");
    const titleMatch = source.match(/title:\s*["']?(.+?)["']?\s*$/m) || content.match(/^#\s+(.+)$/m);
    const title = titleMatch?.[1] || slugPath.split("/").pop()?.replace(/-/g, " ") || "Docs";

    const nav = getNavItems();

    return (
        <div className="flex" style={{ minHeight: "calc(100vh - 52px)" }}>
            <aside className="w-[220px] shrink-0 border-r border-[var(--border)] bg-[var(--bg)] overflow-y-auto p-4">
                <Link href="/docs" className="block text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-4">
                    CopilotKit Docs
                </Link>
                {nav.map(({ section, items }) => (
                    <div key={section} className="mb-4">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)] mb-2">{section}</div>
                        {items.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/docs/${item.slug}`}
                                className={`block py-1 text-xs transition-colors ${
                                    item.slug === slugPath
                                        ? "text-[var(--accent)] font-medium"
                                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                }`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                ))}
            </aside>
            <main className="flex-1 max-w-3xl px-8 py-8">
                <h1 className="text-2xl font-semibold text-[var(--text)] tracking-tight mb-6">{title}</h1>
                <div className="reference-content">
                    <MDXRemote source={content} components={components} />
                </div>
            </main>
        </div>
    );
}
