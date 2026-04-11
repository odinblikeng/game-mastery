import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { MonsterData } from "@/types/monster";

const abilityOrder = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;

function formatModifier(modifier: number) {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

function formatList(values?: string[]) {
  return values?.length ? values.join(", ") : null;
}

type TraitSectionProps = {
  title: string;
  items?: Array<{
    name: string;
    description: string;
  }>;
};

function TraitSection({ title, items }: TraitSectionProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <Stack spacing={1}>
      <Typography variant="h6">{title}</Typography>
      <Stack spacing={1.25}>
        {items.map((item) => (
          <Box key={`${title}-${item.name}`}>
            <Typography component="p" variant="body2" sx={{ lineHeight: 1.7 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>
                {item.name}. 
              </Box>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

export default function MonsterStatBlock({ monster }: { monster: MonsterData }) {
  const armorClassLabel = monster.armorClass.type
    ? `${monster.armorClass.value} (${monster.armorClass.type})`
    : `${monster.armorClass.value}`;
  const hitPointsLabel = monster.hitPoints.formula
    ? `${monster.hitPoints.value} (${monster.hitPoints.formula})`
    : `${monster.hitPoints.value}`;
  const speedLabel = Object.entries(monster.speed)
    .map(([type, value]) => `${type} ${value}`)
    .join(", ");
  const details = [
    { label: "Senses", value: monster.senses },
    { label: "Languages", value: monster.languages },
    {
      label: "Challenge",
      value: monster.challenge ? `${monster.challenge.rating} (${monster.challenge.xp} XP)` : undefined,
    },
    {
      label: "Proficiency Bonus",
      value: monster.proficiencyBonus != null ? formatModifier(monster.proficiencyBonus) : undefined,
    },
    { label: "Damage Vulnerabilities", value: formatList(monster.damageVulnerabilities) ?? undefined },
    { label: "Damage Resistances", value: formatList(monster.damageResistances) ?? undefined },
    { label: "Damage Immunities", value: formatList(monster.damageImmunities) ?? undefined },
    { label: "Condition Immunities", value: formatList(monster.conditionImmunities) ?? undefined },
  ].filter((detail) => Boolean(detail.value));

  return (
    <Stack spacing={3}>
      {monster.image ? (
        <Box
          component="img"
          src={monster.image}
          alt={monster.name}
          sx={{
            width: "100%",
            maxHeight: 260,
            objectFit: "contain",
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        />
      ) : null}

      <Stack spacing={1}>
        <Typography variant="h4">{monster.name}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {monster.size} {monster.type}
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip label={`AC ${armorClassLabel}`} color="primary" variant="outlined" />
          <Chip label={`HP ${hitPointsLabel}`} color="secondary" variant="outlined" />
          <Chip label={`Speed ${speedLabel}`} variant="outlined" />
        </Stack>
      </Stack>

      <Divider />

      <Stack spacing={1.5}>
        <Typography variant="h6">Ability Scores</Typography>
        <Table size="small" aria-label={`${monster.name} ability scores`}>
          <TableHead>
            <TableRow>
              {abilityOrder.map((ability) => (
                <TableCell key={ability} align="center" sx={{ fontWeight: 700 }}>
                  {ability}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {abilityOrder.map((ability) => (
                <TableCell key={ability} align="center">
                  <Stack spacing={0.25}>
                    <Typography fontWeight={700}>{monster.abilityScores[ability].score}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatModifier(monster.abilityScores[ability].modifier)}
                    </Typography>
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Stack>

      {details.length ? (
        <>
          <Divider />
          <Stack spacing={1}>
            {details.map((detail) => (
              <Typography key={detail.label} variant="body2" sx={{ lineHeight: 1.7 }}>
                <Box component="span" sx={{ fontWeight: 700 }}>
                  {detail.label}. 
                </Box>
                {detail.value}
              </Typography>
            ))}
          </Stack>
        </>
      ) : null}

      <TraitSection title="Abilities" items={monster.traits} />
      <TraitSection title="Actions" items={monster.actions} />
    </Stack>
  );
}