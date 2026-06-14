export type TreasureData = {
  name: string;
  description: string;
  value?: string;
  type?: string;
  image?: string;
};

export type TreasureSummary = {
  slug: string;
  name: string;
  value?: string;
};

export type TreasureDataMap = Record<string, TreasureData>;
