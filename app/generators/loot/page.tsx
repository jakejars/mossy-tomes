'use client';

import { useState, useEffect } from 'react';
import type {
  LootGenData,
  GeneratedStoryLoot,
  LockedStoryLoot,
  GeneratedHoard,
  LootGeneratorMode,
  CrTier,
  HoardTheme,
  MagicItemRarity,
  Gemstone,
  ArtObject
} from '../../../types/generators'; // Import types from the central file

// --- Helper Functions ---
function rollDice(diceExpression: string): number {
  const match = diceExpression.match(/(\d+)d(\d+)\s*([\+\-]\s*\d+)?(?:\s*\*\s*(\d+))?(?:\s*\/\s*(\d+))?/i);
  if (!match) return 0;

  const numDice = parseInt(match[1]);
  const numSides = parseInt(match[2]);
  const modifierStr = match[3] ? match[3].replace(/\s/g, '') : '+0';
  const modifier = parseInt(modifierStr);
  const multiplier = match[4] ? parseInt(match[4]) : 1;
  const divisor = match[5] ? parseInt(match[5]) : 1;

  let total = 0;
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * numSides) + 1;
  }

  return Math.max(0, Math.floor(((total + modifier) * multiplier) / divisor));
}

const getRandom = <T extends any>(arr: T[]): T | undefined => {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};
// --- END Helper Functions ---


