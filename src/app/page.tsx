import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import RuleFolderRoundedIcon from "@mui/icons-material/RuleFolderRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getArea, getAreaList } from "@/lib/areas";

const toolCards = [
  {
    icon: <MapRoundedIcon color="primary" />,
    title: "Area Reference",
    description:
      "Keep room descriptions, hazards, and monster notes one click away while the table is moving.",
  },
  {
    icon: <AutoStoriesRoundedIcon color="primary" />,
    title: "Session Notes",
    description:
      "Capture rulings, NPC reveals, and player choices without losing the pacing of the scene.",
  },
  {
    icon: <RuleFolderRoundedIcon color="primary" />,
    title: "Encounter Prep",
    description:
      "Stage reusable encounter details, reminders, and cross-links to your campaign material.",
  },
];

const utilityStats = [
  {
    label: "Compendium Entries",
    icon: <ExploreRoundedIcon fontSize="small" />,
  },
  {
    label: "Session Tool",
    icon: <CasinoRoundedIcon fontSize="small" />,
  },
  {
    label: "Single-Page Shell",
    icon: <AutoStoriesRoundedIcon fontSize="small" />,
  },
];

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
  const firstArea = areas[0] ?? null;
  const showAreaSidebar = sidebar === "areas" || Boolean(selectedArea);
  const SelectedAreaContent = selectedArea?.Content;
  const areaCountLabel =
    areas.length === 0
      ? "No area files loaded"
      : `${areas.length} area ${areas.length === 1 ? "file" : "files"} ready`;
  const featuredAreas = areas.slice(0, 4);
  const quickAreaHref = firstArea
    ? `/?sidebar=areas&area=${firstArea.slug}#areas`
    : "/?sidebar=areas#areas";

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
      <Stack spacing={{ xs: 4, md: 6 }}>
        <Paper
          id="overview"
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(182, 139, 70, 0.4)",
            px: { xs: 3, md: 5 },
            py: { xs: 3.5, md: 5 },
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
          <Box
            sx={{
              position: "relative",
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.7fr) minmax(280px, 0.9fr)" },
            }}
          >
            <Stack spacing={3}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="GM Dashboard" color="secondary" variant="outlined" sx={{ color: "common.white" }} />
                <Chip label={areaCountLabel} color="primary" variant="outlined" sx={{ color: "common.white" }} />
              </Stack>
              <Stack spacing={2} sx={{ maxWidth: 760 }}>
                <Typography variant="h1" sx={{ color: "common.white", fontSize: { xs: "2.6rem", md: "4.7rem" } }}>
                  Run the next encounter from a proper campaign command screen.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(243, 233, 219, 0.78)", maxWidth: 680 }}
                >
                  The shell now leans into a darker, compendium-first look: dramatic chrome,
                  parchment reading surfaces, and stronger hierarchy so room notes and session
                  tools feel closer to a tabletop reference suite than a starter template.
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button href={quickAreaHref} size="large" variant="contained">
                  {firstArea ? "Open Adventure Atlas" : "Open Area Compendium"}
                </Button>
                <Button href="/?tools=menu" size="large" variant="outlined" sx={{ color: "common.white" }}>
                  Launch Session Tools
                </Button>
              </Stack>
              <Box
                sx={{
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
                }}
              >
                {utilityStats.map((item, index) => (
                  <Box
                    key={item.label}
                    sx={{
                      border: "1px solid rgba(182, 139, 70, 0.24)",
                      borderRadius: 3,
                      px: 2,
                      py: 1.75,
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75, color: "secondary.light" }}>
                      {item.icon}
                      <Typography variant="caption" sx={{ color: "rgba(243, 233, 219, 0.64)", letterSpacing: "0.14em" }}>
                        {item.label}
                      </Typography>
                    </Stack>
                    <Typography variant="h3" sx={{ color: "common.white", fontSize: { xs: "1.45rem", md: "1.7rem" } }}>
                      {index === 0 ? String(areas.length).padStart(2, "0") : index === 1 ? "01" : "02"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                border: "1px solid rgba(182, 139, 70, 0.28)",
                backgroundColor: "rgba(10, 8, 7, 0.3)",
                color: "common.white",
                p: 3,
                alignSelf: "stretch",
              }}
            >
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="overline" sx={{ color: "secondary.light", letterSpacing: "0.18em" }}>
                    Tonight&apos;s Table
                  </Typography>
                  <Typography variant="h6" sx={{ color: "common.white", mt: 0.5 }}>
                    {selectedArea ? "Loaded Room" : "Ready to Load"}
                  </Typography>
                </Box>
                {selectedArea ? (
                  <Stack spacing={1.25}>
                    <Chip label={selectedArea.code} color="primary" sx={{ alignSelf: "flex-start" }} />
                    <Typography variant="h3" sx={{ color: "common.white", fontSize: "1.5rem" }}>
                      {selectedArea.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(243, 233, 219, 0.74)" }}>
                      {selectedArea.description}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography sx={{ color: "rgba(243, 233, 219, 0.74)" }}>
                    Open the area compendium to pin a room into the main reading panel while your notes and tools stay in place.
                  </Typography>
                )}
                <Divider sx={{ borderColor: "rgba(182, 139, 70, 0.2)" }} />
                <Stack spacing={1.25}>
                  <Typography variant="overline" sx={{ color: "rgba(243, 233, 219, 0.64)", letterSpacing: "0.16em" }}>
                    Quick Access
                  </Typography>
                  {featuredAreas.length > 0 ? (
                    featuredAreas.map((area) => (
                      <Button
                        key={area.slug}
                        href={`/?sidebar=areas&area=${area.slug}#areas`}
                        variant={selectedArea?.slug === area.slug ? "contained" : "outlined"}
                        sx={{ justifyContent: "space-between", color: selectedArea?.slug === area.slug ? undefined : "common.white" }}
                      >
                        {area.code} · {area.title}
                      </Button>
                    ))
                  ) : (
                    <Typography sx={{ color: "rgba(243, 233, 219, 0.74)" }}>
                      Add MDX area files to populate the atlas.
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Paper>
          </Box>
        </Paper>

        <Box id="areas">
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.6fr) minmax(280px, 0.9fr)" },
            }}
          >
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
                  <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: "0.18em" }}>
                    Adventure Atlas
                  </Typography>
                  <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>
                    Parchment-style reading space for room notes and encounter detail.
                  </Typography>
                  <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
                    This main panel is meant to feel closer to a compendium page: bold title treatment, warm paper tones, and enough spacing for quick scanning at the table.
                  </Typography>
                </Stack>
                <Divider />
                {areas.length === 0 ? (
                  <Stack spacing={2} sx={{ maxWidth: 640 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      No area content found.
                    </Typography>
                    <Typography color="text.secondary">
                      Add MDX files under src/content/areas with a default MDX export and metadata containing code, title, and description.
                    </Typography>
                  </Stack>
                ) : selectedArea && SelectedAreaContent ? (
                  <Stack spacing={3}>
                    <Stack spacing={1.5}>
                      <Chip label={selectedArea.code} color="primary" sx={{ alignSelf: "flex-start", fontWeight: 700 }} />
                      <Typography variant="h3">{selectedArea.title}</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                        {selectedArea.description}
                      </Typography>
                    </Stack>
                    <Box sx={{ "& > :last-child": { mb: 0 } }}>
                      <SelectedAreaContent />
                    </Box>
                  </Stack>
                ) : showAreaSidebar ? (
                  <Stack spacing={2} sx={{ maxWidth: 560 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Select a room from the left rail.
                    </Typography>
                    <Typography color="text.secondary">
                      The compendium is already open. Choose an entry to drop its notes into this reading pane without losing your place in the session shell.
                    </Typography>
                  </Stack>
                ) : (
                  <Stack spacing={2} sx={{ maxWidth: 560 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Open the atlas when the table shifts scenes.
                    </Typography>
                    <Typography color="text.secondary">
                      Use the header toggle to reveal the area compendium and load a room into this panel.
                    </Typography>
                    <Box>
                      <Button href="/?sidebar=areas#areas" variant="contained">
                        Open Area Compendium
                      </Button>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Paper>

            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid rgba(182, 139, 70, 0.32)",
                  backgroundColor: "rgba(20, 14, 11, 0.9)",
                  color: "common.white",
                  p: 3,
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h6">Room Directory</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(243, 233, 219, 0.72)" }}>
                    Keep your most likely stops close at hand.
                  </Typography>
                  {featuredAreas.length > 0 ? (
                    featuredAreas.map((area) => (
                      <Button
                        key={area.slug}
                        href={`/?sidebar=areas&area=${area.slug}#areas`}
                        variant={selectedArea?.slug === area.slug ? "contained" : "outlined"}
                        sx={{ justifyContent: "space-between", color: selectedArea?.slug === area.slug ? undefined : "common.white" }}
                      >
                        {area.code} · {area.title}
                      </Button>
                    ))
                  ) : (
                    <Typography sx={{ color: "rgba(243, 233, 219, 0.72)" }}>
                      No entries available yet.
                    </Typography>
                  )}
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ border: 1, borderColor: "divider", p: 3 }}>
                <Stack spacing={1.5}>
                  <Typography variant="h6">Why this feels better</Typography>
                  <Typography color="text.secondary">
                    Stronger contrast separates navigation from reading surfaces, which makes the dashboard feel closer to a premium RPG reference tool and less like generic application chrome.
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Box>

        <Box id="session-tools">
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: "0.18em" }}>
              Session Utilities
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>
              A darker tool deck for initiative, prep, and live encounter control.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
              The right rail is still compact, but the presentation now reads as a deliberate utility panel instead of a default sidebar list.
            </Typography>
          </Stack>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid rgba(182, 139, 70, 0.32)",
              backgroundColor: "rgba(20, 14, 11, 0.88)",
              color: "common.white",
              p: { xs: 2.5, md: 3 },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
              }}
            >
              {toolCards.map((tool) => (
                <Box
                  key={tool.title}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid rgba(182, 139, 70, 0.18)",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    p: 3,
                    height: "100%",
                  }}
                >
                  <Stack spacing={2.5}>
                    <Box sx={{ color: "secondary.light" }}>{tool.icon}</Box>
                    <Typography variant="h6" sx={{ color: "common.white" }}>
                      {tool.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(243, 233, 219, 0.72)" }}>
                      {tool.description}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
}
