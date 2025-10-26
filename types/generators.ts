// --- SHARED TYPES ---
export type SettlementWealth = "Village" | "Town" | "City";
export type LevelTier = '1-4' | '5-10' | '11-16' | '17-20';

// --- BOOK GENERATOR ---
export type BookThemeName = 'magic' | 'nature' | 'religion' | 'history' | 'fiction' | 'forbidden';
export type BookDisplayMode = 'vibe' | 'quick' | 'story';
export type BookMagicPropertyType = 'None' | 'Minor Property' | 'Magical Quirk' | 'Minor Sentience';

export interface BookAuthor {
  name: string;
  authorQuirk: string;
  hook: string;
}

export interface BookThemeData {
  titlePrefix: string[];
  titleSuffix: string[];
  description: string[];
  authors: BookAuthor[];
}

export interface BookGenData {
  themes: Record<BookThemeName, BookThemeData>;
  appearance: string[];
  condition: string[];
  sensation: {
    smell: string[];
    feel: string[];
  };
  magicalProperties: string[];
  magicalQuirks: string[];
  sentientPersonalities: string[];
  sentientPurposes: string[];
}

export interface GeneratedBook {
  title: string;
  appearance: string;
  sensation: string;
  description: string;
  author: string;
  authorQuirk: string;
  hook: string;
  magicalProperty: string;
  magicalQuirk: string;
  sentience: string;
}

export type BookLockedComponents = {
  [key in keyof GeneratedBook]?: boolean;
};

// --- ENCOUNTER GENERATOR ---
export type EncounterGeneratorMode = 'Encounter Seed' | 'Random Encounter' | 'Chase Complication';
export type TerrainType = "Arctic" | "Coastal" | "Desert" | "Forest" | "Grassland" | "Hill" | "Mountain" | "Swamp" | "Underdark" | "Urban" | "Waterborne";
export type ChaseType = "Urban" | "Wilderness";

export interface GeneratedSeed {
  location: string;
  creature: string;
  situation: string;
  complication: string;
  reason: string;
}

export type LockedSeedComponents = {
  [key in keyof GeneratedSeed]?: boolean;
};

export interface GeneratedRandomEncounter {
  terrain: TerrainType;
  encounterRoll: number;
  result: string;
  distance?: string;
}

export interface GeneratedChaseComplication {
  type: ChaseType;
  roll: number;
  result: string;
}

export interface EncounterGenData {
  seedData: {
    location: string[];
    creature: string[];
    situation: string[];
    complication: string[];
    reason: string[];
  };
  randomEncounterData: {
    terrains: TerrainType[];
    encounterDistanceByTerrain: { [key in TerrainType]: string };
    encountersByTerrain: { [key in TerrainType]: string[] };
  };
  chaseData: {
    types: ChaseType[];
    complications: { [key in ChaseType]: { minRoll: number; maxRoll: number; text: string }[] };
  };
}

// --- QUEST GENERATOR ---
export type QuestGeneratorMode = 'Quest Seed' | 'Adventure Situation';
export type HookType = 'Patron Hook' | 'Supernatural Hook' | 'Happenstance Hook';
// LevelTier is shared

export interface GeneratedQuestSeed {
  hook: string;
  objective: string;
  target: string;
  location: string;
  complication: string;
  climax: string;
}

export type LockedQuestSeed = {
  [key in keyof GeneratedQuestSeed]?: boolean;
};

export interface GeneratedAdventureSituation {
  levelTier: LevelTier;
  situation: string;
}

export interface QuestGenData {
  hookTypes: HookType[];
  hooks: { [key in HookType]: string[] };
  objectives: string[];
  targets: string[];
  locations: string[];
  complications: string[];
  climaxes: string[];
  levelTiers: LevelTier[];
  situationsByLevel: { [key in LevelTier]: string[] };
}

// --- POI GENERATOR ---
export interface PoiData {
  poiTypes: string[];
  namePrefix: { [key: string]: string[] };
  nameSuffix: { [key: string]: string[] };
  keyFigure: string[];
  aesthetic: string[];
  speciality: { [key: string]: string[] };
  conflict: string[];
}

export interface GeneratedPoi {
  name?: string;
  type?: string;
  keyFigure?: string;
  aesthetic?: string;
  speciality?: string;
  conflict?: string;
}

// --- SHOP GENERATOR ---
export interface ShopNameParts {
  [key: string]: string[];
}

export interface ShopNotableItems {
  [key: string]: string[];
}

export interface ShopStockLevels {
  [key: string]: {
    "Village": string[];
    "Town": string[];
    "City": string[];
  };
}

