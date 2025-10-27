'use client';

import { useState, useEffect } from 'react';
import type {
  QuestGeneratorMode,
  HookType,
  LevelTier,
  GeneratedQuestSeed,
  LockedQuestSeed,
  GeneratedAdventureSituation,
  QuestGenData
} from '../../../types/generators'; // Import types from central file

// --- Type guard to check if all fields are present ---
function isCompleteQuestSeed(obj: Partial<GeneratedQuestSeed>): obj is GeneratedQuestSeed {
  return (
    obj.hook !== undefined &&
    obj.objective !== undefined &&
    obj.target !== undefined &&
    obj.location !== undefined &&
    obj.complication !== undefined &&
    obj.climax !== undefined
  );
}

// --- DEFAULT DATA (Expanded with Sourcebook tables) ---
const defaultQuestGenData: QuestGenData = {
  hookTypes: ['Patron Hook', 'Supernatural Hook', 'Happenstance Hook'],
  hooks: {
    'Patron Hook': [
      "A desperate noble needs you to find a lost heir.",
      "A shadowy guild master offers coin for a 'retrieval' mission.",
      "A frantic commoner's child has been taken by monsters.",
      "A mysterious old hermit warns of a coming disaster and needs your help.",
      "A zealous priest tasks you with recovering a stolen relic.",
      "A grieving widow wants you to bring her husband's killer to justice.",
      "A calculating merchant needs you to secure a dangerous trade route.",
      "A retired adventurer offers their old map to a place they never conquered.",
      "A worried village elder begs you to investigate a blight on their crops.",
      "A city official announces a bounty for a notorious bandit leader.",
      "A monarch hires you to escort their emissary through hostile territory.",
      "A friendly contact asks you to repay a favour by doing them 'one simple job'."
    ],
    'Supernatural Hook': [
      "You all share a vivid, prophetic dream of a burning tower.",
      "While praying, one character receives a quest from their god or patron.",
      "A fortune teller's reading points to a specific, dangerous ruin.",
      "A ghostly apparition appears, begging you to find its body and put it to rest.",
      "Flames in a campfire form a rune or word, pointing you to a location.",
      "A talking animal (or fey spirit) appears and pleads for help for its sacred grove.",
      "A comet appears in the sky, and soothsayers declare it an omen of a specific event."
    ],
    'Happenstance Hook': [
      "You find a cryptic map and a key on a dead body.",
      "While seeking shelter, you stumble into the entrance of a forgotten dungeon.",
      "A magical mishap (e.g., a teleport-gone-wrong) strands you in a dangerous new location.",
      "You are attacked after being mistaken for a rival adventuring party.",
      "You overhear a sinister plot in a tavern's back room.",
      "A building collapses, revealing a hidden tunnel network beneath the city.",
      "You witness a kidnapping or assassination in broad daylight."
    ]
  },
  objectives: [
    "Make Peace (convince two opposing groups to end a conflict)",
    "Protect (defend an NPC, object, or location)",
    "Retrieve (gain possession of a specific object)",
    "Run a Gauntlet (pass through a dangerous area to reach an exit)",
    "Sneak In (move through an area without being detected)",
    "Stop a Ritual (foil a magical ceremony before it completes)",
    "Take Out a Single Target (defeat a villain surrounded by minions)",
    "Investigate (solve a mystery, find a hidden clue)",
    "Deliver (transport a message or item safely)",
    "Explore (map a forgotten ruin or uncharted territory)",
    "Discover (find the source of a plague, curse, or strange phenomenon)"
  ],
  targets: [
    "a stolen artefact", "a notorious bandit leader", "a lost family heirloom",
    "a secret message or ledger", "a rare herb or alchemical ingredient", "a missing person or captured ally",
    "a sacred relic", "a forgotten tome of lore", "a dangerous monster (or its lair)",
    "a rival's valuable item", "a key to a locked dungeon", "the source of a curse",
    "a specific prisoner", "a villain's lieutenant", "a magical McGuffin"
  ],
  locations: [
    "in a haunted forest", "within the city catacombs or sewers", "at the top of a frozen mountain",
    "in the middle of a bustling market", "deep inside an abandoned mine", "in a forgotten tomb or crypt",
    "at a noble's masquerade ball", "in a rival guild's headquarters", "beyond a cursed swamp",
    "in a crumbling wizard's tower", "at the heart of a raging battlefield", "within a dangerous planar portal",
    "in the lair of a known villain", "at a roadside inn", "in the middle of nowhere"
  ],
  complications: [
    "the target is heavily guarded by soldiers or monsters",
    "the whole thing is a trap set by a hidden enemy",
    "the patron is lying about a key detail of the quest",
    "you are racing against a rival party for the same goal",
    "the weather suddenly turns dangerous (blizzard, hurricane, magical storm)",
    "an old enemy of the party is also involved",
    "the location is collapsing, flooding, or otherwise unstable",
    "an innocent person or group is in the way and must be protected",
    "the target is not what it seems (e.g., the 'artefact' is a person)",
    "a powerful, neutral third party (e.g., a dragon) claims the location"
  ],
  climaxes: [
    "Confront a villain and minions in a battle to the finish.",
    "Chase a villain while dodging obstacles, leading to a final confrontation.",
    "A cataclysmic event is triggered that the party must escape.",
    "Arrive just as a villain is about to complete their master plan.",
    "Must disrupt multiple simultaneous rites in a large chamber.",
    "A trusted ally betrays the party at the worst possible moment.",
    "A portal opens, spilling new monsters out as you fight.",
    "The location begins to collapse, and the villain tries to escape in the chaos.",
    "Must choose between pursuing a fleeing villain or saving an innocent.",
    "The main threat is defeated, only to transform into a more powerful form."
  ],
  levelTiers: ['1-4', '5-10', '11-16', '17-20'],
  situationsByLevel: {
    '1-4': [
      "A dragon wyrmling has gathered kobolds to amass a hoard.",
      "Wererats in the sewers plot to take control of the city council.",
      "Bandit activity signals the revival of an evil cult.",
      "A pack of gnolls is rampaging dangerously close to farmlands.",
      "A rivalry between two merchant families escalates to mayhem.",
      "A new sinkhole reveals a long-buried dungeon.",
      "Miners broke into an ancient ruin and were captured by monsters.",
      "An innocent is framed for the crimes of a shape-shifter.",
      "Ghouls are venturing out of the catacombs at night.",
      "A notorious criminal hides in an old ruin.",
      "A contagion in a forest causes spiders to grow massive and aggressive.",
      "A necromancer animates the village cemetery to get revenge.",
      "An evil cult is spreading, marking dissenters for sacrifice.",
      "An abandoned house is haunted by Undead due to a cursed item inside.",
      "Fey creatures are crossing over, causing mischief and misfortune.",
      "A hag's curse makes local animals unusually aggressive.",
      "Local bullies have appointed themselves the militia and extort villagers.",
      "An aquatic monster attacks the waterfront after a strange statue is found.",
      "A local ruin is cursed, but a scholar wants to explore it.",
      "A new bandit captain begins raiding more frequently."
    ],
    '5-10': [
      "A dragon is extorting tribute from a settlement and must be stopped.",
      "A powerful vampire is corrupting the court from within.",
      "A guild of warlocks seeks forbidden knowledge from an ancient library.",
      "A portal to the Feywild is causing reality to warp in the forest.",
      "A mad mage's experiments are spawning abominations.",
      "An orc warlord unites the tribes and marches on civilisation.",
      "A death cult attempts to summon a demon lord.",
      "A lich is raising an army of undead from ancient battlefields.",
      "A fire giant is awakening a volcano to destroy the region.",
      "A beholder has claimed a strategic fortress.",
      "Pirates have seized control of vital shipping lanes.",
      "A corrupt noble is secretly a devil in disguise.",
      "Mind flayers are infiltrating the city's leadership.",
      "A powerful artefact is discovered that factions war over.",
      "An ancient curse causes the dead to rise across the land.",
      "A druid circle has turned to dark rituals.",
      "Giants are raiding settlements under mysterious compulsion.",
      "A kraken threatens coastal towns unless appeased.",
      "Lycanthropy spreads rapidly through the population.",
      "A powerful ghost seeks vengeance on the descendants of its killers."
    ],
    '11-16': [
      "An ancient red dragon emerges from centuries of slumber.",
      "A cabal of liches plots to create a realm of eternal undeath.",
      "Elemental princes wage war, threatening the material plane.",
      "A dark god's avatar manifests and demands worship.",
      "A demilich guards a weapon that could end civilisation.",
      "Githyanki raiders use astral portals to strike cities.",
      "An archdevil manipulates kingdoms towards a planar war.",
      "A tarrasque awakens and begins its path of destruction.",
      "A death knight commands an army of demons and undead.",
      "Dragons form a council to reclaim their ancient dominion.",
      "An archmage attempts to ascend to godhood through sacrifice.",
      "The Shadowfell begins merging with the material plane.",
      "Storm giants seek to punish mortals for their hubris.",
      "A primordial evil breaks free from its ancient prison.",
      "Multiple demon lords vie for supremacy in the mortal realm.",
      "A vampire lord amasses power to challenge the gods.",
      "An ancient empire returns from a pocket dimension.",
      "Celestials and fiends battle over the fate of the world.",
      "A dracolich leads an undead army to conquer the land.",
      "Reality itself begins to unravel due to planar instability."
    ],
    '17-20': [
      "Gods themselves walk the earth, demanding devotion or destruction.",
      "An ancient evil threatens to unmake the multiverse.",
      "The Abyss breaches containment, flooding reality with chaos.",
      "Asmodeus himself seeks to corrupt the material plane.",
      "The World Serpent stirs, threatening all of creation.",
      "A coalition of archdevils and demon lords forms an impossible alliance.",
      "The Raven Queen's death causes souls to go mad.",
      "Tiamat breaks free from the Nine Hells.",
      "An apocalypse prophecy begins to unfold across all planes.",
      "The Far Realm begins consuming reality.",
      "Multiple tarrasques awaken simultaneously.",
      "The gods war amongst themselves, using mortals as pawns.",
      "An elder evil from beyond the stars arrives.",
      "The Weave of magic itself begins to collapse.",
      "A titan imprisoned since the dawn of time breaks free.",
      "The dead cease passing on, overwhelming the living.",
      "Dragons reclaim their ancient empire through force.",
      "All fiends unite under a single banner to invade.",
      "The material plane begins merging with all others.",
      "The end times prophesied for millennia finally begin."
    ]
  }
};

