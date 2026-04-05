declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const metadata: {
    code: string;
    title: string;
    description: string;
  };

  const MDXContent: ComponentType;
  export default MDXContent;
}