import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import RuleFolderRoundedIcon from "@mui/icons-material/RuleFolderRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getArea } from "@/lib/areas";

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

type HomeProps = {
  searchParams: Promise<{
    sidebar?: string;
    area?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { sidebar, area } = await searchParams;
  const selectedArea = area ? getArea(area) : null;
  const showAreaSidebar = sidebar === "areas" || Boolean(selectedArea);
  const SelectedAreaContent = selectedArea?.Content;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={{ xs: 4, md: 6 }}>
        <Paper
          id="overview"
          elevation={0}
          sx={{
            overflow: "hidden",
            border: 1,
            borderColor: "divider",
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
            backgroundColor: "background.paper",
            backgroundImage:
              "radial-gradient(circle at top left, rgba(122, 62, 23, 0.18), transparent 38%), radial-gradient(circle at top right, rgba(72, 97, 107, 0.12), transparent 32%)",
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label="Next.js 16" color="primary" variant="outlined" />
              <Chip label="React 19" color="primary" variant="outlined" />
              <Chip label="Material UI" color="primary" variant="outlined" />
              <Chip label="3 area files ready" color="secondary" variant="outlined" />
            </Stack>
            <Stack spacing={2} sx={{ maxWidth: 760 }}>
              <Typography variant="h1" sx={{ fontSize: { xs: "2.5rem", md: "4.25rem" } }}>
                Run the table from one focused control room.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6 }}>
                Game Mastery is your campaign workspace for fast room reference,
                encounter prep, and session-running tools without digging through tabs.
              </Typography>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button href="/?sidebar=areas&area=m1#areas" size="large" variant="contained">
                Open First Area
              </Button>
              <Button href="/?sidebar=areas#areas" size="large" variant="outlined">
                Browse All Areas
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Box id="areas">
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" } }}>
              Area Material
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
              Open the areas sidebar to search by code or title, then load a room into the main workspace without leaving the page.
            </Typography>
          </Stack>
          <Paper
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              p: { xs: 3, md: 4 },
              minHeight: 320,
            }}
          >
            {selectedArea && SelectedAreaContent ? (
              <Stack spacing={3}>
                <Stack spacing={1.5}>
                  <Chip label={selectedArea.code} color="primary" sx={{ alignSelf: "flex-start", fontWeight: 700 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                    {selectedArea.description}
                  </Typography>
                </Stack>
                <Box>
                  <SelectedAreaContent />
                </Box>
              </Stack>
            ) : showAreaSidebar ? (
              <Stack spacing={2} sx={{ maxWidth: 560 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Select an area from the sidebar.
                </Typography>
                <Typography color="text.secondary">
                  The area list is loaded in the app shell. Search by room code or title, then choose an entry to render its notes here.
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={2} sx={{ maxWidth: 560 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Area browser is available on demand.
                </Typography>
                <Typography color="text.secondary">
                  Use the Areas button in the header to open the sidebar without leaving the current page.
                </Typography>
                <Box>
                  <Button href="/?sidebar=areas#areas" variant="contained">
                    Open Areas Sidebar
                  </Button>
                </Box>
              </Stack>
            )}
          </Paper>
        </Box>

        <Box id="session-tools">
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" } }}>
              Planned Session Tools
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
              The shell is ready for the next layer of functionality: structured notes, encounter helpers, and better campaign navigation.
            </Typography>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            }}
          >
            {toolCards.map((tool) => (
              <Paper
                key={tool.title}
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  p: 3,
                  height: "100%",
                }}
              >
                <Stack spacing={2.5}>
                  <Box>{tool.icon}</Box>
                  <Typography variant="h6">{tool.title}</Typography>
                  <Typography color="text.secondary">{tool.description}</Typography>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}
