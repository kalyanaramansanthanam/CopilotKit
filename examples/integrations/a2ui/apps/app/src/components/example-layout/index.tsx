"use client";

import { ReactNode } from "react";

interface ExampleLayoutProps {
  chatContent: ReactNode;
  appContent: ReactNode;
}

export function ExampleLayout({ chatContent }: ExampleLayoutProps) {
  return (
    <div className="h-full flex flex-row">
      <div className="flex-1 max-h-full overflow-y-auto max-lg:px-4">
        {chatContent}
      </div>
    </div>
  );
}