// --- DEFAULT DATA (from placeholder, now used) ---
const defaultLootGenData: LootGenData = {
  storyLoot: {
    container: [
      "A rotting leather pouch", "A locked iron coffer", "A small, intricately carved wooden box",
      "A heavy canvas sack, stained with something dark", "A hollowed-out book", "A fine silk purse",
      "A tarnished silver locket", "A barnacle-encrusted chest", "A simple clay urn"
    ],
    mundaneContents: [
      "A handful of mixed coins (2d12 cp, 1d6 sp)", "A set of loaded dice", "A half-empty wineskin",
      "A bundle of 3 torches", "A coil of hempen rope (25 ft)", "A whetstone and a rusty dagger",
      "A small, cracked mirror", "A set of thieves' tools", "A pouch of pungent herbs", "A tinderbox"
    ],
    keyItem: [
      "A sealed letter addressed to a local baron", "A partial map, scorched at the edges", "A single, ornate silver key",
      "A coded message", "A guild signet ring", "A bloodstained holy symbol", "A diary with the last few pages torn out",
      "A vial of viscous, glowing liquid", "A dragon's scale (red)", "A child's doll"
    ],
    detail: [
      "It is faintly warm to the touch", "It has a noble's family crest embossed on it", "It smells faintly of ozone or brimstone",
      "It is damp and smells of the sea", "A faint, illusory script is visible in moonlight", "It's much heavier than it looks"
    ]
  },
  treasureHoard: {
    hoardByCr: {
      '0-4': { monetary: "6d6*100", magicItems: "1d6" }, // DMG Hoard 0-4
      '5-10': { monetary: "3d6*1000", magicItems: "1d6" }, // DMG Hoard 5-10 (Simplified GP)
      '11-16': { monetary: "5d6*10000", magicItems: "1d6" }, // DMG Hoard 11-16 (Simplified GP)
      '17+': { monetary: "8d6*100000", magicItems: "1d8" }, // DMG Hoard 17+ (Simplified GP)
    },
    // Based on DMG Hoard Tables
    magicItemRarityByCr: {
      '0-4': [ { roll: 70, rarity: "Common" }, { roll: 94, rarity: "Uncommon" }, { roll: 99, rarity: "Rare" }, { roll: 100, rarity: "Very Rare" } ], // DMG Magic Items 0-4
      '5-10': [ { roll: 60, rarity: "Common" }, { roll: 90, rarity: "Uncommon" }, { roll: 98, rarity: "Rare" }, { roll: 100, rarity: "Very Rare" } ], // DMG Magic Items 5-10
      '11-16': [ { roll: 40, rarity: "Uncommon" }, { roll: 80, rarity: "Rare" }, { roll: 98, rarity: "Very Rare" }, { roll: 100, rarity: "Legendary" } ], // DMG Magic Items 11-16
      '17+': [ { roll: 25, rarity: "Rare" }, { roll: 75, rarity: "Very Rare" }, { roll: 100, rarity: "Legendary" } ] // DMG Magic Items 17+
    },
    gemstonesByValue: {
      10: ["Azurite", "Banded agate", "Blue quartz", "Eye agate", "Hematite", "Lapis lazuli", "Malachite", "Moss agate", "Obsidian", "Rhodochrosite", "Tiger eye", "Turquoise"],
      50: ["Bloodstone", "Carnelian", "Chalcedony", "Chrysoprase", "Citrine", "Jasper", "Moonstone", "Onyx", "Quartz", "Sardonyx", "Star rose quartz", "Zircon"],
      100: ["Amber", "Amethyst", "Chrysoberyl", "Coral", "Garnet", "Jade", "Jet", "Pearl", "Spinel", "Tourmaline"],
      500: ["Alexandrite", "Aquamarine", "Black pearl", "Blue spinel", "Peridot", "Topaz"],
      1000: ["Black opal", "Blue sapphire", "Emerald", "Fire opal", "Opal", "Star ruby", "Star sapphire", "Yellow sapphire"],
      5000: ["Black sapphire", "Diamond", "Jacinth", "Ruby"]
    },
    artObjectsByValue: {
      25: ["Silver ewer", "Carved bone statuette", "Small gold bracelet", "Cloth-of-gold vestments", "Black velvet mask with silver filigree", "Copper chalice with silver filigree"],
      250: ["Gold ring with bloodstones", "Carved ivory statuette", "Large gold bracelet", "Silver necklace with a gemstone", "Bronze crown", "Silk robe with gold embroidery"],
      750: ["Silver chalice with moonstones", "Silver-plated steel longsword", "Carved jade idol", "Large gold ring with a topaz", "Gold cup set with emeralds"],
      2500: ["Gold chain with a fire opal", "Old masterpiece painting", "Embroidered silk tapestry", "Platinum ring with a sapphire", "Jeweled dagger"],
      7500: ["Jewelled gold crown", "Jewelled platinum ring", "Small gold statuette of a god", "Gold mirror with gemstone studs", "Platinum scepter with a ruby"]
    },
    magicItemsByTheme: {
      "Arcana": {
        "Common": ["Potion of Climbing", "Spell Scroll (Cantrip)", "Spell Scroll (1st level)", "Potion of Healing", "Wand of Scrutiny"],
        "Uncommon": ["Bag of Holding", "Pearl of Power", "Wand of Magic Detection", "Wand of Secrets", "Immovable Rod", "Ring of Mind Shielding", "Hat of Disguise"],
        "Rare": ["Ring of Spell Storing", "Wand of Fireballs", "Wand of Lightning Bolts", "Cube of Force", "Robe of Useful Items", "Portable Hole"],
        "VeryRare": ["Crystal Ball", "Robe of Stars", "Staff of Fire", "Staff of Frost", "Staff of Power", "Wand of Polymorph"],
        "Legendary": ["Staff of the Magi", "Ring of Three Wishes", "Robe of the Archmagi", "Deck of Many Things", "Tome of the Stilled Tongue"]
      },
      "Armaments": {
        "Common": ["Moon-Touched Sword", "Walloping Ammunition", "Ammunition, +1 (1d10)"],
        "Uncommon": ["Adamantine Armor", "+1 Ammunition (1d20)", "Weapon, +1", "Mithral Armor", "Shield, +1", "Sentinel Shield", "Gauntlets of Ogre Power"],
        "Rare": ["+1 Armor", "Flame Tongue", "Sun Blade", "Weapon, +2", "Armor of Vulnerability", "Arrow-Catching Shield", "Belt of Giant Strength (Hill)"],
        "VeryRare": ["+2 Armor", "Dancing Sword", "Weapon, +3", "Armor, +1", "Dwarven Plate", "Frost Brand", "Shield, +3", "Belt of Giant Strength (Frost/Stone)"],
        "Legendary": ["+3 Armor", "Defender", "Vorpal Sword", "Holy Avenger", "Armor of Invulnerability", "Shield, +2", "Belt of Giant Strength (Fire/Cloud)"]
      },
      "Implements": {
        "Common": ["Pot of Awakening", "Rope of Mending", "Charlatan's Die", "Cloak of Many Fashions", "Dark Shard Amulet"],
        "Uncommon": ["Boots of Elvenkind", "Cloak of Elvenkind", "Gloves of Thievery", "Pipes of Haunting", "Ring of Jumping", "Slippers of Spider Climbing", "Goggles of Night"],
        "Rare": ["Boots of Speed", "Cloak of Displacement", "Ring of Evasion", "Ring of Free Action", "Boots of Levitation", "Bracers of Defense", "Winged Boots"],
        "VeryRare": ["Cloak of Invisibility", "Ring of Regeneration", "Ring of Telekinesis", "Wings of Flying", "Cloak of Arachnida", "Ioun Stone (Agility)"],
        "Legendary": ["Ring of Invisibility", "Cloak of the Bat (requires attunement by a vampire)", "Ioun Stone (Mastery)", "Ring of Spell Turning"]
      },
      "Relics": {
        "Common": ["Candle of the Deep", "Amulet of the Devout (Common)", "Horn of Silent Alarm", "Perfume of Bewitching", "Talking Doll"],
        "Uncommon": ["Driftglobe", "Eversmoking Bottle", "Amulet of Proof against Detection and Location", "Decanter of Endless Water", "Sending Stones", "Amulet of the Devout (Uncommon)"],
        "Rare": ["Cube of Force", "Figurine of Wondrous Power", "Horseshoes of Speed", "Amulet of Health", "Amulet of the Devout (Rare)", "Bead of Force"],
        "VeryRare": ["Carpet of Flying", "Mirror of Life Trapping", "Amulet of the Devout (Very Rare)", "Horn of Valhalla (Bronze)", "Ioun Stone (Fortitude)"],
        "Legendary": ["Apparatus of Kwalish", "Sphere of Annihilation", "Talisman of Pure Good", "Talisman of Ultimate Evil", "Horn of Valhalla (Iron)"]
      },
      "Any": {
        "Common": ["Potion of Healing", "Potion of Climbing", "Spell Scroll (1st level)"],
        "Uncommon": ["Bag of Holding", "Boots of Elvenkind", "Potion of Greater Healing", "Gauntlets of Ogre Power"],
        "Rare": ["Ring of Spell Storing", "Boots of Speed", "Potion of Superior Healing", "Wand of Fireballs"],
        "VeryRare": ["Ring of Regeneration", "Potion of Supreme Healing", "Staff of Power", "Belt of Giant Strength (Frost/Stone)"],
        "Legendary": ["Ring of Three Wishes", "Vorpal Sword", "Staff of the Magi", "Belt of Giant Strength (Fire/Cloud)"]
      }
    }
  }
};

