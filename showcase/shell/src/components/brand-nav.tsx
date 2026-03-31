"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchTrigger } from "./search-trigger";

type Brand = "copilotkit" | "ag-ui";

const AG_UI_PREFIXES = ["/ag-ui"];

const COPILOTKIT_LINKS = [
    { href: "/", label: "Home" },
    { href: "/integrations", label: "Integrations" },
    { href: "/reference", label: "Reference" },
    { href: "/matrix", label: "Matrix" },
];

const AG_UI_LINKS = [
    { href: "/ag-ui", label: "Overview" },
    { href: "/ag-ui/concepts/architecture", label: "Architecture" },
    { href: "/ag-ui/concepts/events", label: "Events" },
    { href: "/ag-ui/sdk/js/overview", label: "JS SDK" },
    { href: "/ag-ui/sdk/python/core/overview", label: "Python SDK" },
    { href: "/ag-ui/quickstart/introduction", label: "Quick Start" },
];

function activeBrandFromPath(pathname: string): Brand {
    return AG_UI_PREFIXES.some((p) => pathname.startsWith(p))
        ? "ag-ui"
        : "copilotkit";
}

export function BrandNav() {
    const pathname = usePathname();
    const active = activeBrandFromPath(pathname);
    const links = active === "copilotkit" ? COPILOTKIT_LINKS : AG_UI_LINKS;

    return (
        <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-surface)]/90 backdrop-blur-lg">
            <div className="mx-auto flex h-[52px] items-center justify-between px-6">
                {/* Brand tabs */}
                <div className="flex items-center gap-0">
                    <Link
                        href="/"
                        className="relative px-1 pb-1 text-sm font-bold tracking-tight transition-colors"
                        style={{
                            color:
                                active === "copilotkit"
                                    ? "var(--text)"
                                    : "var(--text-faint)",
                        }}
                    >
                        CopilotKit
                        {active === "copilotkit" && (
                            <span
                                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                                style={{ background: "var(--accent)" }}
                            />
                        )}
                    </Link>
                    <span className="mx-2 text-[var(--border)] select-none">
                        |
                    </span>
                    <Link
                        href="/ag-ui"
                        className="relative px-1 pb-1 text-sm font-bold tracking-tight transition-colors"
                        style={{
                            color:
                                active === "ag-ui"
                                    ? "var(--violet)"
                                    : "var(--text-faint)",
                        }}
                    >
                        AG-UI
                        {active === "ag-ui" && (
                            <span
                                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                                style={{ background: "var(--violet)" }}
                            />
                        )}
                    </Link>
                </div>

                {/* Context-dependent nav links */}
                <div className="flex items-center gap-1">
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="rounded-md px-3 py-1.5 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-all"
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                <SearchTrigger />
            </div>
        </nav>
    );
}
