import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: 1,
        borderColor: "chrome.border",
        background: (t) => t.palette.chrome.footerBg,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: 1600, px: { xs: 2, md: 3 }, py: 2.5 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1}
          justifyContent="space-between"
        >
          <Typography variant="body2" sx={{ color: "chrome.mutedText" }}>
            Game Mastery keeps area notes, encounter flow, and session tools in one tabletop control room.
          </Typography>
          <Typography variant="caption" sx={{ color: "chrome.dimText", letterSpacing: "0.14em" }}>
            Built for live campaign play
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}