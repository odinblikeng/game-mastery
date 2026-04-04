import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { MDXComponents } from "mdx/types";
import NextLink from "next/link";

export function useMDXComponents(): MDXComponents {
  return {
    h1: (props) => (
      <Typography
        component="h1"
        gutterBottom
        variant="h4"
        sx={{ fontWeight: 700 }}
        {...props}
      />
    ),
    h2: (props) => (
      <Typography
        component="h2"
        gutterBottom
        variant="h5"
        sx={{ fontWeight: 700, mt: 3 }}
        {...props}
      />
    ),
    h3: (props) => (
      <Typography
        component="h3"
        gutterBottom
        variant="h6"
        sx={{ fontWeight: 700, mt: 2.5 }}
        {...props}
      />
    ),
    p: (props) => (
      <Typography paragraph sx={{ lineHeight: 1.7 }} {...props} />
    ),
    a: (props) => <Link component={NextLink} underline="hover" {...props} />,
    blockquote: (props) => (
      <Box
        component="blockquote"
        sx={{
          borderLeft: 4,
          borderColor: "primary.main",
          m: 0,
          mb: 2,
          pl: 2,
        }}
        {...props}
      />
    ),
    ul: (props) => <Box component="ul" sx={{ mb: 2, mt: 0, pl: 3 }} {...props} />,
    ol: (props) => <Box component="ol" sx={{ mb: 2, mt: 0, pl: 3 }} {...props} />,
    li: (props) => <Box component="li" sx={{ lineHeight: 1.7, mb: 0.5 }} {...props} />,
  };
}