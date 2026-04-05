export type MonsterAbilityScore = {
  score: number;
  modifier: number;
};

export type MonsterData = {
  name: string;
  size: string;
  type: string;
  image?: string;
  armorClass: {
    value: number;
    type?: string;
  };
  hitPoints: {
    value: number;
    formula?: string;
  };
  speed: Record<string, string>;
  abilityScores: {
    STR: MonsterAbilityScore;
    DEX: MonsterAbilityScore;
    CON: MonsterAbilityScore;
    INT: MonsterAbilityScore;
    WIS: MonsterAbilityScore;
    CHA: MonsterAbilityScore;
  };
  damageVulnerabilities?: string[];
  damageResistances?: string[];
  damageImmunities?: string[];
  conditionImmunities?: string[];
  senses?: string;
  languages?: string;
  challenge?: {
    rating: string;
    xp: number;
  };
  proficiencyBonus?: number;
  traits?: Array<{
    name: string;
    description: string;
  }>;
  actions?: Array<{
    name: string;
    description: string;
  }>;
};

export type MonsterSummary = {
  slug: string;
  name: string;
  dexModifier: number;
  hp: number;
};