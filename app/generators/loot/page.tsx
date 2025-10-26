'use client';

import { useState, useEffect } from 'react';

// --- TYPE DEFINITIONS ---

type GeneratorMode = 'Story' | 'Hoard';
type CrTier = '0-4' | '5-10' | '11-16' | '17+';
type HoardTheme = 'Any' | 'Arcana' | 'Armaments' | 'Implements' | 'Relics';
type MagicItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary';

// --- STORY LOOT INTERFACES ---
interface StoryLootData {
  container: string[];
  mundaneContents: string[];
  keyItem: string[];
  detail: string[];
}

interface GeneratedStoryLoot {
  container: string;
  mundaneContents: string;
  keyItem: string;
  detail: string;
}

type LockedStoryLoot = {
  [key in keyof GeneratedStoryLoot]?: boolean;
};

// --- HOARD LOOT INTERFACES ---
interface HoardByCrData {
  monetary: string; // e.g., "2d4 * 100"
  magicItems: string; // e.g., "1d4-1"
}

interface Gemstone { name: string; value: number }
interface ArtObject { name: string; value: number }

interface MagicItemTable {
  [key: string]: string[]; // Rarity: [item, item, ...]
}

interface TreasureHoardData {
  hoardByCr: { [key in CrTier]: HoardByCrData };
  magicItemRarityByCr: { [key in CrTier]: { roll: number; rarity: MagicItemRarity }[] };
  gemstonesByValue: { [key: number]: string[] };
  artObjectsByValue: { [key: number]: string[] };
  magicItemsByTheme: { [key in HoardTheme]: MagicItemTable } & { Any: MagicItemTable };
}

interface GeneratedHoard {
  crTier: CrTier;
  theme: HoardTheme;
  totalGPValue: number;
  monetaryForm: (Gemstone | ArtObject | { name: string; value: number })[];
  magicItems: { name: string; rarity: MagicItemRarity; theme: HoardTheme }[];
}

// --- COMBINED DATA INTERFACE ---
interface LootGenData {
  storyLoot: StoryLootData;
  treasureHoard: TreasureHoardData;
}

// --- DEFAULT DATA (Expanded) ---
const defaultLootGenData: LootGenData = {
  storyLoot: {
    container: ["A rotting leather pouch", "A locked iron coffer"],
    mundaneContents: ["A handful of copper coins (1d12 cp)", "A set of loaded dice"],
    keyItem: ["A sealed letter addressed to a local baron", "A partial map, scorched at the edges"],
    detail: ["It is faintly warm to the touch", "It has a noble's family crest embossed on it"]
  },
  treasureHoard: {
    hoardByCr: {
      '0-4': { monetary: "2d4 * 100", magicItems: "1d4-1" },
      '5-10': { monetary: "8d10 * 100", magicItems: "1d3" },
      '11-16': { monetary: "8d8 * 1000", magicItems: "1d4" },
      '17+': { monetary: "6d10 * 10000", magicItems: "1d6" },
    },
    magicItemRarityByCr: {
      '0-4': [ { roll: 54, rarity: "Common" }, { roll: 91, rarity: "Uncommon" }, { roll: 100, rarity: "Rare" } ],
      '5-10': [ { roll: 30, rarity: "Common" }, { roll: 81, rarity: "Uncommon" }, { roll: 98, rarity: "Rare" }, { roll: 100, rarity: "Very Rare" } ],
      '11-16': [ { roll: 11, rarity: "Common" }, { roll: 34, rarity: "Uncommon" }, { roll: 70, rarity: "Rare" }, { roll: 93, rarity: "Very Rare" }, { roll: 100, rarity: "Legendary" } ],
      '17+': [ { roll: 20, rarity: "Rare" }, { roll: 64, rarity: "Very Rare" }, { roll: 100, rarity: "Legendary" } ]
    },
    gemstonesByValue: {
      10: ["Azurite", "Banded agate"],
      50: ["Bloodstone", "Carnelian"],
      100: ["Amber", "Amethyst"],
      500: ["Alexandrite", "Aquamarine"],
      1000: ["Black opal", "Blue sapphire"],
      5000: ["Black sapphire", "Diamond"]
    },
    artObjectsByValue: {
      25: ["Silver ewer", "Carved bone statuette"],
      250: ["Gold ring with bloodstones", "Carved ivory statuette"],
      750: ["Silver chalice with moonstones", "Lost sheet music"],
      2500: ["Gold chain with fire opal", "Old masterpiece painting"],
      7500: ["Jewelled gold crown", "Jewelled platinum ring"]
    },
    magicItemsByTheme: {
      "Arcana": {
        "Common": ["Potion of Climbing", "Spell Scroll (Cantrip)"],
        "Uncommon": ["Bag of Holding", "Pearl of Power"],
        "Rare": ["Cube of Force", "Wand of Fireballs"],
        "VeryRare": ["Crystal Ball", "Robe of Stars"],
        "Legendary": ["Staff of the Magi", "Ring of Three Wishes"]
      },
      "Armaments": {
        "Common": ["Moon-Touched Sword", "Walloping Ammunition"],
        "Uncommon": ["Adamantine Armour", "+1 Ammunition"],
        "Rare": ["+1 Armour", "Flame Tongue"],
        "VeryRare": ["+2 Armour", "Dancing Sword"],
        "Legendary": ["+3 Armour", "Defender"]
      },
      "Implements": {
        "Common": ["Pot of Awakening", "Rope of Mending"],
        "Uncommon": ["Boots of Elvenkind", "Cloak of Elvenkind"],
        "Rare": ["Boots of Speed", "Cloak of Displacement"],
        "VeryRare": ["Boots of Levitation", "Cloak of Invisibility"],
        "Legendary": ["Ring of Invisibility", "Cloak of the Bat"]
      },
      "Relics": {
        "Common": ["Candle of the Deep", "Charlatan's Die"],
        "Uncommon": ["Driftglobe", "Eversmoking Bottle"],
        "Rare": ["Cube of Force", "Figurine of Wondrous Power"],
        "VeryRare": ["Carpet of Flying", "Mirror of Life Trapping"],
        "Legendary": ["Apparatus of Kwalish", "Sphere of Annihilation"]
      },
      "Any": {
        "Common": ["Potion of Healing", "Potion of Climbing"],
        "Uncommon": ["Bag of Holding", "Boots of Elvenkind"],
        "Rare": ["Ring of Spell Storing", "Boots of Speed"],
        "VeryRare": ["Ring of Regeneration", "Belt of Storm Giant Strength"],
        "Legendary": ["Ring of Three Wishes", "Vorpal Sword"]
      }
    }
  }
};

export default function LootGeneratorPage() {
  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-moss-50">
          Loot Generator
        </h1>
        <p className="text-xl text-moss-200 mb-8">
          Create treasure hoards with atmosphere, intrigue, and story hooks.
        </p>
        <div className="card p-6">
          <p className="text-moss-300">
            Coming soon! This generator will help you create detailed loot for your adventures.
          </p>
        </div>
      </div>
    </main>
  );
}