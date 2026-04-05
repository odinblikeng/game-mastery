"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { MonsterSummary } from "@/types/monster";
import { toTestId, formatTime } from "@/lib/initiative";
import useInitiativeTracker from "@/hooks/useInitiativeTracker";
import SortableRow from "@/components/SortableRow";

export default function InitiativeTracker({ monsters }: { monsters: MonsterSummary[] }) {
  const {
    nameInputRef,
    listRef,
    characters,
    resolved,
    isReady,
    activeIndex,
    round,
    totalTurns,
    newName,
    newBonus,
    monsterMenuAnchor,
    setNewName,
    setNewBonus,
    addCharacter,
    addMonsterCharacter,
    handleMonsterMenuExited,
    updateCharacter,
    deleteCharacter,
    handleReady,
    handleReset,
    toggleDying,
    setHp,
    updateSaves,
    handleDragEnd,
    handleColumnTab,
    previousTurn,
    nextTurn,
    openMonsterMenu,
    closeMonsterMenu,
  } = useInitiativeTracker(monsters);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
              onClick={previousTurn}
              aria-label="Previous turn"
              data-testid="cy-initiative-previous-turn"
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary" data-testid="cy-initiative-turn-status">
              Turn {activeIndex + 1} / {resolved.length}
            </Typography>
            <IconButton
              onClick={nextTurn}
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
            onClick={openMonsterMenu}
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
        onClose={closeMonsterMenu}
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
              <Typography
                data-testid={`cy-initiative-setup-name-${toTestId(char.name)}`}
                title={char.copyIndex != null ? char.name.replace(/ \d+$/, '') : char.name}
                sx={{ flex: 1, fontSize: "0.875rem", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}
              >
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