export interface ShopGenData {
  shopTypes: string[];
  wealthLevels: SettlementWealth[];
  namePrefix: ShopNameParts;
  nameSuffix: ShopNameParts;
  proprietor: string[];
  aesthetic: string[];
  notableItem: ShopNotableItems;
  stockLevel: ShopStockLevels;
  conflict: string[];
}

export interface GeneratedShop {
  name: string;
  type: string;
  wealth: SettlementWealth;
  proprietor: string;
  aesthetic: string;
  stockLevel: string;
  notableItem: string;
  conflict: string;
}

export type ShopLockedComponents = {
  [key in keyof GeneratedShop]?: boolean;
};

// --- LOOT GENERATOR ---
export type LootGeneratorMode = 'Story' | 'Hoard';
export type CrTier = '0-4' | '5-10' | '11-16' | '17+';
export type HoardTheme = 'Any' | 'Arcana' | 'Armaments' | 'Implements' | 'Relics';
export type MagicItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary';

export interface StoryLootData {
  container: string[];
  mundaneContents: string[];
  keyItem: string[];
  detail: string[];
}

export interface GeneratedStoryLoot {
  container: string;
  mundaneContents: string;
  keyItem: string;
  detail: string;
}

export type LockedStoryLoot = {
  [key in keyof GeneratedStoryLoot]?: boolean;
};

export interface HoardByCrData {
  monetary: string;
  magicItems: string;
}

export interface Gemstone { name: string; value: number }
export interface ArtObject { name: string; value: number }

export interface MagicItemTable {
  [key: string]: string[];
}

export interface TreasureHoardData {
  hoardByCr: { [key in CrTier]: HoardByCrData };
  magicItemRarityByCr: { [key in CrTier]: { roll: number; rarity: MagicItemRarity }[] };
  gemstonesByValue: { [key: number]: string[] };
  artObjectsByValue: { [key: number]: string[] };
  magicItemsByTheme: { [key in HoardTheme]: MagicItemTable } & { Any: MagicItemTable };
}

export interface GeneratedHoard {
  crTier: CrTier;
  theme: HoardTheme;
  totalGPValue: number;
  monetaryForm: (Gemstone | ArtObject | { name: string; value: number })[];
  magicItems: { name: string; rarity: MagicItemRarity; theme: HoardTheme }[];
}

export interface LootGenData {
  storyLoot: StoryLootData;
  treasureHoard: TreasureHoardData;
}

// --- SETTLEMENT GENERATOR ---
export type SettlementType = "Village" | "Town" | "City" | "Hamlet" | "Keep" | "Stronghold";

export interface SettlementNameParts {
  [key: string]: string[];
}

export interface SettlementPopulation {
  [key: string]: string[];
}

export interface SettlementGenData {
  types: SettlementType[];
  namePrefix: SettlementNameParts;
  nameSuffix: SettlementNameParts;
  population: SettlementPopulation;
  descriptor: string[];
  knownFor: string[];
  calamity: string[];
  conflict: string[];
}

export interface GeneratedSettlement {
  name: string;
  type: SettlementType;
  population: string;
  descriptor: string;
  knownFor: string;
  calamity: string;
  conflict: string;
}

export type SettlementLockedComponents = {
  [key in keyof GeneratedSettlement]?: boolean;
};

// --- NAME GENERATOR ---
export type NameCategory = "Dwarf" | "Elf" | "Human" | "Halfling" | "Orc" | "Fantasy" | "Roman" | "Japanese";

export interface NameParts {
  male: string[];
  female: string[];
  surname: string[];
}

export interface NameGenData {
  categories: NameCategory[];
  titles: string[];
  names: Record<string, NameParts>; // Use string key for extensibility
}

export interface GeneratedName {
  category: NameCategory;
  maleName: string;
  femaleName: string;
  surname: string;
  title: string;
}

export type NameLockedComponents = {
  [key in keyof GeneratedName]?: boolean;
};

// --- LANDMASS GENERATOR ---
export type LandmassType = "Continent" | "Island" | "Archipelago" | "Peninsula";
export type LandmassBiomes = "Standard" | "Jungle" | "Desert" | "Arctic" | "Swamp";

export interface LandmassGenData {
  types: LandmassType[];
  biomes: LandmassBiomes[];
  namePrefix: string[];
  nameSuffix: string[];
  shape: string[];
  features: { [key: string]: string[] }; // Biome-specific features
  history: string[];
  mystery: string[];
}

export interface GeneratedLandmass {
  name: string;
  type: LandmassType;
  biome: LandmassBiomes;
  shape: string;
  feature: string;
  history: string;
  mystery: string;
}

export type LandmassLockedComponents = {
  [key in keyof GeneratedLandmass]?: boolean;
};