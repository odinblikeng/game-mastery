import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getArea, getAreaList } from "@/lib/areas";

type HomeProps = {
  searchParams: Promise<{
    sidebar?: string;
    area?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { sidebar, area } = await searchParams;
  const areas = await getAreaList();
  const selectedArea = area ? await getArea(area) : null;
  const showAreaSidebar = sidebar === "areas" || Boolean(selectedArea);
  const SelectedAreaContent = selectedArea?.Content;
  const areaCountLabel =
    areas.length === 0
      ? "No areas loaded"
      : `${areas.length} area${areas.length === 1 ? "" : "s"} ready`;

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        maxWidth: 1140,
        mx: "auto",
        py: { xs: 3, md: 4 },
      }}
    >
      {selectedArea && SelectedAreaContent ? (
        <Paper
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            p: { xs: 3, md: 4 },
            minHeight: 420,
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Chip label={selectedArea.code} color="primary" sx={{ alignSelf: "flex-start", fontWeight: 700 }} />
              <Typography variant="h3">{selectedArea.title}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                {selectedArea.description}
              </Typography>
            </Stack>
            <Divider />
            <Box sx={{ "& > :last-child": { mb: 0 } }}>
              <SelectedAreaContent />
            </Box>
          </Stack>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(182, 139, 70, 0.4)",
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 6 },
            background:
              "linear-gradient(135deg, rgba(22, 15, 11, 0.98), rgba(45, 31, 22, 0.95))",
            color: "common.white",
            boxShadow: "0 26px 60px rgba(0, 0, 0, 0.28)",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top right, rgba(182, 139, 70, 0.18), transparent 32%), radial-gradient(circle at left, rgba(164, 61, 36, 0.22), transparent 34%)",
              pointerEvents: "none",
            },
          }}
        >
          <Stack spacing={3} sx={{ position: "relative", maxWidth: 680 }}>
            <Chip
              label={areaCountLabel}
              color="primary"
              variant="outlined"
              sx={{ alignSelf: "flex-start", color: "common.white" }}
            />
            <Typography variant="h1" sx={{ color: "common.white", fontSize: { xs: "2.4rem", md: "4rem" } }}>
              Game Mastery
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(243, 233, 219, 0.78)" }}>
              {showAreaSidebar
                ? "The area compendium is open — select an entry from the sidebar to load its notes here."
                : "Open the area compendium or session tools from the header to get started."}
            </Typography>
          </Stack>
        </Paper>
      )}
    </Container>
  );
}
