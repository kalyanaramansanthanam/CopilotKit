"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
    type: "integration" | "feature" | "demo" | "page" | "reference" | "ag-ui";
    title: string;
    subtitle: string;
    href: string;
}

export function SearchModal({ onClose }: { onClose: () => void }) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [registryData, setRegistryData] = useState<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 50);
        import("@/data/registry.json").then((mod) => setRegistryData(mod.default));
    }, []);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    const results = useMemo(() => {
        if (!query.trim() || !registryData) return [];

        const q = query.toLowerCase();
        const items: SearchResult[] = [];

        const pages: SearchResult[] = [
            { type: "page", title: "Home", subtitle: "Front door", href: "/" },
            { type: "page", title: "Integrations", subtitle: "All integrations", href: "/integrations" },
            { type: "page", title: "Feature Matrix", subtitle: "Compare features across integrations", href: "/matrix" },
            // CopilotKit Reference — Components (type: reference)
            { type: "reference", title: "<CopilotKit />", subtitle: "Provider component wrapping your application", href: "/reference/components/CopilotKit" },
            { type: "reference", title: "<CopilotChat />", subtitle: "High-level chat component connecting to an agent", href: "/reference/components/CopilotChat" },
            { type: "reference", title: "<CopilotSidebar />", subtitle: "Sidebar variant of CopilotChat in a fixed side panel", href: "/reference/components/CopilotSidebar" },
            { type: "reference", title: "<CopilotPopup />", subtitle: "Popup variant of CopilotChat in a floating panel with toggle", href: "/reference/components/CopilotPopup" },
            { type: "reference", title: "<CopilotChatView />", subtitle: "Layout component with scrollable transcript and input", href: "/reference/components/CopilotChatView" },
            { type: "reference", title: "<CopilotChatInput />", subtitle: "Primary text input and control surface for chat", href: "/reference/components/CopilotChatInput" },
            { type: "reference", title: "<CopilotChatMessageView />", subtitle: "Component for rendering a list of chat messages", href: "/reference/components/CopilotChatMessageView" },
            { type: "reference", title: "<CopilotChatAssistantMessage />", subtitle: "Display assistant messages with Markdown and tool calls", href: "/reference/components/CopilotChatAssistantMessage" },
            { type: "reference", title: "<CopilotChatUserMessage />", subtitle: "Display user-authored messages with branch navigation", href: "/reference/components/CopilotChatUserMessage" },
            // CopilotKit Reference — Hooks
            { type: "reference", title: "useAgent", subtitle: "Access and control the agent instance", href: "/reference/hooks/useAgent" },
            { type: "reference", title: "useAgentContext", subtitle: "Pass client-side context to the agent", href: "/reference/hooks/useAgentContext" },
            { type: "reference", title: "useComponent", subtitle: "Register a named component as a frontend tool", href: "/reference/hooks/useComponent" },
            { type: "reference", title: "useConfigureSuggestions", subtitle: "Configure quick-reply suggestion buttons", href: "/reference/hooks/useConfigureSuggestions" },
            { type: "reference", title: "useFrontendTool", subtitle: "Define a tool the agent can call on the frontend", href: "/reference/hooks/useFrontendTool" },
            { type: "reference", title: "useHumanInTheLoop", subtitle: "Human-in-the-loop approval for agent actions", href: "/reference/hooks/useHumanInTheLoop" },
            { type: "reference", title: "useInterrupt", subtitle: "Handle agent interrupts with custom UI", href: "/reference/hooks/useInterrupt" },
            { type: "reference", title: "useRenderTool", subtitle: "Render backend tool results as React components", href: "/reference/hooks/useRenderTool" },
            { type: "reference", title: "useRenderToolCall", subtitle: "Render tool calls outside of CopilotChat (headless)", href: "/reference/hooks/useRenderToolCall" },
            { type: "reference", title: "useSuggestions", subtitle: "Access suggestion data programmatically", href: "/reference/hooks/useSuggestions" },
            { type: "reference", title: "useCopilotKit", subtitle: "Access the CopilotKit instance", href: "/reference/hooks/useCopilotKit" },
            { type: "reference", title: "useCopilotChatConfiguration", subtitle: "Configure chat behavior", href: "/reference/hooks/useCopilotChatConfiguration" },
            { type: "reference", title: "useDefaultRenderTool", subtitle: "Default rendering for tool calls", href: "/reference/hooks/useDefaultRenderTool" },
            // AG-UI Protocol
            { type: "ag-ui", title: "AG-UI Overview", subtitle: "The Agent-User Interaction Protocol", href: "/ag-ui" },
            { type: "ag-ui", title: "AG-UI Architecture", subtitle: "Protocol architecture, events, streaming", href: "/ag-ui/concepts/architecture" },
            { type: "ag-ui", title: "AG-UI Events", subtitle: "Event types and lifecycle", href: "/ag-ui/concepts/events" },
            { type: "ag-ui", title: "AG-UI Agents", subtitle: "Agent concepts and patterns", href: "/ag-ui/concepts/agents" },
            { type: "ag-ui", title: "AG-UI State", subtitle: "State management in AG-UI", href: "/ag-ui/concepts/state" },
            { type: "ag-ui", title: "AG-UI Tools", subtitle: "Tool definitions and execution", href: "/ag-ui/concepts/tools" },
            { type: "ag-ui", title: "AG-UI Middleware", subtitle: "Request/response middleware", href: "/ag-ui/concepts/middleware" },
            { type: "ag-ui", title: "AG-UI Messages", subtitle: "Message types and formatting", href: "/ag-ui/concepts/messages" },
            { type: "ag-ui", title: "AG-UI Generative UI", subtitle: "Generative UI specifications", href: "/ag-ui/concepts/generative-ui-specs" },
            { type: "ag-ui", title: "AG-UI JS SDK", subtitle: "@ag-ui/core, @ag-ui/client, @ag-ui/encoder", href: "/ag-ui/sdk/js/overview" },
            { type: "ag-ui", title: "AG-UI Python SDK", subtitle: "ag_ui.core, ag_ui.encoder", href: "/ag-ui/sdk/python/core/overview" },
            { type: "ag-ui", title: "AG-UI Quick Start", subtitle: "Build your first AG-UI integration", href: "/ag-ui/quickstart/introduction" },
        ];

        for (const p of pages) {
            if (p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q)) {
                items.push(p);
            }
        }

        for (const i of registryData.integrations || []) {
            if (i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)) {
                items.push({
                    type: "integration",
                    title: i.name,
                    subtitle: (i.description || "").slice(0, 80),
                    href: `/integrations/${i.slug}`,
                });
            }
            for (const d of i.demos || []) {
                if (d.name.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q) || d.tags?.some((t: string) => t.toLowerCase().includes(q))) {
                    items.push({
                        type: "demo",
                        title: d.name,
                        subtitle: `${i.name} · ${d.description}`,
                        href: `/integrations/${i.slug}/${d.id}`,
                    });
                }
            }
        }

        for (const f of registryData.feature_registry?.features || []) {
            if (f.name.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q)) {
                items.push({
                    type: "feature",
                    title: f.name,
                    subtitle: f.description,
                    href: "/matrix",
                });
            }
        }

        return items.slice(0, 12);
    }, [query, registryData]);

    function onInputKeyDown(e: React.KeyboardEvent) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && results[selectedIndex]) {
            e.preventDefault();
            router.push(results[selectedIndex].href);
            onClose();
        }
    }

    return (
        <>
            <div
                className="fixed inset-0 z-[200] bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[201] w-full max-w-lg px-4">
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
                        <span className="text-[var(--text-muted)]">⌕</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                            onKeyDown={onInputKeyDown}
                            placeholder="Search docs, demos, integrations..."
                            className="flex-1 bg-transparent text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--text-faint)]"
                        />
                        <kbd className="text-[10px] font-mono text-[var(--text-faint)] border border-[var(--border)] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)]">
                            ESC
                        </kbd>
                    </div>

                    {results.length > 0 && (
                        <div className="max-h-[320px] overflow-y-auto py-2">
                            {results.map((r, idx) => (
                                <button
                                    key={`${r.href}-${idx}`}
                                    className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors ${
                                        idx === selectedIndex
                                            ? "bg-[var(--bg-elevated)]"
                                            : "hover:bg-[var(--bg-hover)]"
                                    }`}
                                    onClick={() => {
                                        router.push(r.href);
                                        onClose();
                                    }}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                >
                                    <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase w-14 shrink-0">
                                        {r.type}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="text-[13px] font-medium text-[var(--text)] truncate">{r.title}</div>
                                        <div className="text-[11px] text-[var(--text-muted)] truncate">{r.subtitle}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {query.trim() && results.length === 0 && (
                        <div className="px-5 py-8 text-center text-[13px] text-[var(--text-muted)]">
                            No results for &ldquo;{query}&rdquo;
                        </div>
                    )}

                    {!query.trim() && (
                        <div className="px-5 py-6 text-center text-[12px] text-[var(--text-faint)]">
                            Type to search integrations, features, and demos
                        </div>
                    )}

                    <div className="flex items-center justify-between px-5 py-2.5 border-t border-[var(--border)] text-[10px] text-[var(--text-faint)]">
                        <span>↑↓ navigate · ↵ select · esc close</span>
                    </div>
                </div>
            </div>
        </>
    );
}
