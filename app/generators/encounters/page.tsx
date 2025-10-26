'use client';

import { useState, useEffect } from 'react';

// --- Helper Functions ---
function rollDice(diceExpression: string): number {
  // Regex to match dice strings (e.g., 2d10, 1d6+4, 2d8*10)
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

  // Ensure result is never negative (e.g., for 1d4-1)
  return Math.max(0, Math.floor(((total + modifier) * multiplier) / divisor));
}

const getRandom = <T extends any>(arr: T[]): T | undefined => {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

// --- TYPE DEFINITIONS ---

type GeneratorMode = 'Encounter Seed' | 'Random Encounter' | 'Chase Complication';
type TerrainType = "Arctic" | "Coastal" | "Desert" | "Forest" | "Grassland" | "Hill" | "Mountain" | "Swamp" | "Underdark" | "Urban" | "Waterborne";
type ChaseType = "Urban" | "Wilderness";

// --- 1. ENCOUNTER SEED INTERFACES ---
interface GeneratedSeed {
  location: string;
  creature: string;
  situation: string;
  complication: string;
  reason: string;
}

type LockedSeedComponents = {
  [key in keyof GeneratedSeed]?: boolean;
};

// --- 2. RANDOM ENCOUNTER INTERFACES ---
interface GeneratedRandomEncounter {
  terrain: TerrainType;
  encounterRoll: number;
  result: string;
  distance?: string;
}

// --- 3. CHASE COMPLICATION INTERFACES ---
interface GeneratedChaseComplication {
  type: ChaseType;
  roll: number;
  result: string;
}

// --- MAIN DATA INTERFACE ---
interface EncounterGenData {
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
    // Updated structure for complications
    complications: { [key in ChaseType]: { minRoll: number; maxRoll: number; text: string }[] };
  };
}

