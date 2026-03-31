import Link from "next/link";

export default function AgUiOverviewPage() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <h1 className="text-3xl font-semibold text-[var(--violet)] tracking-tight mb-3">
                The Agent-User Interaction Protocol
            </h1>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-10">
                AG-UI is an open protocol for connecting AI agents to frontend
                applications. It defines a standard event-based interface for
                streaming agent state, tool calls, and generative UI to any client.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10">
                <Link
                    href="/protocol"
                    className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--violet)] transition-all"
                >
                    <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--violet)] mb-1">
                        Protocol Spec
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                        Architecture, events, streaming, state management
                    </p>
                </Link>
                <Link
                    href="/sdk/js"
                    className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--violet)] transition-all"
                >
                    <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--violet)] mb-1">
                        JavaScript SDK
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                        @ag-ui/core, @ag-ui/client, @ag-ui/encoder
                    </p>
                </Link>
                <Link
                    href="/sdk/python"
                    className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--violet)] transition-all"
                >
                    <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--violet)] mb-1">
                        Python SDK
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                        ag_ui.core, ag_ui.encoder
                    </p>
                </Link>
                <a
                    href="https://github.com/ag-ui-protocol/ag-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--violet)] transition-all"
                >
                    <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--violet)] mb-1">
                        GitHub
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                        Open source · Apache 2.0 · ag-ui-protocol/ag-ui
                    </p>
                </a>
            </div>

            <p className="text-xs text-[var(--text-faint)]">
                2 SDKs · 15+ framework adapters · Open protocol
            </p>
        </div>
    );
}