export default function QuestGeneratorPage() {
  const [questGenData, setQuestGenData] = useState<QuestGenData>(defaultQuestGenData);
  const [jsonInput, setJsonInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [showEditor, setShowEditor] = useState(false);

  // Generator Mode
  const [generatorMode, setGeneratorMode] = useState<QuestGeneratorMode>('Quest Seed');

  // Quest Seed State
  const [selectedHookType, setSelectedHookType] = useState<HookType>('Patron Hook');
  const [generatedQuestSeed, setGeneratedQuestSeed] = useState<Partial<GeneratedQuestSeed> | null>(null);
  const [lockedQuestSeed, setLockedQuestSeed] = useState<LockedQuestSeed>({});

  // Field toggles
  const [includeHook, setIncludeHook] = useState(true);
  const [includeObjective, setIncludeObjective] = useState(true);
  const [includeTarget, setIncludeTarget] = useState(true);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [includeComplication, setIncludeComplication] = useState(true);
  const [includeClimax, setIncludeClimax] = useState(true);

  // Adventure Situation State
  const [selectedLevelTier, setSelectedLevelTier] = useState<LevelTier>('1-4');
  const [generatedAdventureSituation, setGeneratedAdventureSituation] = useState<GeneratedAdventureSituation | null>(null);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('mossyTomesQuestGenData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQuestGenData(parsed);
        setJsonInput(JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.error('Failed to load saved data:', e);
        setJsonInput(JSON.stringify(defaultQuestGenData, null, 2));
      }
    } else {
      setJsonInput(JSON.stringify(defaultQuestGenData, null, 2));
    }
  }, []);

  const getRandom = <T,>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // === QUEST SEED FUNCTIONS ===
  const generateQuestSeedComponent = (component: keyof GeneratedQuestSeed): string => {
    switch (component) {
      case 'hook':
        return getRandom(questGenData.hooks[selectedHookType]);
      case 'objective':
        return getRandom(questGenData.objectives);
      case 'target':
        return getRandom(questGenData.targets);
      case 'location':
        return getRandom(questGenData.locations);
      case 'complication':
        return getRandom(questGenData.complications);
      case 'climax':
        return getRandom(questGenData.climaxes);
      default:
        return '';
    }
  };

  const generateQuestSeed = () => {
    const quest: Partial<GeneratedQuestSeed> = {};
    
    if (includeHook) {
      quest.hook = lockedQuestSeed.hook && generatedQuestSeed?.hook
        ? generatedQuestSeed.hook
        : generateQuestSeedComponent('hook');
    }
    if (includeObjective) {
      quest.objective = lockedQuestSeed.objective && generatedQuestSeed?.objective
        ? generatedQuestSeed.objective
        : generateQuestSeedComponent('objective');
    }
    if (includeTarget) {
      quest.target = lockedQuestSeed.target && generatedQuestSeed?.target
        ? generatedQuestSeed.target
        : generateQuestSeedComponent('target');
    }
    if (includeLocation) {
      quest.location = lockedQuestSeed.location && generatedQuestSeed?.location
        ? generatedQuestSeed.location
        : generateQuestSeedComponent('location');
    }
    if (includeComplication) {
      quest.complication = lockedQuestSeed.complication && generatedQuestSeed?.complication
        ? generatedQuestSeed.complication
        : generateQuestSeedComponent('complication');
    }
    if (includeClimax) {
      quest.climax = lockedQuestSeed.climax && generatedQuestSeed?.climax
        ? generatedQuestSeed.climax
        : generateQuestSeedComponent('climax');
    }

    setGeneratedQuestSeed(quest);
  };

  const rerollQuestComponent = (component: keyof GeneratedQuestSeed) => {
    if (!generatedQuestSeed) return;
    setGeneratedQuestSeed({
      ...generatedQuestSeed,
      [component]: generateQuestSeedComponent(component)
    });
  };

  const toggleQuestLock = (component: keyof GeneratedQuestSeed) => {
    setLockedQuestSeed(prev => ({ ...prev, [component]: !prev[component] }));
  };

  // === ADVENTURE SITUATION FUNCTIONS ===
  const generateAdventureSituation = () => {
    const situation = getRandom(questGenData.situationsByLevel[selectedLevelTier]);
    setGeneratedAdventureSituation({
      levelTier: selectedLevelTier,
      situation
    });
  };

  // === DATA MANAGEMENT ===
  const saveData = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setQuestGenData(parsed);
      localStorage.setItem('mossyTomesQuestGenData', jsonInput);
      setSaveStatus('✓ Data saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('✗ Error: Invalid JSON format');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const resetData = () => {
    if (confirm('Reset all data to defaults? Your customisations will be lost.')) {
      setQuestGenData(defaultQuestGenData);
      setJsonInput(JSON.stringify(defaultQuestGenData, null, 2));
      localStorage.removeItem('mossyTomesQuestGenData');
      setLockedQuestSeed({});
      setSaveStatus('↻ Reset to defaults');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const copyToClipboard = () => {
    let text = '';
    
    if (generatorMode === 'Quest Seed' && generatedQuestSeed) { // Simplified check for Partial
      if (includeHook && generatedQuestSeed.hook) text += `Hook: ${generatedQuestSeed.hook}\n\n`;
      if (includeObjective && generatedQuestSeed.objective) text += `Objective: ${generatedQuestSeed.objective}\n`;
      if (includeTarget && generatedQuestSeed.target) text += `Target: ${generatedQuestSeed.target}\n`;
      if (includeLocation && generatedQuestSeed.location) text += `Location: ${generatedQuestSeed.location}\n\n`;
      if (includeComplication && generatedQuestSeed.complication) text += `Complication: ${generatedQuestSeed.complication}\n`;
      if (includeClimax && generatedQuestSeed.climax) text += `Climax: ${generatedQuestSeed.climax}\n`;
    } else if (generatorMode === 'Adventure Situation' && generatedAdventureSituation) {
      text = `Adventure Situation (Levels ${generatedAdventureSituation.levelTier})\n\n${generatedAdventureSituation.situation}`;
    }
    
    navigator.clipboard.writeText(text.trim());
    setSaveStatus('✓ Copied to clipboard!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  // Component with lock/reroll buttons
  const ComponentWithControls = ({ 
    label, 
    content, 
    componentKey
  }: { 
    label: string; 
    content: string; 
    componentKey: keyof GeneratedQuestSeed;
  }) => (
    <div className="relative group mb-4 pr-20">
      <p className="text-lg text-moss-200">
        <strong className="text-moss-100">{label}:</strong> {content}
      </p>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"> {/* Changed opacity-20 to opacity-0 */}
        <button
          onClick={() => toggleQuestLock(componentKey)}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs ${ // Smaller buttons
            lockedQuestSeed[componentKey]
              ? 'bg-moss-600 text-white border-moss-700 hover:bg-moss-500' // Added hover effect
              : 'bg-moss-800/30 text-moss-400 border-moss-700/30 hover:bg-moss-700 hover:text-white' // Added hover effect
          } border `} // Removed redundant border
          title={lockedQuestSeed[componentKey] ? 'Unlock' : 'Lock'}
        >
          {lockedQuestSeed[componentKey] ? '🔒' : '🔓'}
        </button>
        <button
          onClick={() => rerollQuestComponent(componentKey)}
          className="w-7 h-7 rounded-full bg-moss-800/30 text-moss-400 border border-moss-700/30 flex items-center justify-center hover:bg-moss-700 hover:text-white transition-all text-xs" // Added hover effect
          title="Reroll"
        >
          ↻
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen py-20 px-6 text-moss-100"> {/* Removed background classes */} {/* Added gradient and text color */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-moss-50">
            Quest & Adventure Generator
          </h1>
          <p className="text-lg text-moss-200">
            Create quest seeds and adventure situations for any level
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Generator */}
          <div className="space-y-6">
            {/* Options Card */}
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl"> {/* Enhanced card styling */}
              <h2 className="font-serif text-xl font-semibold mb-4 text-moss-100 border-b border-moss-700 pb-2"> {/* Added border-bottom */}
                Generator Options
              </h2>

              {/* Mode Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-moss-200 mb-2">
                  Generator Type
                </label>
                 <div className="flex w-full bg-moss-800/50 rounded-lg p-1"> {/* Pill style */}
                  <button
                    onClick={() => setGeneratorMode('Quest Seed')}
                    className={`flex-1 p-2 rounded-md font-medium transition-colors text-sm ${ // Adjusted styles
                      generatorMode === 'Quest Seed'
                        ? 'bg-moss-600 text-white'
                        : 'text-moss-300 hover:bg-moss-700/50'
                    }`}
                  >
                    Quest Seed
                  </button>
                  <button
                    onClick={() => setGeneratorMode('Adventure Situation')}
                     className={`flex-1 p-2 rounded-md font-medium transition-colors text-sm ${ // Adjusted styles
                      generatorMode === 'Adventure Situation'
                        ? 'bg-moss-600 text-white'
                        : 'text-moss-300 hover:bg-moss-700/50'
                    }`}
                  >
                    Adventure Situation
                  </button>
                </div>
              </div>

              {/* Quest Seed Options */}
              {generatorMode === 'Quest Seed' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="hookTypeSelect"> {/* Added htmlFor */}
                      Hook Type
                    </label>
                    <select
                      id="hookTypeSelect" // Added id
                      value={selectedHookType}
                      onChange={(e) => setSelectedHookType(e.target.value as HookType)}
                      className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400" // Enhanced select style
                    >
                      {questGenData.hookTypes.map(type => ( // Dynamically generate options
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6"> {/* Reduced gap */}
                    <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={includeHook}
                        onChange={(e) => setIncludeHook(e.target.checked)}
                        className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500" // Styled checkbox
                      />
                      <span>Hook</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={includeObjective}
                        onChange={(e) => setIncludeObjective(e.target.checked)}
                        className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"
                      />
                      <span>Objective</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={includeTarget}
                        onChange={(e) => setIncludeTarget(e.target.checked)}
                        className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"
                      />
                      <span>Target</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={includeLocation}
                        onChange={(e) => setIncludeLocation(e.target.checked)}
                        className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"
                      />
                      <span>Location</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={includeComplication}
                        onChange={(e) => setIncludeComplication(e.target.checked)}
                        className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"
                      />
                      <span>Complication</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={includeClimax}
                        onChange={(e) => setIncludeClimax(e.target.checked)}
                        className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"
                      />
                      <span>Climax</span>
                    </label>
                  </div>
                  <button
                    onClick={() => generateQuestSeed()} // Added arrow function
                    className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105" // Added hover effect
                  >
                    {generatedQuestSeed ? 'Generate / Reroll Unlocked' : 'Generate Quest'}
                  </button>
                </>
              )}

              {/* Adventure Situation Options */}
              {generatorMode === 'Adventure Situation' && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="levelTierSelect"> {/* Added htmlFor */}
                      Level Tier
                    </label>
                    <select
                      id="levelTierSelect" // Added id
                      value={selectedLevelTier}
                      onChange={(e) => setSelectedLevelTier(e.target.value as LevelTier)}
                       className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400" // Enhanced select style
                    >
                      {/* More descriptive options */}
                      <option value="1-4">Levels 1-4 (Local Heroes)</option>
                      <option value="5-10">Levels 5-10 (Heroes of the Realm)</option>
                      <option value="11-16">Levels 11-16 (Masters of the Realm)</option>
                      <option value="17-20">Levels 17-20 (Masters of the World)</option>
                    </select>
                  </div>
                  <button
                    onClick={generateAdventureSituation}
                     className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105" // Added hover effect
                  >
                    Generate Situation
                  </button>
                </>
              )}
            </div>

            {/* Quest Seed Display */}
            {generatorMode === 'Quest Seed' && generatedQuestSeed && ( // Check if generatedQuestSeed exists
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <h3 className="font-serif text-3xl font-bold text-moss-50 mb-6">
                  Quest Seed
                </h3>
                
                <div className="space-y-0"> {/* Reduced space */}
                  {includeHook && generatedQuestSeed.hook && (
                    <ComponentWithControls
                      label="Hook"
                      content={generatedQuestSeed.hook}
                      componentKey="hook"
                    />
                  )}
                  {includeObjective && generatedQuestSeed.objective && (
                    <ComponentWithControls
                      label="Objective"
                      content={generatedQuestSeed.objective}
                      componentKey="objective"
                    />
                  )}
                  {includeTarget && generatedQuestSeed.target && (
                    <ComponentWithControls
                      label="Target"
                      content={generatedQuestSeed.target}
                      componentKey="target"
                    />
                  )}
                  {includeLocation && generatedQuestSeed.location && (
                    <ComponentWithControls
                      label="Location"
                      content={generatedQuestSeed.location}
                      componentKey="location"
                    />
                  )}
                  {(includeComplication && generatedQuestSeed.complication || includeClimax && generatedQuestSeed.climax) && ( // Conditional hr
                    <hr className="border-moss-600 my-4" /> // Adjusted hr style
                  )}
                  {includeComplication && generatedQuestSeed.complication && (
                    <ComponentWithControls
                      label="Complication"
                      content={generatedQuestSeed.complication}
                      componentKey="complication"
                    />
                  )}
                  {includeClimax && generatedQuestSeed.climax && (
                    <ComponentWithControls
                      label="Climax / Twist"
                      content={generatedQuestSeed.climax}
                      componentKey="climax"
                    />
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
            
            {/* Adventure Situation Display */}
            {generatorMode === 'Adventure Situation' && generatedAdventureSituation && (
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <h3 className="font-serif text-3xl font-bold text-moss-50 mb-4">
                  Adventure Situation
                </h3>
                <p className="text-lg italic text-moss-300 mb-6">
                  (Levels {generatedAdventureSituation.levelTier})
                </p>
                <div className="space-y-4">
                  <p className="text-lg text-moss-200">{generatedAdventureSituation.situation}</p>
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
            {(!generatedQuestSeed && generatorMode === 'Quest Seed') && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Select options and click "Generate" to create a quest seed</p>
              </div>
            )}
            {(!generatedAdventureSituation && generatorMode === 'Adventure Situation') && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Select a Level Tier and click "Generate" to create an adventure situation</p>
              </div>
            )}
          </div>

          {/* Right Column: Data Editor & Tips */}
          <div className="space-y-6">
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-xl font-semibold text-moss-100 border-b border-moss-700 pb-2"> {/* Added border-bottom */}
                  Customise Data
                </h2>
                <button
                  onClick={() => setShowEditor(!showEditor)}
                  className="text-moss-400 hover:text-moss-300 text-sm transition-colors" // Added transition
                >
                  {showEditor ? 'Hide Editor' : 'Show Editor'}
                </button>
              </div>

              {showEditor ? (
                <>
                  <p className="text-sm text-moss-400 mb-4 italic">
                    Edit the JSON below to customise all quest generation tables.
                    Ensure the structure matches the required format. Your changes are saved locally to your browser.
                  </p>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-96 p-3 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 font-mono text-sm focus:ring-1 focus:ring-moss-400 focus:border-moss-400" // Enhanced textarea style
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
                    <p className={`text-center mt-3 font-medium text-sm ${ // Reduced text size
                      saveStatus.includes('✓') || saveStatus.includes('↻')
                        ? 'text-green-400' // Changed to green
                        : 'text-red-400'
                    }`}>
                      {saveStatus}
                    </p>
                  )}
                </>
              ) : (
                <div className="space-y-3 text-moss-300"> {/* Reduced spacing */}
                  <p>Click "Show Editor" to customise source lists:</p>
                  <ul className="space-y-1 text-sm list-disc list-inside ml-4"> {/* Reduced spacing, added list style */}
                    <li>• <strong className="text-moss-100">Quest Seed Mode:</strong> Hook types & hooks, objectives, targets, locations, complications, climaxes/twists</li>
                    <li>• <strong className="text-moss-100">Adventure Situation Mode:</strong> Level tiers, situations by level (1-4, 5-10, etc.)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-3 text-moss-100 border-b border-moss-700 pb-2"> {/* Added border-bottom */}
                Tips for Great Adventures
              </h2>
              <ul className="space-y-1.5 text-sm text-moss-300 list-disc list-inside ml-4"> {/* Reduced spacing, added list style */}
                <li>Use <strong className="text-moss-100">Quest Seed</strong> mode for creating specific, structured quests with clear goals</li>
                <li>Use <strong className="text-moss-100">Adventure Situation</strong> for broader, level-appropriate inspiration for a new adventure arc</li>
                <li>In Quest Seed mode, use <strong className="text-moss-100">Lock (🔒)</strong> to keep a good hook or complication while rerolling other parts</li>
                <li>A <strong className="text-moss-100">Climax</strong> is often more useful than a simple twist as it suggests a final scene</li>
                <li>Combine a generated <strong className="text-moss-100">Calamity</strong> from the Settlement generator with a quest to fix it</li>
                <li>Customise the lists in the editor to add hooks specific to your campaign's villains or factions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}