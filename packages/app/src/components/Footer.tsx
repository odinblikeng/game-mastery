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
        borderTop: "1px solid rgba(182, 139, 70, 0.28)",
        background: "linear-gradient(180deg, rgba(18, 12, 9, 0.2), rgba(9, 7, 6, 0.7))",
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: 1600, px: { xs: 2, md: 3 }, py: 2.5 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1}
          justifyContent="space-between"
        >
          <Typography variant="body2" sx={{ color: "rgba(243, 233, 219, 0.72)" }}>
            Game Mastery keeps area notes, encounter flow, and session tools in one tabletop control room.
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(243, 233, 219, 0.48)", letterSpacing: "0.14em" }}>
            Built for live campaign play
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}