export default function LootGeneratorPage() {
  const [lootData, setLootData] = useState<LootGenData>(defaultLootGenData);
  const [generatorMode, setGeneratorMode] = useState<LootGeneratorMode>('Story');

  // Story Loot State
  const [generatedStoryLoot, setGeneratedStoryLoot] = useState<GeneratedStoryLoot | null>(null);
  const [lockedStoryLoot, setLockedStoryLoot] = useState<LockedStoryLoot>({});

  // Hoard Loot State
  const [selectedCrTier, setSelectedCrTier] = useState<CrTier>('0-4');
  const [selectedTheme, setSelectedTheme] = useState<HoardTheme>('Any');
  const [generatedHoard, setGeneratedHoard] = useState<GeneratedHoard | null>(null);

  // Editor State
  const [jsonInput, setJsonInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [showEditor, setShowEditor] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('worldBuilderLootData_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.storyLoot && parsed.treasureHoard) {
          setLootData(parsed);
          setJsonInput(JSON.stringify(parsed, null, 2));
        } else {
           console.warn('Saved Loot data structure mismatch, resetting.');
           resetToDefaultData(); // <-- Now correctly calls the function
        }
      } catch (e) {
        console.error('Failed to load or parse saved Loot data:', e);
        resetToDefaultData(); // <-- Now correctly calls the function
      }
    } else {
      setJsonInput(JSON.stringify(defaultLootGenData, null, 2));
    }
  }, []);
  
  // --- *** THIS IS THE MISSING FUNCTION *** ---
  const resetToDefaultData = () => {
    if (confirm('Reset all data to defaults? Your customisations will be lost.')) {
      setLootData(defaultLootGenData);
      setJsonInput(JSON.stringify(defaultLootGenData, null, 2));
      localStorage.removeItem('worldBuilderLootData_v1');
      setLockedStoryLoot({});
      setGeneratedStoryLoot(null);
      setGeneratedHoard(null);
      setSaveStatus('↻ Reset to defaults');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };
  // --- *** END OF FIX *** ---

  // --- STORY LOOT FUNCTIONS ---
  const generateStoryLootComponent = (component: keyof GeneratedStoryLoot): string | undefined => {
    return getRandom(lootData.storyLoot[component]);
  };

  const generateStoryLoot = () => {
    const loot: Partial<GeneratedStoryLoot> = {};
    const fields: (keyof GeneratedStoryLoot)[] = ['container', 'mundaneContents', 'keyItem', 'detail'];

    fields.forEach(key => {
        loot[key] = (lockedStoryLoot[key] && generatedStoryLoot?.[key])
            ? generatedStoryLoot[key]
            : (generateStoryLootComponent(key) || '');
    });

    setGeneratedStoryLoot(loot as GeneratedStoryLoot);
  };

  const rerollStoryLootComponent = (component: keyof GeneratedStoryLoot) => {
    if (!generatedStoryLoot) return;
    setGeneratedStoryLoot({
      ...generatedStoryLoot,
      [component]: generateStoryLootComponent(component) || ''
    });
  };

  const toggleStoryLootLock = (component: keyof GeneratedStoryLoot) => {
    setLockedStoryLoot(prev => ({ ...prev, [component]: !prev[component] }));
  };

  // --- TREASURE HOARD FUNCTIONS ---
  const generateTreasureHoard = () => {
    const hoardData = lootData.treasureHoard;
    const crData = hoardData.hoardByCr[selectedCrTier];
    
    // 1. Calculate Monetary Value
    let totalGP = rollDice(crData.monetary);
    const monetaryForm: (Gemstone | ArtObject | { name: string; value: number })[] = [];

    // Distribute GP into art/gems (simplified logic)
    // In a real TTRPG, you'd roll on tables. Here, we'll assign portions.
    const artGemValues = [7500, 2500, 750, 250, 50, 25];
    const gemValues = [5000, 1000, 500, 100, 50, 10];
    
    let remainingGP = totalGP;
    
    // Allocate ~40% to art/gems, 60% to coins
    let artGemGP = totalGP * (Math.random() * 0.2 + 0.3); // 30-50%
    remainingGP = totalGP - artGemGP;
    
    // Allocate Art
    for (const val of artGemValues) {
       if (artGemGP > val) {
           const num = Math.min(Math.floor(artGemGP / val), rollDice('2d4'));
           for(let i=0; i<num; i++) {
               const art = getRandom(hoardData.artObjectsByValue[val]);
               if(art) monetaryForm.push({ name: art, value: val });
           }
           artGemGP -= num * val;
       }
    }
    // Allocate Gems
     for (const val of gemValues) {
       if (artGemGP > val) {
           const num = Math.min(Math.floor(artGemGP / val), rollDice('3d6'));
           for(let i=0; i<num; i++) {
               const gem = getRandom(hoardData.gemstonesByValue[val]);
               if(gem) monetaryForm.push({ name: gem, value: val });
           }
           artGemGP -= num * val;
       }
    }
    
    monetaryForm.push({ name: "Assorted Coins (CP, SP, GP, PP)", value: Math.max(0, remainingGP + artGemGP) }); // Add remaining GP as coins
    
    
    // 2. Roll for Magic Items
    const numMagicItems = rollDice(crData.magicItems);
    const magicItems: { name: string; rarity: MagicItemRarity; theme: HoardTheme }[] = [];
    const rarityTable = hoardData.magicItemRarityByCr[selectedCrTier];
    
    for (let i = 0; i < numMagicItems; i++) {
        const roll = rollDice('1d100');
        let rarity: MagicItemRarity = "Common"; // Default
        
        for (const entry of rarityTable) {
            if (roll <= entry.roll) {
                rarity = entry.rarity;
                break;
            }
        }
        
        const themeToUse = selectedTheme === 'Any' ? getRandom(Object.keys(hoardData.magicItemsByTheme) as HoardTheme[])! : selectedTheme;
        let itemPool = hoardData.magicItemsByTheme[themeToUse]?.[rarity] || hoardData.magicItemsByTheme["Any"][rarity];
        
        if (!itemPool || itemPool.length === 0) {
            itemPool = hoardData.magicItemsByTheme["Any"][rarity] || ["Potion of Healing"]; // Ultimate fallback
        }

        const itemName = getRandom(itemPool) || "Mystery Item";
        magicItems.push({ name: itemName, rarity, theme: themeToUse });
    }

    setGeneratedHoard({
      crTier: selectedCrTier,
      theme: selectedTheme,
      totalGPValue: totalGP,
      monetaryForm,
      magicItems
    });
  };

  // --- DATA MANAGEMENT ---
  const saveData = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.storyLoot && parsed.treasureHoard) {
        setLootData(parsed);
        localStorage.setItem('worldBuilderLootData_v1', jsonInput);
        setSaveStatus('✓ Data saved successfully!');
      } else {
         throw new Error("Invalid data structure: Missing storyLoot or treasureHoard");
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      console.error("Save Error:", e);
      const errorMessage = e instanceof Error ? e.message : 'Invalid JSON format';
      setSaveStatus(`✗ Error: ${errorMessage}`);
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  const copyToClipboard = () => {
    let text = '';
    
    if (generatorMode === 'Story' && generatedStoryLoot) {
      text = 'Story Loot\n\n';
      text += `Container: ${generatedStoryLoot.container}\n`;
      text += `Contents: ${generatedStoryLoot.mundaneContents}\n`;
      text += `Key Item: ${generatedStoryLoot.keyItem}\n`;
      text += `Detail: ${generatedStoryLoot.detail}\n`;
    } else if (generatorMode === 'Hoard' && generatedHoard) {
      text = `Treasure Hoard (CR ${generatedHoard.crTier}, ${generatedHoard.theme} Theme)\n`;
      text += `Total Value: ~${generatedHoard.totalGPValue.toLocaleString()} gp\n\n`;
      
      text += '--- Monetary Loot ---\n';
      generatedHoard.monetaryForm.forEach(item => {
        text += `• ${item.name} (${item.value.toLocaleString()} gp)\n`;
      });
      
      if (generatedHoard.magicItems.length > 0) {
        text += '\n--- Magic Items ---\n';
        generatedHoard.magicItems.forEach(item => {
          text += `• ${item.name} (${item.rarity})\n`;
        });
      } else {
        text += '\n--- Magic Items ---\n• None\n';
      }
    }
    
    navigator.clipboard.writeText(text.trim());
    setSaveStatus('✓ Copied to clipboard!');
    setTimeout(() => setSaveStatus(''), 2000);
  };
  
  // --- ComponentWithControls Helper ---
  const StoryLootComponent = ({ 
    label, 
    content, 
    componentKey
  }: { 
    label: string; 
    content: string | null;
    componentKey: keyof GeneratedStoryLoot;
  }) => {
      if (!content) return null;

      return (
        <div className="relative group mb-4 pr-20">
          <p className="text-lg text-moss-200">
            <strong className="text-moss-100">{label}:</strong> {content}
          </p>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => toggleStoryLootLock(componentKey)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs ${
                lockedStoryLoot[componentKey]
                  ? 'bg-moss-600 text-white border-moss-700 hover:bg-moss-500'
                  : 'bg-moss-800/30 text-moss-400 border-moss-700/30 hover:bg-moss-700 hover:text-white'
              } border`}
              title={lockedStoryLoot[componentKey] ? 'Unlock' : 'Lock'}
            >
              {lockedStoryLoot[componentKey] ? '🔒' : '🔓'}
            </button>
            <button
              onClick={() => rerollStoryLootComponent(componentKey)}
              className="w-7 h-7 rounded-full bg-moss-800/30 text-moss-400 border border-moss-700/30 flex items-center justify-center hover:bg-moss-700 hover:text-white transition-all text-xs"
              title="Reroll"
            >
              ↻
            </button>
          </div>
        </div>
      );
  };

  return (
    <main className="min-h-screen py-20 px-6 text-moss-100"> {/* Removed background classes */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-moss-50">
            Loot Generator
          </h1>
          <p className="text-lg text-moss-200">
            Create narrative story loot or full treasure hoards
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Generator */}
          <div className="space-y-6">
            {/* Options Card */}
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-4 text-moss-100 border-b border-moss-700 pb-2">
                Generator Mode
              </h2>

              {/* Mode Selector */}
              <div className="mb-6">
                <div className="flex w-full bg-moss-800/50 rounded-lg p-1">
                  <button
                    onClick={() => setGeneratorMode('Story')}
                    className={`flex-1 p-2 rounded-md font-medium transition-colors text-sm ${
                      generatorMode === 'Story' ? 'bg-moss-600 text-white' : 'text-moss-300 hover:bg-moss-700/50'
                    }`}
                  >
                    Story Loot
                  </button>
                  <button
                    onClick={() => setGeneratorMode('Hoard')}
                    className={`flex-1 p-2 rounded-md font-medium transition-colors text-sm ${
                      generatorMode === 'Hoard' ? 'bg-moss-600 text-white' : 'text-moss-300 hover:bg-moss-700/50'
                    }`}
                  >
                    Treasure Hoard
                  </button>
                </div>
              </div>

              {/* Story Loot Options */}
              {generatorMode === 'Story' && (
                <>
                  <p className="text-sm text-moss-300 mb-6 italic">
                    Generates a small container with a key item and a detail, perfect for quick plot hooks.
                  </p>
                  <button
                    onClick={() => generateStoryLoot()}
                    className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105"
                  >
                    {generatedStoryLoot ? 'Generate / Reroll Unlocked' : 'Generate Story Loot'}
                  </button>
                </>
              )}

              {/* Treasure Hoard Options */}
              {generatorMode === 'Hoard' && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="crTierSelect">
                        Challenge Rating (CR)
                      </label>
                      <select
                        id="crTierSelect"
                        value={selectedCrTier}
                        onChange={(e) => setSelectedCrTier(e.target.value as CrTier)}
                        className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                      >
                        {Object.keys(lootData.treasureHoard.hoardByCr).map(tier => (
                          <option key={tier} value={tier}>{tier}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="themeSelect">
                        Magic Item Theme
                      </label>
                      <select
                        id="themeSelect"
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value as HoardTheme)}
                        className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                      >
                        {Object.keys(lootData.treasureHoard.magicItemsByTheme).map(theme => (
                          <option key={theme} value={theme}>{theme}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={generateTreasureHoard}
                    className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105"
                  >
                    Generate Hoard
                  </button>
                </>
              )}
            </div>

            {/* Story Loot Display */}
            {generatorMode === 'Story' && generatedStoryLoot && (
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <h3 className="font-serif text-3xl font-bold text-moss-50 mb-6">
                  Story Loot
                </h3>
                <div className="space-y-0">
                  <StoryLootComponent label="Container" content={generatedStoryLoot.container} componentKey="container" />
                  <StoryLootComponent label="Contents" content={generatedStoryLoot.mundaneContents} componentKey="mundaneContents" />
                  <hr className="border-moss-600 my-4"/>
                  <StoryLootComponent label="Key Item" content={generatedStoryLoot.keyItem} componentKey="keyItem" />
                  <StoryLootComponent label="Detail" content={generatedStoryLoot.detail} componentKey="detail" />
                </div>
                <button onClick={copyToClipboard} className="btn-secondary w-full mt-6">
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {/* Treasure Hoard Display */}
            {generatorMode === 'Hoard' && generatedHoard && (
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <h3 className="font-serif text-3xl font-bold text-moss-50 mb-2">
                  Treasure Hoard
                </h3>
                <p className="text-lg italic text-moss-300 mb-4">
                  (CR {generatedHoard.crTier}, {generatedHoard.theme} Theme)
                </p>
                <p className="text-xl text-moss-100 mb-6">
                  Total Value: <strong className="text-moss-50">~{generatedHoard.totalGPValue.toLocaleString()} gp</strong>
                </p>

                <h4 className="font-serif text-xl font-semibold text-moss-100 mb-3">Monetary Loot</h4>
                <ul className="list-disc list-inside space-y-1 text-moss-200 mb-6">
                  {generatedHoard.monetaryForm.map((item, idx) => (
                    <li key={idx}>{item.name} ({item.value.toLocaleString()} gp)</li>
                  ))}
                </ul>

                <h4 className="font-serif text-xl font-semibold text-moss-100 mb-3">Magic Items</h4>
                {generatedHoard.magicItems.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-moss-200">
                    {generatedHoard.magicItems.map((item, idx) => (
                      <li key={idx}>{item.name} <span className="text-sm italic text-moss-300">({item.rarity})</span></li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-moss-300 italic">No magic items found in this hoard.</p>
                )}
                
                <button onClick={copyToClipboard} className="btn-secondary w-full mt-6">
                  📋 Copy to Clipboard
                </button>
              </div>
            )}
            
            {/* Placeholders */}
            {(!generatedStoryLoot && generatorMode === 'Story') && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Click "Generate" to create a narrative loot item</p>
              </div>
            )}
            {(!generatedHoard && generatorMode === 'Hoard') && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Select CR and Theme, then click "Generate" to create a treasure hoard</p>
              </div>
            )}
          </div>

          {/* Right Column: Data Editor & Tips */}
          <div className="space-y-6">
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-xl font-semibold text-moss-100 border-b border-moss-700 pb-2">
                  Customise Data
                </h2>
                <button
                  onClick={() => setShowEditor(!showEditor)}
                  className="text-moss-400 hover:text-moss-300 text-sm transition-colors"
                >
                  {showEditor ? 'Hide Editor' : 'Show Editor'}
                </button>
              </div>

              {showEditor ? (
                <>
                  <p className="text-sm text-moss-400 mb-4 italic">
                    Edit the JSON below to customise all loot tables.
                    `storyLoot` controls the narrative generator. `treasureHoard` controls the CR-based generator.
                  </p>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-96 p-3 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 font-mono text-sm focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                    spellCheck={false}
                  />
                  <div className="flex gap-3 mt-4">
                    <button onClick={saveData} className="btn-primary flex-1">
                      Save Data
                    </button>
                    {/* --- THIS IS THE FIX --- */}
                    <button onClick={resetToDefaultData} className="btn-secondary flex-1">
                      Reset to Default
                    </button>
                    {/* --- END OF FIX --- */}
                  </div>
                  {saveStatus && (
                    <p className={`text-center mt-3 font-medium text-sm ${
                      saveStatus.includes('✓') || saveStatus.includes('↻')
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {saveStatus}
                    </p>
                  )}
                </>
              ) : (
                 <div className="space-y-3 text-moss-300">
                  <p>Click "Show Editor" to customise source lists:</p>
                   <ul className="space-y-1 text-sm list-disc list-inside ml-4">
                    <li><strong className="text-moss-100">Story Loot:</strong> Containers, mundane items, key items, and details.</li>
                     <li><strong className="text-moss-100">Treasure Hoard:</strong>
                         <ul className="list-['-_'] list-inside ml-4">
                            <li>Monetary value & item counts by CR</li>
                            <li>Magic item rarity tables by CR</li>
                            <li>Gemstone & Art Object lists by value</li>
                            <li>Magic Item lists by Rarity & Theme</li>
                        </ul>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-3 text-moss-100 border-b border-moss-700 pb-2">
                Tips for Great Loot
              </h2>
               <ul className="space-y-1.5 text-sm text-moss-300 list-disc list-inside ml-4">
                  <li>Use <strong className="text-moss-100">Story Loot</strong> for finding a plot hook on a single body or in a small room.</li>
                  <li>Use <strong className="text-moss-100">Treasure Hoard</strong> for the main reward at the end of a dungeon or for a major foe.</li>
                  <li>In "Story Loot" mode, use the <strong className="text-moss-100">Lock (🔒)</strong> button to keep a Key Item and reroll its container.</li>
                  <li>The <strong className="text-moss-100">Theme</strong> selector helps tailor magic items. "Armaments" for a warrior's tomb, "Arcana" for a wizard's tower.</li>
                  <li>The GP value is a guideline. The true value is in the gems, art, and items.</li>
                  <li>Customise the `magicItemsByTheme` tables in the editor to add your favourite homebrew items.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}