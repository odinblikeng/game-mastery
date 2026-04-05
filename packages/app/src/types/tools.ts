import type { SvgIconComponent } from "@mui/icons-material";
import type { ComponentType } from "react";
import type { MonsterSummary } from "@/types/monster";

export type ToolComponentProps = {
  monsters: MonsterSummary[];
};

export type ToolDefinition = {
  slug: string;
  label: string;
  description: string;
  icon: SvgIconComponent;
  component: ComponentType<ToolComponentProps>;
};