// --- DEFAULT DATA (Expanded with full 1d12 chase tables) ---
const defaultEncounterGenData: EncounterGenData = {
  seedData: {
    location: [
      "A crumbling ruin", "A misty forest path", "A narrow sewer tunnel", "A bustling market square",
      "A forgotten graveyard", "A rickety rope bridge over a chasm", "A wizards' tower, strangely silent",
      "A dark, flooded cavern", "A holy temple, desecrated", "A noble's opulent ballroom", "A squalid dockside warehouse",
      "An ancient, magical library", "A battlefield, moments after the fight", "A planar crossroads"
    ],
    creature: [
      "A band of goblin scavengers", "A territorial owlbear", "A mysterious, cloaked figure", "A squad of city guards",
      "A ghostly apparition", "A cunning kobold trapmaker", "A lost child", "A starving wolf pack",
      "A patrol of hobgoblin soldiers", "A snooty noble and their bodyguards", "A panicked crowd",
      "A curious fey creature", "A forgotten construct", "A desperate cultist"
    ],
    situation: [
      "...are ambushing a merchant waggon", "...is protecting its young", "...is performing a strange ritual",
      "...are searching for someone", "...is guarding a treasure chest", "...is blocking the path",
      "...is fleeing from something worse", "...is laying a trap", "...is arguing over loot",
      "...is trying to start a fire", "...is wounded and cornered", "...is asleep on watch"
    ],
    complication: [
      "A magical anti-magic field is active", "A third party (rivals?) arrives mid-fight",
      "The structure is collapsing or on fire", "One of them is a traitor",
      "A valuable item is about to be destroyed", "Innocent bystanders are in the way",
      "It's a case of mistaken identity", "The creatures have hostages", "A magical storm erupts", "The 'monster' is under a curse"
    ],
    reason: [
      "...they are desperate for food.", "...they were hired by a rival merchant.",
      "...they believe the waggon carries a stolen idol.", "...a poacher just stole one of its young.",
      "...it's nesting season and they feel threatened.", "...to summon a powerful entity.",
      "...to close a dangerous planar rift.", "...to fulfil an ancient prophecy.",
      "...they are under a magical compulsion.", "...it's a simple territorial dispute.",
      "...they are trying to retrieve a stolen item.", "...it's a distraction for a larger plan."
    ]
  },
  randomEncounterData: {
    terrains: ["Arctic", "Coastal", "Desert", "Forest", "Grassland", "Hill", "Mountain", "Swamp", "Underdark", "Urban", "Waterborne"],
    encounterDistanceByTerrain: {
      "Arctic": "6d6 * 10", "Coastal": "2d10 * 10", "Desert": "6d6 * 10", "Forest": "2d8 * 10",
      "Grassland": "6d6 * 10", "Hill": "2d10 * 10", "Mountain": "4d10 * 10", "Swamp": "2d8 * 10",
      "Underdark": "2d6 * 10", "Urban": "2d6 * 10", "Waterborne": "6d6 * 10"
    },
    encountersByTerrain: {
      "Forest": ["1d8 Bandits", "1 Owlbear", "1d4 Giant Spiders", "A lost merchant", "A crumbling shrine", "1d6 Wolves", "1 Treant", "A patrol of 1d4 Elven Scouts"],
      "Mountain": ["1d4 Griffons", "1 Ettin", "1d6 Goats", "A small avalanche (DEX save)", "A tribe of 2d6 Orcs", "1 Manticore", "A hermit's cave", "1d4 Eagles"],
      "Swamp": ["1d6 Giant Frogs", "1 Troll", "2d4 Bullywugs", "A patch of quicksand", "A ghostly apparition", "1 Shambling Mound", "A hag's hut", "1d8 Giant Lizards"],
      "Urban": ["1d4 City Guards", "A noble with 2 bodyguards", "1d6 Thugs in an alley", "A lost child", "A street performer", "A raging fire", "1d10 Commoners (crowd)", "1 Spy watching"],
      "Arctic": ["1d4 Ice Mephits", "1 Polar Bear", "A tribe of 1d8 Kobolds", "A blizzard (CON save)", "1 Yeti", "A frozen corpse with a note", "A friendly trapper", "1d6 Wolves"],
      "Coastal": ["1d8 Giant Crabs", "1d4 Harpies", "A shipwreck (contains 1d100 gp)", "A patrol of 2d4 Merfolk", "1d6 Pirates", "A hidden cave", "1 Plesiosaurus", "A rolling fog bank"],
      "Desert": ["1d6 Giant Hyenas", "1 Lamia", "A friendly caravan", "A sandstorm (CON save)", "1d4 Giant Vultures", "An oasis", "2d6 Bandits", "1 Air Elemental (dust devil)"],
      "Grassland": ["1d10 Goblins on Worgs", "1d4 Elephants", "A herd of 2d20 Wildebeest", "A lone traveller", "1 Bulette", "A patch of tall grass (stealth checks)", "1d8 Giant Eagles", "A nomadic encampment"],
      "Hill": ["1d6 Orcs", "1 Manticore", "A shepherd with 2d10 sheep", "1d4 Giant Goats", "A mysterious standing stone", "1d8 Hobgoblins", "1 Griffon", "A territorial Hippogriff"],
      "Underdark": ["1d4 Giant Spiders", "1 Minotaur", "A lost Drow patrol (1d4)", "A patch of Violet Fungi", "2d6 Kobolds", "A subterranean river", "1 Grick", "A mad hermit"],
      "Waterborne": ["A merchant ship", "1d4 Reef Sharks", "A storm (DEX/CON saves)", "1d8 Merfolk", "A pirate vessel", "A ghost ship", "A pod of 2d6 Dolphins", "1 Water Elemental"]
    }
  },
  chaseData: {
    types: ["Urban", "Wilderness"],
    // UPDATED chase complications with full 1-12 range
    complications: {
      "Urban": [
        { minRoll: 1, maxRoll: 1, text: "A cart or large obstacle blocks your way. (DC 10 DEX save or 10ft Difficult Terrain)" },
        { minRoll: 2, maxRoll: 2, text: "A crowd blocks your way. (DC 10 STR/DEX/CHA save or 10ft Difficult Terrain)" },
        { minRoll: 3, maxRoll: 3, text: "A maze of barrels or crates. (DC 10 DEX/INT save or 10ft Difficult Terrain)" },
        { minRoll: 4, maxRoll: 4, text: "The ground is slippery with water, ice, or oil. (DC 10 DEX save or fall Prone)" },
        { minRoll: 5, maxRoll: 5, text: "You encounter a brawl or fight. (DC 15 STR/DEX/CHA save or 2d4 dmg & 10ft Difficult Terrain)" },
        { minRoll: 6, maxRoll: 6, text: "You must make a sharp turn around a corner. (DC 10 DEX save or collide with wall for 1d4 dmg)" },
        { minRoll: 7, maxRoll: 7, text: "A narrow alley or gap. (DC 10 DEX save or squeeze through at half speed)" },
        { minRoll: 8, maxRoll: 8, text: "Clotheslines or hanging debris. (DC 12 DEX save or become Restrained until escape DC 10)" },
        { minRoll: 9, maxRoll: 9, text: "A pack of stray dogs or cats. (DC 12 DEX/CHA save or trip and fall Prone)" },
        { minRoll: 10, maxRoll: 10, text: "A merchant's stall collapses. (DC 12 DEX save or 1d6 damage and knocked Prone)" },
        { minRoll: 11, maxRoll: 11, text: "City watch patrol ahead. (DC 15 CHA/DEX save or they join the chase)" },
        { minRoll: 12, maxRoll: 12, text: "No complication." }
      ],
      "Wilderness": [
        { minRoll: 1, maxRoll: 1, text: "You pass through a Swarm of Insects (Wasps, Spiders, or DM's choice)." },
        { minRoll: 2, maxRoll: 2, text: "A stream, creek, or ravine blocks your path. (DC 10 STR/DEX save or 10ft Difficult Terrain)" },
        { minRoll: 3, maxRoll: 3, text: "Blowing sand, snow, ash, or pollen. (DC 10 CON save or Blinded for 1 round, Speed halved)" },
        { minRoll: 4, maxRoll: 4, text: "A sudden drop or hidden pit. (DC 10 DEX save or fall 10 feet, taking 1d6 damage)" },
        { minRoll: 5, maxRoll: 5, text: "You pass near Razorvine or thorny brambles. (DC 15 DEX save or use 10ft movement to avoid 1d10 slashing damage)" },
        { minRoll: 6, maxRoll: 6, text: "A native creature (bear, deer, boar) notices you. (DC 10 WIS/CHA save or it joins the chase as quarry or pursuer)" },
        { minRoll: 7, maxRoll: 7, text: "Thick undergrowth or tangled roots. (DC 12 STR save or become Restrained until escape DC 10)" },
        { minRoll: 8, maxRoll: 8, text: "Rocky outcropping or fallen tree. (DC 10 STR/DEX save or 10ft Difficult Terrain)" },
        { minRoll: 9, maxRoll: 9, text: "Muddy or marshy ground. (DC 10 STR save or Speed reduced by half for 1 round)" },
        { minRoll: 10, maxRoll: 10, text: "Low-hanging branches or vines. (DC 12 DEX save or 1d4 damage and knocked Prone)" },
        { minRoll: 11, maxRoll: 11, text: "Hidden animal burrow or loose stones. (DC 12 DEX save or twisted ankle, Speed reduced by 10ft for 1 minute)" },
        { minRoll: 12, maxRoll: 12, text: "No complication." }
      ]
    }
  }
};

