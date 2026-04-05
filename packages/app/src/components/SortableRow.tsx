"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ResolvedCharacter } from "@/types/initiative";
import { toTestId } from "@/lib/initiative";
import MonsterHpChip from "@/components/MonsterHpChip";
import SkullIcon from "@/components/SkullIcon";

type SortableRowProps = {
  char: ResolvedCharacter;
  isActive: boolean;
  onDelete: (id: string) => void;
  onToggleDying: (id: string) => void;
  onSetHp: (id: string, value: string) => void;
  onUpdateSaves: (id: string, field: "successes" | "failures", delta: number) => void;
};

export default function SortableRow({
  char,
  isActive,
  onDelete,
  onToggleDying,
  onSetHp,
  onUpdateSaves,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: char.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isMonster = typeof char.maxHp === "number";
  const currentHp = isMonster ? (char.hp ?? char.maxHp ?? 0) : null;
  const isSkipped = isMonster ? (currentHp ?? 0) <= 0 : char.dying && char.failures >= 3;
  const isStabilized = !isMonster && char.dying && char.successes >= 3;
  const baseDisplayName = char.copyIndex != null
    ? char.name.replace(/ \d+$/, "")
    : char.name;

  return (
    <Stack
      ref={setNodeRef}
      style={style}
      data-testid={`cy-initiative-row-${toTestId(char.name)}`}
      data-active={isActive ? "true" : "false"}
      data-state={isSkipped ? "dead" : isStabilized ? "stabilized" : char.dying ? "dying" : "ready"}
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        py: 0.75,
        px: 1,
        borderRadius: 2,
        flexWrap: "wrap",
        ...(isActive && !isSkipped && !char.dying && {
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }),
        ...(isActive && !isMonster && char.dying && {
          border: 2,
          borderColor: "primary.main",
        }),
        ...((char.dying || isSkipped) && {
          opacity: isSkipped ? 0.3 : 0.55,
          ...(isSkipped && { textDecoration: "line-through" }),
        }),
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{ display: "flex", cursor: "grab", color: "inherit" }}
      >
        <DragIndicatorRoundedIcon fontSize="small" />
      </Box>
      <Typography
        data-testid={`cy-initiative-row-name-${toTestId(char.name)}`}
        title={baseDisplayName}
        sx={{ flex: 1, fontWeight: isActive && !char.dying ? 700 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}
      >
        {baseDisplayName}
      </Typography>
      {char.copyIndex != null ? (
        <Chip label={`#${char.copyIndex}`} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
      ) : null}
      {isMonster ? (
        <MonsterHpChip
          id={char.id}
          name={char.name}
          currentHp={currentHp ?? 0}
          maxHp={char.maxHp ?? 0}
          onSetHp={onSetHp}
        />
      ) : null}
      <Typography
        sx={{ fontWeight: 700, minWidth: 32, textAlign: "right" }}
      >
        {char.total}
      </Typography>
      {!isMonster ? (
        <IconButton
          size="small"
          onClick={() => onToggleDying(char.id)}
          sx={{ color: char.dying ? "error.main" : "inherit" }}
          aria-label={char.dying ? `Revive ${char.name}` : `Mark ${char.name} as dying`}
        >
          <SkullIcon fontSize="small" />
        </IconButton>
      ) : null}
      <IconButton
        size="small"
        onClick={() => onDelete(char.id)}
        sx={{ color: "inherit" }}
        aria-label={`Remove ${char.name}`}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
      {!isMonster && char.dying && !isStabilized && !isSkipped && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ width: "100%", pl: 3.5, pt: 0.25 }}
        >
          <IconButton
            size="small"
            onClick={() => onUpdateSaves(char.id, "successes", -1)}
            disabled={char.successes <= 0}
            aria-label="Remove success"
          >
            <RemoveRoundedIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <Chip
            label={`${char.successes} / ${char.failures}`}
            size="small"
            color={char.successes > char.failures ? "success" : char.failures > char.successes ? "error" : "default"}
            variant="outlined"
            data-testid={`cy-initiative-saves-${toTestId(char.name)}`}
            sx={{ fontWeight: 700, minWidth: 48 }}
          />
          <IconButton
            size="small"
            onClick={() => onUpdateSaves(char.id, "failures", -1)}
            disabled={char.failures <= 0}
            aria-label="Remove failure"
          >
            <RemoveRoundedIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            size="small"
            color="success"
            variant="outlined"
            onClick={() => onUpdateSaves(char.id, "successes", 1)}
            disabled={char.successes >= 3}
            sx={{ minWidth: 0, px: 1, fontSize: "0.7rem" }}
          >
            Save
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => onUpdateSaves(char.id, "failures", 1)}
            disabled={char.failures >= 3}
            sx={{ minWidth: 0, px: 1, fontSize: "0.7rem" }}
          >
            Fail
          </Button>
        </Stack>
      )}
      {isStabilized && (
        <Typography variant="caption" color="success.main" sx={{ width: "100%", pl: 3.5 }}>
          Stabilized
        </Typography>
      )}
      {isSkipped && (
        <Typography variant="caption" color="error.main" sx={{ width: "100%", pl: 3.5 }}>
          {isMonster ? "Defeated" : "Dead"}
        </Typography>
      )}
    </Stack>
  );
}
