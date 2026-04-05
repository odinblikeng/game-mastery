"use client";

import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import { toTestId } from "@/lib/initiative";

type MonsterHpChipProps = {
  id: string;
  name: string;
  currentHp: number;
  maxHp: number;
  onSetHp: (id: string, value: string) => void;
};

export default function MonsterHpChip({
  id,
  name,
  currentHp,
  maxHp,
  onSetHp,
}: MonsterHpChipProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftHp, setDraftHp] = useState(String(currentHp));
  const inputRef = useRef<HTMLInputElement>(null);
  const skipBlurCommitRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const exitEditor = () => {
    setIsEditing(false);
    skipBlurCommitRef.current = false;
  };

  const commitDraft = () => {
    onSetHp(id, draftHp);
    exitEditor();
  };

  return isEditing ? (
    <TextField
      inputRef={inputRef}
      size="small"
      type="number"
      value={draftHp}
      onChange={(event) => setDraftHp(event.target.value)}
      onBlur={() => {
        if (skipBlurCommitRef.current) {
          skipBlurCommitRef.current = false;
          return;
        }

        commitDraft();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commitDraft();
        }

        if (event.key === "Escape") {
          event.preventDefault();
          skipBlurCommitRef.current = true;
          setDraftHp(String(currentHp));
          exitEditor();
        }
      }}
      sx={{
        width: 74,
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
          max: maxHp,
          inputMode: "numeric",
          "aria-label": `Current HP for ${name}`,
          "data-testid": `cy-initiative-hp-${toTestId(name)}`,
        },
      }}
    />
  ) : (
    <Chip
      clickable
      size="small"
      variant="outlined"
      label={`HP ${currentHp}/${maxHp}`}
      onClick={(event) => {
        event.stopPropagation();
        setDraftHp(String(currentHp));
        setIsEditing(true);
      }}
      aria-label={`Edit HP for ${name}`}
      data-testid={`cy-initiative-hp-chip-${toTestId(name)}`}
      color={currentHp <= 0 ? "error" : currentHp < maxHp ? "warning" : "default"}
      sx={{
        fontWeight: 700,
        maxWidth: 108,
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  );
}
