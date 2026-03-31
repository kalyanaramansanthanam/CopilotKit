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
    // Passthrough components — render children as-is
    TailoredContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    TailoredContentOption: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SharedContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    IframeSwitcher: ({ children, src }: { children?: React.ReactNode; src?: string }) => src ? <div style={{ border: "1px solid var(--border)", borderRadius: "0.5rem", overflow: "hidden", marginBottom: "1rem" }}><iframe src={src} style={{ width: "100%", height: "400px", border: "none" }} /></div> : <div>{children}</div>,
    IframeSwitcherGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    RunAndConnect: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    RunAndConnectSnippet: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    MigrateTo: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    MigrateToV: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    HeadlessUI: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    ImageZoom: ({ src, alt }: { src?: string; alt?: string }) => <img src={src} alt={alt || ""} style={{ borderRadius: "0.5rem", maxWidth: "100%", marginBottom: "1rem", cursor: "zoom-in" }} />,
    InstallSDKSnippet: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    MCPApps: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    MCPSetup: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Overview: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    FrameworkOverview: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    CommonIssues: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    ErrorDebugging: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Observability: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    ObservabilityConnectors: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Inspector: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    DefaultToolRendering: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    DisplayOnly: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Interactive: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    PrebuiltComponents: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    ProgrammaticControl: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    CodingAgents: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Slots: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    FrontendTools: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    FrontEndToolsImpl: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    ToolRendering: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    ToolRenderer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    ReasoningMessages: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    // Styled components
    YouTubeVideo: ({ id }: { id?: string }) => id ? <div style={{ position: "relative", paddingBottom: "56.25%", marginBottom: "1rem" }}><iframe src={`https://www.youtube.com/embed/${id}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: "0.5rem" }} allowFullScreen /></div> : null,
    CTACards: ({ children }: { children?: React.ReactNode }) => <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>{children}</div>,
    AttributeCards: ({ children }: { children?: React.ReactNode }) => <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>{children}</div>,
    PatternCard: ({ children, title }: { children?: React.ReactNode; title?: string }) => <div style={{ border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "1rem", marginBottom: "0.75rem" }}>{title && <h4 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{title}</h4>}{children}</div>,
    TwoColumnSection: ({ children }: { children: React.ReactNode }) => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1rem" }}>{children}</div>,
    EcosystemTable: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    FeatureMatrix: () => <div style={{ padding: "1rem", background: "var(--bg-elevated)", borderRadius: "0.5rem", marginBottom: "1rem" }}>See the <a href="/matrix" style={{ color: "var(--accent)" }}>Feature Matrix</a> for a full comparison.</div>,
    IntegrationsGrid: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    IntegrationButtonGroup: ({ children }: { children?: React.ReactNode }) => <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>{children}</div>,
    // Misc
    AGUI: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
    AgUI: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
    SignUpSection: () => <div style={{ padding: "1rem", background: "var(--bg-elevated)", borderRadius: "0.5rem", marginBottom: "1rem" }}><a href="https://cloud.copilotkit.ai" style={{ color: "var(--accent)" }}>Sign up for CopilotKit Cloud →</a></div>,
    LinkToCopilotCloud: () => <a href="https://cloud.copilotkit.ai" style={{ color: "var(--accent)" }}>CopilotKit Cloud</a>,
    LandingCodeShowcase: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    UseAgentSnippet: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    InstallPythonSDK: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    ActionButtons: ({ children }: { children?: React.ReactNode }) => <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>{children}</div>,
    ApproveComponent: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    AskComponent: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    CopilotCloudConfigureCopilotKitProvider: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    GenerativeUISpecsOverview: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    IOptions: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    JsonOptions: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    MessageActionRenderProps: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
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
