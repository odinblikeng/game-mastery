import type { SvgIconComponent } from "@mui/icons-material";
import type { ComponentType } from "react";

export type ToolComponentProps = Record<string, never>;

export type ToolDefinition = {
  slug: string;
  label: string;
  description: string;
  icon: SvgIconComponent;
  component: ComponentType<ToolComponentProps>;
};
