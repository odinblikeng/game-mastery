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
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useId, useRef, useState } from "react";
import type { MonsterSummary } from "@/types/monster";

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
  maxHp?: number;
  monsterSlug?: string;
  copyIndex?: number;
};

type ResolvedCharacter = {
  id: string;
  name: string;
  bonus: number;
  total: number;
  dying: boolean;
  successes: number;
  failures: number;
  hp?: number;
  maxHp?: number;
  monsterSlug?: string;
  copyIndex?: number;
};

type MonsterNamedEntry = {
  name: string;
  monsterSlug?: string;
  copyIndex?: number;
};

const toTestId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const renumberMonsterCopies = <T extends MonsterNamedEntry>(
  items: T[],
  monsterNameBySlug: Map<string, string>,
): T[] => {
  const totals = new Map<string, number>();

  for (const item of items) {
    if (!item.monsterSlug) {
      continue;
    }

    totals.set(item.monsterSlug, (totals.get(item.monsterSlug) ?? 0) + 1);
  }

  const seen = new Map<string, number>();

  return items.map((item) => {
    if (!item.monsterSlug) {
      return item;
    }

    const total = totals.get(item.monsterSlug) ?? 0;
    const baseName = monsterNameBySlug.get(item.monsterSlug) ?? item.name.replace(/ \d+$/, "");
    const index = (seen.get(item.monsterSlug) ?? 0) + 1;
    const nextName = total > 1 ? `${baseName} ${index}` : baseName;
    const nextCopyIndex = total > 1 ? index : undefined;

    seen.set(item.monsterSlug, index);

    return item.name === nextName && item.copyIndex === nextCopyIndex
      ? item
      : { ...item, name: nextName, copyIndex: nextCopyIndex };
  });
};

/* ------------------------------------------------------------------ */
/*  Sortable row used after Ready                                     */
/* ------------------------------------------------------------------ */

