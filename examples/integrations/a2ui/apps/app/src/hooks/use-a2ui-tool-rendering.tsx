import { useDefaultRenderTool } from "@copilotkit/react-core/v2";
import { ToolReasoning } from "@/components/tool-rendering";

export const useA2UIToolRendering = () => {
  const ignoredTools = [
    "render_a2ui",
    "generate_a2ui",
    "log_a2ui_event",
  ];

  useDefaultRenderTool({
    render: ({ name, status, parameters }) => {
      if (ignoredTools.includes(name)) return <></>;
      return <ToolReasoning name={name} status={status} args={parameters} />;
    },
  });
};