export default function EncounterGeneratorPage() {
  const [encounterData, setEncounterData] = useState<EncounterGenData>(defaultEncounterGenData);
  const [generatorMode, setGeneratorMode] = useState<GeneratorMode>('Encounter Seed');

  // Seed State
  const [generatedSeed, setGeneratedSeed] = useState<GeneratedSeed | null>(null);
  const [lockedSeedComponents, setLockedSeedComponents] = useState<LockedSeedComponents>({});
  const [includeLocation, setIncludeLocation] = useState(true);
  const [includeCreature, setIncludeCreature] = useState(true);
  const [includeSituation, setIncludeSituation] = useState(true);
  const [includeComplication, setIncludeComplication] = useState(true);
  const [includeReason, setIncludeReason] = useState(true);

  // Random Encounter State
  const [selectedTerrain, setSelectedTerrain] = useState<TerrainType>('Forest');
  const [encounterChance, setEncounterChance] = useState(16); // Default 16+
  const [forceEncounter, setForceEncounter] = useState(false);
  const [generatedRandomEncounter, setGeneratedRandomEncounter] = useState<GeneratedRandomEncounter | null>(null);

  // Chase Complication State
  const [selectedChaseType, setSelectedChaseType] = useState<ChaseType>('Urban');
  const [generatedChaseComplication, setGeneratedChaseComplication] = useState<GeneratedChaseComplication | null>(null);

  // Editor State
  const [jsonInput, setJsonInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [showEditor, setShowEditor] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('worldBuilderEncounterData_v2'); // New key
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check for new chase data structure
        if (parsed.seedData && parsed.randomEncounterData && parsed.chaseData && parsed.chaseData.complications.Urban[0].minRoll !== undefined) {
          setEncounterData(parsed);
          setJsonInput(JSON.stringify(parsed, null, 2));
        } else {
           console.warn('Saved Encounter data structure mismatch (v2), resetting.');
           resetToDefaultData();
        }
      } catch (e) {
        console.error('Failed to load or parse saved Encounter data (v2):', e);
        resetToDefaultData();
      }
    } else {
      setJsonInput(JSON.stringify(defaultEncounterGenData, null, 2));
    }
  }, []);
  
  const resetToDefaultData = () => {
    setEncounterData(defaultEncounterGenData);
    setJsonInput(JSON.stringify(defaultEncounterGenData, null, 2));
    localStorage.removeItem('worldBuilderEncounterData_v2'); // Use new key
  };

  // === ENCOUNTER SEED FUNCTIONS ===
  const generateSeedComponent = (component: keyof GeneratedSeed): string | undefined => {
    return getRandom(encounterData.seedData[component]);
  };

  const generateSeed = () => {
    const seed: Partial<GeneratedSeed> = {};
    
    // Use an array to manage which fields to generate based on toggles
    const fieldsToGenerate: (keyof GeneratedSeed)[] = [];
    if (includeLocation) fieldsToGenerate.push('location');
    if (includeCreature) fieldsToGenerate.push('creature');
    if (includeSituation) fieldsToGenerate.push('situation');
    if (includeComplication) fieldsToGenerate.push('complication');
    if (includeReason) fieldsToGenerate.push('reason');

    fieldsToGenerate.forEach(key => {
        seed[key] = (lockedSeedComponents[key] && generatedSeed?.[key])
            ? generatedSeed[key]
            : (generateSeedComponent(key) || ''); // Generate new or use fallback
    });

    setGeneratedSeed(seed as GeneratedSeed);
  };

  const rerollSeedComponent = (component: keyof GeneratedSeed) => {
    if (!generatedSeed) return;
    setGeneratedSeed({
      ...generatedSeed,
      [component]: generateSeedComponent(component) || ''
    });
  };

  const toggleSeedLock = (component: keyof GeneratedSeed) => {
    setLockedSeedComponents(prev => ({ ...prev, [component]: !prev[component] }));
  };

  // === RANDOM ENCOUNTER FUNCTIONS ===
  const generateRandomEncounter = () => {
    const roll = rollDice('1d20');
    let result = '';
    let distance: string | undefined;

    if (forceEncounter || roll >= encounterChance) {
      result = getRandom(encounterData.randomEncounterData.encountersByTerrain[selectedTerrain]) || 'No encounter';
      const distanceExpr = encounterData.randomEncounterData.encounterDistanceByTerrain[selectedTerrain].replace(/×/g, '*');
      distance = `${rollDice(distanceExpr)} feet`;
    } else {
      result = 'No encounter';
    }

    setGeneratedRandomEncounter({
      terrain: selectedTerrain,
      encounterRoll: roll,
      result,
      distance
    });
  };

  // === CHASE COMPLICATION FUNCTIONS ===
  const generateChaseComplication = () => {
    const roll = rollDice('1d12');
    const complications = encounterData.chaseData.complications[selectedChaseType];
    // Find the complication where the roll falls within minRoll and maxRoll
    const complication = complications.find(c => roll >= c.minRoll && roll <= c.maxRoll);

    setGeneratedChaseComplication({
      type: selectedChaseType,
      roll,
      result: complication ? complication.text : "No complication. (Error: Check data)" // Fallback
    });
  };

  // === DATA MANAGEMENT ===
  const saveData = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      // Added check for new chase data structure
      if (parsed.seedData && parsed.randomEncounterData && parsed.chaseData && parsed.chaseData.complications.Urban[0].minRoll !== undefined) {
        setEncounterData(parsed);
        localStorage.setItem('worldBuilderEncounterData_v2', jsonInput); // Use new key
        setSaveStatus('✓ Data saved successfully!');
      } else {
         throw new Error("Invalid data structure. Missing key components or wrong chase format.");
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      console.error("Save Error:", e);
      const errorMessage = e instanceof Error ? e.message : 'Invalid JSON format';
      setSaveStatus(`✗ Error: ${errorMessage}`);
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  const resetData = () => {
    if (confirm('Reset all data to defaults? Your customisations will be lost.')) {
      resetToDefaultData();
      setLockedSeedComponents({});
      setSaveStatus('↻ Reset to defaults');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const copyToClipboard = () => {
    let text = '';
    
    if (generatorMode === 'Encounter Seed' && generatedSeed) {
      text = 'Encounter Seed\n\n';
      if (includeLocation && generatedSeed.location) text += `Location: ${generatedSeed.location}\n`;
      
      // Combine creature and situation
      let situationText = '';
      if (includeCreature && generatedSeed.creature) {
        situationText += generatedSeed.creature;
      }
      if (includeSituation && generatedSeed.situation) {
         let sit = generatedSeed.situation;
         if (sit.startsWith('...')) sit = sit.substring(3).trim(); // Clean up '...'
         situationText += situationText ? ` ${sit}` : sit; // Add space if creature exists
      }
      if (situationText) {
          situationText = situationText.charAt(0).toUpperCase() + situationText.slice(1); // Capitalise
          text += `\nSituation: ${situationText}\n`;
      }

      if (includeReason && generatedSeed.reason) text += `Reason: ${generatedSeed.reason}\n`;
      if (includeComplication && generatedSeed.complication) text += `\nComplication: ${generatedSeed.complication}\n`;

    } else if (generatorMode === 'Random Encounter' && generatedRandomEncounter) {
      text = `Random Encounter (${generatedRandomEncounter.terrain})\n`;
      text += `Roll: ${generatedRandomEncounter.encounterRoll} (DC ${encounterChance})\n\n`;
      text += `Result: ${generatedRandomEncounter.result}\n`;
      if (generatedRandomEncounter.distance && generatedRandomEncounter.result !== 'No encounter') {
        text += `Distance: ${generatedRandomEncounter.distance}\n`;
      }
    } else if (generatorMode === 'Chase Complication' && generatedChaseComplication) {
      text = `Chase Complication (${generatedChaseComplication.type})\n`;
      text += `Roll (1d12): ${generatedChaseComplication.roll}\n\n`;
      text += `Result: ${generatedChaseComplication.result}`;
    }
    
    navigator.clipboard.writeText(text.trim());
    setSaveStatus('✓ Copied to clipboard!');
    setTimeout(() => setSaveStatus(''), 2000);
  };
  
  // Helper to format situation text for display
  const formatSituation = (creature?: string, situation?: string) => {
    let coreSentence = '';
    if (includeCreature && creature) coreSentence += creature;
    if (includeSituation && situation) {
        let sit = situation;
        if (sit.startsWith('...')) sit = sit.substring(3).trim();
        coreSentence += coreSentence ? ` ${sit}` : sit; // Add space only if creature exists
    }
    if (!coreSentence) return null; // Don't render if both are off
    coreSentence = coreSentence.charAt(0).toUpperCase() + coreSentence.slice(1);
    if (!coreSentence.endsWith('.')) coreSentence += '.';
    return coreSentence;
  };

  // Component with lock/reroll buttons
  const SeedComponentWithControls = ({ 
    label, 
    content, 
    componentKey
  }: { 
    label: string; 
    content: string | null; // Allow null
    componentKey: keyof GeneratedSeed;
  }) => {
      // Dynamically determine if this component should be included based on toggles
      let shouldInclude = false;
      if (componentKey === 'location' && includeLocation) shouldInclude = true;
      if ((componentKey === 'creature' || componentKey === 'situation') && (includeCreature || includeSituation)) shouldInclude = true; // Special case for combined field
      if (componentKey === 'reason' && includeReason) shouldInclude = true;
      if (componentKey === 'complication' && includeComplication) shouldInclude = true;
      
      if (!shouldInclude || !content) return null; // Don't render if toggled off or no content

      // Use 'creature' key for locking/rerolling the combined situation field
      const lockKey = (componentKey === 'situation') ? 'creature' : componentKey;

      return (
        <div className={`relative group mb-4 pr-20 ${componentKey === 'complication' ? 'mt-4 pt-4 border-t border-moss-700/30' : ''}`}>
          <p className="text-lg text-moss-200">
            <strong className="text-moss-100">{label}:</strong> {content}
          </p>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => toggleSeedLock(lockKey)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs ${
                lockedSeedComponents[lockKey as keyof GeneratedSeed]
                  ? 'bg-moss-600 text-white border-moss-700 hover:bg-moss-500'
                  : 'bg-moss-800/30 text-moss-400 border-moss-700/30 hover:bg-moss-700 hover:text-white'
              } border`}
              title={lockedSeedComponents[lockKey as keyof GeneratedSeed] ? 'Unlock' : 'Lock'}
            >
              {lockedSeedComponents[lockKey as keyof GeneratedSeed] ? '🔒' : '🔓'}
            </button>
            <button
              onClick={() => rerollSeedComponent(lockKey)}
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
    <main className="min-h-screen py-20 px-6 bg-gradient-to-b from-moss-950 to-gray-900 text-moss-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-moss-50">
            Encounter Generator
          </h1>
          <p className="text-lg text-moss-200">
            Design narrative seeds, random encounters, and chase complications
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
                    onClick={() => setGeneratorMode('Encounter Seed')}
                    className={`flex-1 p-2 rounded-md font-medium transition-colors text-sm ${
                      generatorMode === 'Encounter Seed' ? 'bg-moss-600 text-white' : 'text-moss-300 hover:bg-moss-700/50'
                    }`}
                  >
                    Encounter Seed
                  </button>
                  <button
                    onClick={() => setGeneratorMode('Random Encounter')}
                    className={`flex-1 p-2 rounded-md font-medium transition-colors text-sm ${
                      generatorMode === 'Random Encounter' ? 'bg-moss-600 text-white' : 'text-moss-300 hover:bg-moss-700/50'
                    }`}
                  >
                    Random Encounter
                  </button>
                  <button
                    onClick={() => setGeneratorMode('Chase Complication')}
                    className={`flex-1 p-2 rounded-md font-medium transition-colors text-sm ${
                      generatorMode === 'Chase Complication' ? 'bg-moss-600 text-white' : 'text-moss-300 hover:bg-moss-700/50'
                    }`}
                  >
                    Chase Complication
                  </button>
                </div>
              </div>

              {/* Encounter Seed Options */}
              {generatorMode === 'Encounter Seed' && (
                <>
                  <h3 className="text-base font-medium text-moss-200 mb-2">Encounter Seed Options:</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                      <input type="checkbox" checked={includeLocation} onChange={(e) => setIncludeLocation(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                      <span>Location</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                      <input type="checkbox" checked={includeCreature} onChange={(e) => setIncludeCreature(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                      <span>Creature</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                      <input type="checkbox" checked={includeSituation} onChange={(e) => setIncludeSituation(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                      <span>Situation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                      <input type="checkbox" checked={includeReason} onChange={(e) => setIncludeReason(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                      <span>Reason</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors col-span-2">
                      <input type="checkbox" checked={includeComplication} onChange={(e) => setIncludeComplication(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                      <span>Complication</span>
                    </label>
                  </div>
                  <button
                    onClick={() => generateSeed()}
                    className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105"
                  >
                    {generatedSeed ? 'Generate / Reroll Unlocked' : 'Generate Seed'}
                  </button>
                </>
              )}

              {/* Random Encounter Options */}
              {generatorMode === 'Random Encounter' && (
                <>
                  <h3 className="text-base font-medium text-moss-200 mb-2">Random Encounter Options:</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="terrainSelect">
                      Terrain Type
                    </label>
                    <select
                      id="terrainSelect"
                      value={selectedTerrain}
                      onChange={(e) => setSelectedTerrain(e.target.value as TerrainType)}
                      className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                    >
                      {encounterData.randomEncounterData.terrains.map(terrain => (
                        <option key={terrain} value={terrain}>{terrain}</option>
                      ))}
                    </select>
                  </div>
                   <div className="flex sm:flex-row flex-col sm:items-center gap-4 mb-6">
                       <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                        <input type="checkbox" checked={forceEncounter} onChange={(e) => setForceEncounter(e.target.checked)} className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"/>
                        <span>Force Encounter</span>
                      </label>
                      <div className="flex items-center gap-2">
                           <label htmlFor="encounterChance" className="text-sm text-moss-200">Chance (on 1d20):</label>
                           <input
                              type="number"
                              id="encounterChance"
                              value={encounterChance}
                              min={1} max={20}
                              onChange={(e) => setEncounterChance(Math.min(20, Math.max(1, parseInt(e.target.value) || 18)))}
                              className="w-16 p-1 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 text-center"
                              disabled={forceEncounter}
                           />
                           <span className="text-sm text-moss-200"> or higher</span>
                      </div>
                  </div>
                  <button
                    onClick={generateRandomEncounter}
                    className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105"
                  >
                    Roll Encounter
                  </button>
                </>
              )}

              {/* Chase Complication Options */}
              {generatorMode === 'Chase Complication' && (
                <>
                  <h3 className="text-base font-medium text-moss-200 mb-2">Chase Complication Options:</h3>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="chaseTypeSelect">
                      Chase Type
                    </label>
                    <select
                      id="chaseTypeSelect"
                      value={selectedChaseType}
                      onChange={(e) => setSelectedChaseType(e.target.value as ChaseType)}
                      className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                    >
                      {encounterData.chaseData.types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={generateChaseComplication}
                    className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105"
                  >
                    Roll Complication
                  </button>
                </>
              )}
            </div>

            {/* Encounter Seed Display */}
            {generatorMode === 'Encounter Seed' && generatedSeed && (
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <h3 className="font-serif text-3xl font-bold text-moss-50 mb-6">
                  Encounter Seed
                </h3>
                
                <div className="space-y-0">
                  <SeedComponentWithControls
                    label="Location"
                    content={generatedSeed.location}
                    componentKey="location"
                  />
                  <hr className="border-moss-600 my-4"/>
                  <SeedComponentWithControls
                    label="Situation"
                    content={formatSituation(generatedSeed.creature, generatedSeed.situation)}
                    componentKey="creature" // Lock/reroll creature+situation together
                  />
                  <SeedComponentWithControls
                    label="Reason"
                    content={generatedSeed.reason}
                    componentKey="reason"
                  />
                  <SeedComponentWithControls
                    label="Complication"
                    content={generatedSeed.complication}
                    componentKey="complication"
                  />
                </div>

                <button
                  onClick={copyToClipboard}
                  className="btn-secondary w-full mt-6"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {/* Random Encounter Display */}
            {generatorMode === 'Random Encounter' && generatedRandomEncounter && (
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <h3 className="font-serif text-3xl font-bold text-moss-50 mb-4">
                  Random Encounter
                </h3>
                <p className="text-lg italic text-moss-300 mb-6">
                  ({generatedRandomEncounter.terrain})
                </p>
                <div className="space-y-4">
                  <p className="text-lg text-moss-200">
                    <strong className="text-moss-100">Result:</strong> {generatedRandomEncounter.result}
                  </p>
                  {generatedRandomEncounter.distance && generatedRandomEncounter.result !== 'No encounter' && (
                    <p className="text-lg text-moss-200">
                      <strong className="text-moss-100">Distance:</strong> {generatedRandomEncounter.distance}
                    </p>
                  )}
                  {!forceEncounter && (
                    <p className="text-sm text-moss-400">
                      (Roll: {generatedRandomEncounter.encounterRoll} vs DC {encounterChance})
                    </p>
                  )}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary w-full mt-6"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {/* Chase Complication Display */}
            {generatorMode === 'Chase Complication' && generatedChaseComplication && (
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <h3 className="font-serif text-3xl font-bold text-moss-50 mb-4">
                  Chase Complication
                </h3>
                <p className="text-lg italic text-moss-300 mb-6">
                  ({generatedChaseComplication.type})
                </p>
                <div className="space-y-4">
                  <p className="text-lg text-moss-200">
                    <strong className="text-moss-100">Roll (1d12):</strong> {generatedChaseComplication.roll}
                  </p>
                  <p className="text-lg text-moss-200">
                    <strong className="text-moss-100">Result:</strong> {generatedChaseComplication.result}
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary w-full mt-6"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {/* Placeholders */}
            {(!generatedSeed && generatorMode === 'Encounter Seed') && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Select options and click "Generate" to create a narrative encounter seed</p>
              </div>
            )}
            {(!generatedRandomEncounter && generatorMode === 'Random Encounter') && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Select terrain and click "Generate" to roll for a random encounter</p>
              </div>
            )}
            {(!generatedChaseComplication && generatorMode === 'Chase Complication') && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Select chase type and click "Generate" to roll for a complication</p>
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
                    Edit the JSON below to customise all encounter tables.
                    `seedData` controls the narrative seed. `randomEncounterData` controls the terrain-based rolls. `chaseData` controls chase complications.
                  </p>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-96 p-3 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 font-mono text-sm focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                    spellCheck={false}
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={saveData}
                      className="btn-primary flex-1"
                    >
                      Save Data
                    </button>
                    <button
                      onClick={resetData}
                      className="btn-secondary flex-1"
                    >
                      Reset to Default
                    </button>
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
                    <li><strong className="text-moss-100">Encounter Seed:</strong>
                         <ul className="list-['-_'] list-inside ml-4">
                            <li>Locations, Creatures, Situations, Reasons, Complications</li>
                        </ul>
                    </li>
                     <li><strong className="text-moss-100">Random Encounters:</strong>
                         <ul className="list-['-_'] list-inside ml-4">
                            <li>Terrains, Encounter Distances, Encounters by Terrain</li>
                        </ul>
                    </li>
                    <li><strong className="text-moss-100">Chase Complications:</strong>
                         <ul className="list-['-_'] list-inside ml-4">
                            <li>Urban and Wilderness complication tables</li>
                        </ul>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-3 text-moss-100 border-b border-moss-700 pb-2">
                Tips for Encounters
              </h2>
               <ul className="space-y-1.5 text-sm text-moss-300 list-disc list-inside ml-4">
                  <li>Use <strong className="text-moss-100">Encounter Seed</strong> for planning key story moments.</li>
                  <li>Use <strong className="text-moss-100">Random Encounter</strong> to add tension to travel. Set the DC higher (e.g., 19) for safer roads.</li>
                   <li>Use <strong className="text-moss-100">Chase Complication</strong> to make pursuits dynamic. Roll once per participant at the end of their turn.</li>
                  <li>In "Encounter Seed" mode, use the <strong className="text-moss-100">Lock (🔒)</strong> and <strong className="text-moss-100">Reroll (↻)</strong> buttons to fine-tune your idea.</li>
                  <li>A <strong className="text-moss-100">Reason</strong> can turn a simple fight into a negotiation.</li>
                  <li>Customise the `encountersByTerrain` list to add your campaign's specific monsters.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}