function SortableRow({
  char,
  isActive,
  onDelete,
  onToggleDying,
  onSetHp,
  onUpdateSaves,
}: {
  char: ResolvedCharacter;
  isActive: boolean;
  onDelete: (id: string) => void;
  onToggleDying: (id: string) => void;
  onSetHp: (id: string, value: string) => void;
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

  const isMonster = typeof char.maxHp === "number";
  const currentHp = isMonster ? (char.hp ?? char.maxHp) : null;
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
      <Typography sx={{ flex: 1, fontWeight: isActive && !char.dying ? 700 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
        {baseDisplayName}
      </Typography>
      {char.copyIndex != null ? (
        <Chip label={`#${char.copyIndex}`} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
      ) : null}
      {isMonster ? (
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            HP
          </Typography>
          <TextField
            size="small"
            type="number"
            value={currentHp ?? ""}
            onChange={(event) => onSetHp(char.id, event.target.value)}
            sx={{
              width: 78,
              "& .MuiInputBase-root": {
                height: 32,
                color: "inherit",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "currentColor",
              },
            }}
            slotProps={{
              htmlInput: {
                min: 0,
                max: char.maxHp,
                "aria-label": `Current HP for ${char.name}`,
                "data-testid": `cy-initiative-hp-${toTestId(char.name)}`,
              },
            }}
          />
          <Typography variant="caption" sx={{ minWidth: 38 }}>
            / {char.maxHp}
          </Typography>
        </Stack>
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

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function InitiativeTracker({ monsters }: { monsters: MonsterSummary[] }) {
  const baseId = useId();
  const nextIdRef = useRef(0);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const shouldRefocusNameInputRef = useRef(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [resolved, setResolved] = useState<ResolvedCharacter[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [totalTurns, setTotalTurns] = useState(0);

  /* form state for adding a new character */
  const [newName, setNewName] = useState("");
  const [newBonus, setNewBonus] = useState("");
  const [monsterMenuAnchor, setMonsterMenuAnchor] = useState<HTMLElement | null>(null);

  const monsterNameBySlug = new Map(monsters.map((monster) => [monster.slug, monster.name]));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /* ---- helpers ---- */

  const nextId = () => {
    nextIdRef.current += 1;
    return `${baseId}-${nextIdRef.current}`;
  };

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

  const addMonsterCharacter = (monster: MonsterSummary) => {
    setCharacters((prev) =>
      renumberMonsterCopies(
        [
          ...prev,
          {
            id: nextId(),
            name: monster.name,
            bonus: monster.dexModifier,
            roll: "",
            maxHp: monster.hp,
            monsterSlug: monster.slug,
          },
        ],
        monsterNameBySlug,
      ),
    );
    shouldRefocusNameInputRef.current = true;
    setMonsterMenuAnchor(null);
  };

  const handleMonsterMenuExited = () => {
    if (!shouldRefocusNameInputRef.current) {
      return;
    }

    shouldRefocusNameInputRef.current = false;
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
        const next = renumberMonsterCopies(
          prev.filter((c) => c.id !== id),
          monsterNameBySlug,
        );
        setActiveIndex((i) =>
          next.length === 0 ? 0 : Math.min(i, next.length - 1),
        );
        return next;
      });
    } else {
      setCharacters((prev) =>
        renumberMonsterCopies(
          prev.filter((c) => c.id !== id),
          monsterNameBySlug,
        ),
      );
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
        hp: c.maxHp,
        maxHp: c.maxHp,
        monsterSlug: c.monsterSlug,
        copyIndex: c.copyIndex,
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
        c.id === id && typeof c.maxHp !== "number"
          ? { ...c, dying: !c.dying, successes: 0, failures: 0 }
          : c,
      ),
    );
  };

  const setHp = (id: string, value: string) => {
    setResolved((prev) =>
      prev.map((c) => {
        if (c.id !== id || typeof c.maxHp !== "number") {
          return c;
        }

        const nextValue = value === "" ? 0 : Number(value);

        if (Number.isNaN(nextValue)) {
          return c;
        }

        return {
          ...c,
          hp: Math.max(0, Math.min(c.maxHp, nextValue)),
        };
      }),
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
    typeof c.maxHp === "number" ? (c.hp ?? c.maxHp) <= 0 : c.dying && c.failures >= 3;

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
              <span data-testid="cy-initiative-round-status">
              Round {round} &middot; {formatTime(totalTurns)}
              </span>
            </Typography>
          </Stack>
          <Button size="small" onClick={handleReset} data-testid="cy-initiative-reset-button">
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
                onSetHp={setHp}
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
              data-testid="cy-initiative-previous-turn"
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary" data-testid="cy-initiative-turn-status">
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
              data-testid="cy-initiative-next-turn"
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
          slotProps={{ htmlInput: { "data-testid": "cy-initiative-name-input" } }}
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
          slotProps={{ htmlInput: { "data-testid": "cy-initiative-bonus-input" } }}
          sx={{ width: 72 }}
        />
        <IconButton
          onClick={addCharacter}
          color="primary"
          aria-label="Add character"
          data-testid="cy-initiative-add-character"
        >
          <AddRoundedIcon />
        </IconButton>
        {monsters.length > 0 ? (
          <IconButton
            onClick={(event) => setMonsterMenuAnchor(event.currentTarget)}
            color="secondary"
            aria-label="Add monster"
            data-testid="cy-initiative-add-monster"
          >
            <PetsRoundedIcon />
          </IconButton>
        ) : null}
      </Stack>
      <Menu
        anchorEl={monsterMenuAnchor}
        open={Boolean(monsterMenuAnchor)}
        onClose={() => setMonsterMenuAnchor(null)}
        disableRestoreFocus
        slotProps={{
          transition: {
            onExited: handleMonsterMenuExited,
          },
        }}
      >
        {monsters.map((monster) => (
          <MenuItem
            key={monster.slug}
            onClick={() => addMonsterCharacter(monster)}
            data-testid={`cy-initiative-monster-option-${toTestId(monster.name)}`}
          >
            <Stack spacing={0.25}>
              <Typography variant="body2" fontWeight={700}>
                {monster.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Bonus {monster.dexModifier >= 0 ? `+${monster.dexModifier}` : monster.dexModifier} · HP {monster.hp}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>

      {/* Character list */}
      {characters.length > 0 && (
        <Stack spacing={1} ref={listRef}>
          {characters.map((char, idx) => (
            <Stack
              key={char.id}
              data-testid={`cy-initiative-setup-${toTestId(char.name)}`}
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ px: 1 }}
            >
              <Typography sx={{ flex: 1, fontSize: "0.875rem", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                {char.copyIndex != null ? char.name.replace(/ \d+$/, '') : char.name}
              </Typography>
              {char.copyIndex != null ? (
                <Chip label={`#${char.copyIndex}`} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
              ) : null}
              {typeof char.maxHp === "number" ? (
                <Chip
                  label={`HP ${char.maxHp}`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  data-testid={`cy-initiative-setup-hp-${toTestId(char.name)}`}
                />
              ) : null}
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
        <Button variant="contained" onClick={handleReady} fullWidth data-testid="cy-initiative-ready-button">
          Ready
        </Button>
      )}
    </Stack>
  );
}
