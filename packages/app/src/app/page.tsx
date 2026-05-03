import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AreaMonsterList from "@/components/AreaMonsterList";
import HeroActionCards from "@/components/HeroActionCards";
import { getArea, getAreaList } from "@/lib/areas";

type HomeProps = {
  searchParams: Promise<{
    sidebar?: string;
    area?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { area } = await searchParams;
  const areas = await getAreaList();
  const selectedArea = area ? await getArea(area) : null;
  const SelectedAreaContent = selectedArea?.Content;
  const areaCountLabel =
    areas.length === 0
      ? "No areas loaded"
      : `${areas.length} area${areas.length === 1 ? "" : "s"} ready`;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100%" }}>
      {selectedArea && SelectedAreaContent ? (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            p: { xs: 3, md: 4 },
            minHeight: 420,
            boxShadow: "var(--mui-palette-chrome-shadow)",
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Chip label={selectedArea.code} color="primary" sx={{ alignSelf: "flex-start", fontWeight: 700 }} />
              <Typography variant="h3">{selectedArea.title}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                {selectedArea.description}
              </Typography>
              {selectedArea.monsters?.length ? <AreaMonsterList slugs={selectedArea.monsters} /> : null}
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
            border: "1px solid",
            borderColor: "hero.border",
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 6 },
            background: "var(--mui-palette-hero-background)",
            color: "hero.text",
            boxShadow: "var(--mui-palette-hero-shadow)",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: "var(--mui-palette-hero-overlay)",
              pointerEvents: "none",
            },
          }}
        >
          <Stack spacing={3} sx={{ position: "relative" }}>
            <Chip
              label={areaCountLabel}
              color="primary"
              variant="outlined"
              sx={{ alignSelf: "flex-start" }}
            />
            <Typography
              variant="h1"
              sx={{
                color: "hero.text",
                fontSize: { xs: "2.4rem", md: "3.5rem" },
                fontFamily: "var(--font-display), serif",
              }}
            >
              Game Mastery
            </Typography>
            <Typography variant="body1" sx={{ color: "hero.mutedText", maxWidth: 480 }}>
              Open the area compendium or session tools from the rail to get started.
            </Typography>
            <HeroActionCards />
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
