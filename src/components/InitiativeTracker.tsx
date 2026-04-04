"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useId, useRef, useState } from "react";

function SkullIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 2C7.58 2 4 5.58 4 10c0 2.76 1.34 5.2 3.4 6.72V20c0 .55.45 1 1 1h1.1c.55 0 1-.45 1-1v-1h1v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h1v1c0 .55.45 1 1 1h1.1c.55 0 1-.45 1-1v-3.28C18.66 15.2 20 12.76 20 10c0-4.42-3.58-8-8-8zm-2.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </SvgIcon>
  );
}

type Character = {
  id: string;
  name: string;
  bonus: number;
  roll: number | "";
};

type ResolvedCharacter = {
  id: string;
  name: string;
  bonus: number;
  total: number;
  dying: boolean;
  successes: number;
  failures: number;
};

/* ------------------------------------------------------------------ */
/*  Sortable row used after Ready                                     */
/* ------------------------------------------------------------------ */

function SortableRow({
  char,
  isActive,
  onDelete,
  onToggleDying,
  onUpdateSaves,
}: {
  char: ResolvedCharacter;
  isActive: boolean;
  onDelete: (id: string) => void;
  onToggleDying: (id: string) => void;
  onUpdateSaves: (id: string, field: "successes" | "failures", delta: number) => void;
}) {
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

  const isSkipped = char.dying && char.failures >= 3;
  const isStabilized = char.dying && char.successes >= 3;

  return (
    <Stack
      ref={setNodeRef}
      style={style}
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        py: 0.75,
        px: 1,
        borderRadius: 2,
        flexWrap: "wrap",
        ...(isActive && !char.dying && {
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }),
        ...(isActive && char.dying && {
          border: 2,
          borderColor: "primary.main",
        }),
        ...(char.dying && {
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
      <Typography sx={{ flex: 1, fontWeight: isActive && !char.dying ? 700 : 400 }}>
        {char.name}
      </Typography>
      <Typography
        sx={{ fontWeight: 700, minWidth: 32, textAlign: "right" }}
      >
        {char.total}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onToggleDying(char.id)}
        sx={{ color: char.dying ? "error.main" : "inherit" }}
        aria-label={char.dying ? `Revive ${char.name}` : `Mark ${char.name} as dying`}
      >
        <SkullIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => onDelete(char.id)}
        sx={{ color: "inherit" }}
        aria-label={`Remove ${char.name}`}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
      {char.dying && !isStabilized && !isSkipped && (
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
          Dead
        </Typography>
      )}
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function InitiativeTracker() {
  const baseId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [resolved, setResolved] = useState<ResolvedCharacter[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [totalTurns, setTotalTurns] = useState(0);

  /* form state for adding a new character */
  const [newName, setNewName] = useState("");
  const [newBonus, setNewBonus] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /* ---- helpers ---- */

  const nextId = () => `${baseId}-${Date.now()}-${Math.random()}`;

  const handleColumnTab = (
    e: React.KeyboardEvent,
    col: string,
    index: number,
  ) => {
    if (e.key !== "Tab" || e.shiftKey) return;
    const container = listRef.current;
    if (!container) return;

    /* try the same column in the next row */
    const nextInCol = container.querySelector<HTMLInputElement>(
      `[data-col="${col}"][data-row="${index + 1}"]`,
    );
    if (nextInCol) {
      e.preventDefault();
      nextInCol.focus();
      return;
    }

    /* column exhausted — jump to the first field of the next column */
    const nextCol = col === "bonus" ? "roll" : null;
    if (nextCol) {
      const first = container.querySelector<HTMLInputElement>(
        `[data-col="${nextCol}"][data-row="0"]`,
      );
      if (first) {
        e.preventDefault();
        first.focus();
      }
    }
    /* if nextCol is null (roll column done), let default Tab move to Ready button */
  };

  const addCharacter = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setCharacters((prev) => [
      ...prev,
      {
        id: nextId(),
        name: trimmed,
        bonus: newBonus === "" ? 0 : Number(newBonus),
        roll: "",
      },
    ]);
    setNewName("");
    setNewBonus("");
    nameInputRef.current?.focus();
  };

  const updateCharacter = (
    id: string,
    field: "name" | "bonus" | "roll",
    value: string,
  ) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (field === "name") return { ...c, name: value };
        if (field === "bonus")
          return { ...c, bonus: value === "" ? 0 : Number(value) };
        return { ...c, roll: value === "" ? "" : Number(value) };
      }),
    );
  };

  const deleteCharacter = (id: string) => {
    if (isReady) {
      setResolved((prev) => {
        const next = prev.filter((c) => c.id !== id);
        setActiveIndex((i) =>
          next.length === 0 ? 0 : Math.min(i, next.length - 1),
        );
        return next;
      });
    } else {
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleReady = () => {
    const sorted = characters
      .map((c) => ({
        id: c.id,
        name: c.name,
        bonus: c.bonus,
        total: (c.roll === "" ? 0 : c.roll) + c.bonus,
        dying: false,
        successes: 0,
        failures: 0,
      }))
      .sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        return b.bonus - a.bonus;
      });
    setResolved(sorted);
    setIsReady(true);
  };

  const handleReset = () => {
    setIsReady(false);
    setResolved([]);
    setCharacters([]);
    setActiveIndex(0);
    setRound(1);
    setTotalTurns(0);
  };

  const toggleDying = (id: string) => {
    setResolved((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, dying: !c.dying, successes: 0, failures: 0 }
          : c,
      ),
    );
  };

  const updateSaves = (
    id: string,
    field: "successes" | "failures",
    delta: number,
  ) => {
    setResolved((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const val = Math.max(0, Math.min(3, c[field] + delta));
        return { ...c, [field]: val };
      }),
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setResolved((prev) => {
        const oldIndex = prev.findIndex((c) => c.id === active.id);
        const newIndex = prev.findIndex((c) => c.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const isCharDead = (c: ResolvedCharacter) =>
    c.dying && c.failures >= 3;

  const formatTime = (turns: number) => {
    const seconds = turns * 6;
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  /* ---- READY / COMBAT VIEW ---- */

  if (isReady) {
    return (
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              Round {round} &middot; {formatTime(totalTurns)}
            </Typography>
          </Stack>
          <Button size="small" onClick={handleReset}>
            Reset
          </Button>
        </Stack>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={resolved.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {resolved.map((char, index) => (
              <SortableRow
                key={char.id}
                char={char}
                isActive={index === activeIndex}
                onDelete={deleteCharacter}
                onToggleDying={toggleDying}
                onUpdateSaves={updateSaves}
              />
            ))}
          </SortableContext>
        </DndContext>

        {resolved.length === 0 && (
          <Typography color="text.secondary" variant="body2">
            All characters removed.
          </Typography>
        )}

        {resolved.length > 0 && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{
              pt: 1,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <IconButton
              onClick={() => {
                const len = resolved.length;
                let next = activeIndex;
                for (let step = 0; step < len; step++) {
                  next = next <= 0 ? len - 1 : next - 1;
                  if (next === len - 1) setRound((r) => Math.max(1, r - 1));
                  if (!isCharDead(resolved[next])) break;
                }
                setActiveIndex(next);
                setTotalTurns((t) => Math.max(0, t - 1));
              }}
              aria-label="Previous turn"
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Turn {activeIndex + 1} / {resolved.length}
            </Typography>
            <IconButton
              onClick={() => {
                const len = resolved.length;
                let next = activeIndex;
                for (let step = 0; step < len; step++) {
                  next = next >= len - 1 ? 0 : next + 1;
                  if (next === 0) setRound((r) => r + 1);
                  if (!isCharDead(resolved[next])) break;
                }
                setActiveIndex(next);
                setTotalTurns((t) => t + 1);
              }}
              aria-label="Next turn"
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          </Stack>
        )}
      </Stack>
    );
  }

  /* ---- SETUP VIEW ---- */

  return (
    <Stack spacing={2}>
      {/* Add character form */}
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <TextField
          inputRef={nameInputRef}
          label="Name"
          size="small"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addCharacter();
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Bonus"
          size="small"
          type="number"
          value={newBonus}
          onChange={(e) => setNewBonus(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addCharacter();
          }}
          sx={{ width: 72 }}
        />
        <IconButton onClick={addCharacter} color="primary" aria-label="Add character">
          <AddRoundedIcon />
        </IconButton>
      </Stack>

      {/* Character list */}
      {characters.length > 0 && (
        <Stack spacing={1} ref={listRef}>
          {characters.map((char, idx) => (
            <Stack
              key={char.id}
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ px: 1 }}
            >
              <Typography sx={{ flex: 1, fontSize: "0.875rem" }}>
                {char.name}
              </Typography>
              <TextField
                size="small"
                type="number"
                placeholder="Bonus"
                value={char.bonus === 0 ? "" : char.bonus}
                onChange={(e) =>
                  updateCharacter(char.id, "bonus", e.target.value)
                }
                onKeyDown={(e) => handleColumnTab(e, "bonus", idx)}
                sx={{ width: 64 }}
                slotProps={{ htmlInput: { "data-col": "bonus", "data-row": idx, "aria-label": `${char.name} bonus` } }}
              />
              <TextField
                size="small"
                type="number"
                placeholder="Roll"
                value={char.roll}
                onChange={(e) =>
                  updateCharacter(char.id, "roll", e.target.value)
                }
                onKeyDown={(e) => handleColumnTab(e, "roll", idx)}
                sx={{ width: 64 }}
                slotProps={{ htmlInput: { "data-col": "roll", "data-row": idx, "aria-label": `${char.name} roll` } }}
              />
              <IconButton
                size="small"
                onClick={() => deleteCharacter(char.id)}
                aria-label={`Remove ${char.name}`}
                tabIndex={-1}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      )}

      {/* Ready button */}
      {characters.length > 0 && (
        <Button variant="contained" onClick={handleReady} fullWidth>
          Ready
        </Button>
      )}
    </Stack>
  );
}
