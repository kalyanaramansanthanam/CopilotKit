"use client";

import { ExampleLayout } from "@/components/example-layout";
import { useExampleSuggestions } from "@/hooks";
import { useA2UIToolRendering } from "@/hooks/use-a2ui-tool-rendering";

import { CopilotChat } from "@copilotkit/react-core/v2";

export default function HomePage() {
  useA2UIToolRendering();
  useExampleSuggestions();

  return (
    <ExampleLayout
      chatContent={
        <CopilotChat input={{ disclaimer: () => null, className: "pb-6" }} />
      }
      appContent={null}
    />
  );
}
