import Link from "next/link";

export default function DocsIndexPage() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <h1 className="text-3xl font-semibold text-[var(--text)] tracking-tight mb-3">
                CopilotKit Documentation
            </h1>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-10">
                Guides, tutorials, and integration documentation for building
                AI-powered applications with CopilotKit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10">
                <Link href="/docs/agentic-chat-ui" className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent)] transition-all">
                    <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] mb-1">Agentic Chat UI</h3>
                    <p className="text-xs text-[var(--text-muted)]">Build chat interfaces with CopilotKit components</p>
                </Link>
                <Link href="/docs/frontend-tools" className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent)] transition-all">
                    <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] mb-1">Frontend Tools</h3>
                    <p className="text-xs text-[var(--text-muted)]">Define tools your agent can call on the frontend</p>
                </Link>
                <Link href="/docs/generative-ui" className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent)] transition-all">
                    <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] mb-1">Generative UI</h3>
                    <p className="text-xs text-[var(--text-muted)]">Let your agent generate interactive UI components</p>
                </Link>
                <Link href="/docs/backend/copilot-runtime" className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent)] transition-all">
                    <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] mb-1">Copilot Runtime</h3>
                    <p className="text-xs text-[var(--text-muted)]">Server-side runtime for connecting agents</p>
                </Link>
                <Link href="/docs/integrations" className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent)] transition-all">
                    <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] mb-1">Integrations</h3>
                    <p className="text-xs text-[var(--text-muted)]">LangGraph, Mastra, CrewAI, and more</p>
                </Link>
                <Link href="/docs/learn" className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent)] transition-all">
                    <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] mb-1">Learn</h3>
                    <p className="text-xs text-[var(--text-muted)]">Tutorials and learning resources</p>
                </Link>
            </div>

            <p className="text-xs text-[var(--text-faint)]">
                517 pages · Guides · Integrations · Tutorials · Troubleshooting
            </p>
        </div>
    );
}
