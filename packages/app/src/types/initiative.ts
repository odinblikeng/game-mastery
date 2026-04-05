export type Character = {
  id: string;
  name: string;
  bonus: number;
  roll: number | "";
  maxHp?: number;
  monsterSlug?: string;
  copyIndex?: number;
};

export type ResolvedCharacter = {
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

export type MonsterNamedEntry = {
  name: string;
  monsterSlug?: string;
  copyIndex?: number;
};
