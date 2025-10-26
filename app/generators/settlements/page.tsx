'use client';

import { useState, useEffect } from 'react';
import type {
  SettlementGenData,
  GeneratedSettlement,
  SettlementLockedComponents,
  SettlementType,
  SettlementNameParts,   // <-- Added
  SettlementPopulation  // <-- Added
} from '../../../types/generators'; // Import the new types

// --- Default Data ---
const defaultSettlementGenData: SettlementGenData = {
  types: ["Hamlet", "Village", "Town", "City", "Keep", "Stronghold"],
  namePrefix: {
    "Default": ["Stone", "Bridge", "River", "Green", "Oxen", "North", "South", "East", "West", "New", "Old", "High", "Low", "Kings", "Queens", "Saints", "Barrow", "Long", "Black", "White", "Fair", "Shep", "Sea", "Star", "Mill"],
    "Keep": ["Dragon's", "Iron", "Stone", "Guard's", "Black", "Crimson", "Last", "Victor's", "Eagle's", "Grey"],
    "Stronghold": ["Iron", "Adamant", "Winter's", "Sun's", "Fort", "Shield", "Gryphon's", "Hope's", "World's"],
  },
  nameSuffix: {
    "Default": ["ford", "wood", "wick", "wich", "ton", "town", "bury", "bridge", "shire", "stead", "ham", "ley", "field", "vale", "dale", "by", "port", "mouth", "fell", "crest", "watch", "haven", "view", "hollow"],
    "Keep": ["Rest", "Watch", "Keep", "Guard", "Tower", "Fort", "Point", "Gate", "Bastion", "End"],
    "Stronghold": ["Hold", "Fast", "Guard", "Wall", "Rock", "Shield", "Aegis", "Reach", "Spire"],
  },
  population: {
    "Hamlet": ["A few dozen souls (20-50)", "Just a handful of families (10-40)", "Barely a dot on the map (30-60)"],
    "Village": ["Several hundred people (200-800)", "A bustling small community (300-900)", "A respectable size (500-1000)"],
    "Town": ["A few thousand inhabitants (1,500-5,000)", "A major trade stop (2,000-6,000)", "A walled community (3,000-7,000)"],
    "City": ["Tens of thousands (15,000-50,000)", "A sprawling metropolis (25,000+)", "The regional capital (30,000-75,000)"],
    "Keep": ["A small garrison (50-100 soldiers)", "A well-manned outpost (100-200 soldiers)", "A skeleton crew (20-40)"],
    "Stronghold": ["A small legion (500-1,000 soldiers)", "A fortified city (2,000-5,000 soldiers & support)", "A mighty fortress (1,500-3,000)"],
  },
  descriptor: [
    "A quiet, misty settlement, wrapped in fog and secrets",
    "A bustling, noisy, and unpleasantly smelly trade hub",
    "A poor, downtrodden community, wary of strangers",
    "A wealthy, insular enclave with high walls and clean streets",
    "A devout, orderly place, ruled by a strict religious order",
    "A crumbling, ancient settlement, built on forgotten ruins",
    "A cheerful, welcoming place, famous for its festivals",
    "A grim, fortified outpost, scarred by recent conflict",
    "A bizarre, chaotic place, filled with strange folk and odd customs"
  ],
  knownFor: [
    "A massive, ancient windmill that still turns",
    "A mysterious, bottomless crater at the town's centre",
    "Its unique, sweet-smelling lumber",
    "A legendary blacksmith who reportedly forged a king's sword",
    "Its bizarre local custom of painting all doors bright blue",
    "Being the birthplace of a famously incompetent bard",
    "Its unnervingly accurate local oracle (a reclusive old woman)",
    "A powerful and slightly terrifying wizard's tower",
    "A network of hot springs that bubble beneath the streets",
    "An annual 'Rat-Catching' festival that is famously chaotic"
  ],
  calamity: [
    "Is slowly sinking into the surrounding swamp",
    "Is recovering from a recent, devastating plague",
    "Has a terrible rat infestation",
    "Is suffering under a magical curse (e.g., unending winter, silent nights)",
    "Was recently sacked by a marauding horde",
    "The nearby river has dried up, threatening famine",
    "Its children are disappearing one by one",
    "A strange, collective madness is slowly taking root",
    "The ground frequently trembles from an unknown source below"
  ],
  conflict: [
    "A bitter feud between its two founding families",
    "The local thieves' guild is extorting all the merchants",
    "A nearby goblin tribe is becoming bold and aggressive",
    "The mayor/lord is corrupt and syphoning funds",
    "A zealous religious cult is gaining too much influence",
    "The City Watch / Town Guard are bullies and deeply corrupt",
    "A 'monster' (e.g., a misunderstood owlbear) is terrorising local farms",
    "A rival settlement is attempting to steal its trade charter",
    "A powerful individual is trying to buy up all the land"
  ]
};

export default function SettlementGeneratorPage() {
  const [settlementData, setSettlementData] = useState<SettlementGenData>(defaultSettlementGenData);
  const [generatedSettlement, setGeneratedSettlement] = useState<GeneratedSettlement | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedType, setSelectedType] = useState<SettlementType>('Village');
  const [lockedComponents, setLockedComponents] = useState<SettlementLockedComponents>({});

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('worldBuilderSettlementData_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.types) && typeof parsed.namePrefix === 'object') {
          setSettlementData(parsed);
          setJsonInput(JSON.stringify(parsed, null, 2));
          if (!parsed.types.includes(selectedType)) {
             setSelectedType(parsed.types[0] || 'Village');
          }
        } else {
            console.warn('Saved Settlement data structure mismatch, resetting.');
            resetToDefaultData();
        }
      } catch (e) {
        console.error('Failed to load or parse saved Settlement data:', e);
        resetToDefaultData();
      }
    } else {
      setJsonInput(JSON.stringify(defaultSettlementGenData, null, 2));
    }
  }, []); // Empty dependency array

  const resetToDefaultData = () => {
    if (confirm('Reset all data to defaults? Your customisations will be lost.')) {
        setSettlementData(defaultSettlementGenData);
        setJsonInput(JSON.stringify(defaultSettlementGenData, null, 2));
        localStorage.removeItem('worldBuilderSettlementData_v1');
        setLockedComponents({});
        setGeneratedSettlement(null); // Clear generated output on reset
        setSaveStatus('↻ Reset to defaults');
        if(defaultSettlementGenData.types && defaultSettlementGenData.types.length > 0){
            setSelectedType(defaultSettlementGenData.types[0]);
        }
        setTimeout(() => setSaveStatus(''), 3000);
    }
  };


  const getRandom = <T extends string | number | Record<string, any>>(arr: T[]): T | undefined => {
    if (!arr || arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const generateSingleComponent = (componentKey: keyof GeneratedSettlement): GeneratedSettlement[keyof GeneratedSettlement] => {
      // Helper to get type-specific or fallback array
      const getTypeSpecificArray = (
          dataObject: SettlementNameParts | SettlementPopulation | undefined,
          fallbackKey: keyof (SettlementNameParts | SettlementPopulation) = "Default"
      ): string[] => {
          if (!dataObject) return [];
          const specificArray = dataObject[selectedType];
          if (specificArray && Array.isArray(specificArray) && specificArray.length > 0) return specificArray;
          
          const fallback = dataObject[fallbackKey as string];
          if (fallback && Array.isArray(fallback) && fallback.length > 0) return fallback;

           return [];
      };

      switch(componentKey) {
          case 'name':
              const prefixes = getTypeSpecificArray(settlementData.namePrefix, "Default");
              const suffixes = getTypeSpecificArray(settlementData.nameSuffix, "Default");
              const prefix = getRandom(prefixes);
              const suffix = getRandom(suffixes);
              return (prefix && suffix) ? `${prefix}${suffix}` : "Unnamed Place";
          case 'type': return selectedType;
          case 'population':
              const populations = getTypeSpecificArray(settlementData.population, "Village"); // Fallback to Village
              return getRandom(populations) || "An unknown number of people";
          case 'descriptor': return getRandom(settlementData.descriptor) || "An unremarkable place";
          case 'knownFor': return getRandom(settlementData.knownFor) || "Known for nothing in particular";
          case 'calamity': return getRandom(settlementData.calamity) || "No current calamity";
          case 'conflict': return getRandom(settlementData.conflict) || "No obvious conflict";
          default: return "N/A";
      }
  }

  const generateSettlement = (fullReroll: boolean = true) => {
    const settlement: Partial<GeneratedSettlement> = {};

     const fieldsToGenerate: (keyof GeneratedSettlement)[] = [
      'name', 'type', 'population', 'descriptor', 'knownFor', 'calamity', 'conflict'
    ];

    fieldsToGenerate.forEach(key => {
        if (fullReroll || !lockedComponents[key]) {
             settlement[key] = generateSingleComponent(key) as any;
        } else if (generatedSettlement && generatedSettlement[key] !== undefined) {
           settlement[key] = generatedSettlement[key] as any;
        } else {
             settlement[key] = generateSingleComponent(key) as any;
        }
    });
    
    setGeneratedSettlement(settlement as GeneratedSettlement);
  };

   const rerollComponent = (componentKey: keyof GeneratedSettlement) => {
      if (!generatedSettlement) return;
      const newValue = generateSingleComponent(componentKey);
      setGeneratedSettlement(prev => {
          if (!prev) return null;
          const newState = { ...prev };
          (newState[componentKey] as any) = newValue;
          
          // If 'type' is rerolled, 'name' and 'population' might need rerolling if unlocked
          if(componentKey === 'type') {
              if(!newState.name || !lockedComponents['name']) newState.name = generateSingleComponent('name') as string;
              if(!newState.population || !lockedComponents['population']) newState.population = generateSingleComponent('population') as string;
          }
          return newState;
      });
  };

  const toggleLock = (componentKey: keyof GeneratedSettlement) => {
    setLockedComponents(prev => ({
      ...prev,
      [componentKey]: !prev[componentKey]
    }));
  };

 const saveData = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed.types) && typeof parsed.namePrefix === 'object' && typeof parsed.population === 'object') {
        setSettlementData(parsed);
        localStorage.setItem('worldBuilderSettlementData_v1', jsonInput);
        setSaveStatus('✓ Data saved successfully!');
          if (!parsed.types.includes(selectedType)) {
             setSelectedType(parsed.types[0] || 'Village');
          }
      } else {
          throw new Error("Invalid data structure: Missing required keys/arrays/objects.");
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      console.error("Save Error:", e);
      const errorMessage = e instanceof Error ? e.message : 'Invalid JSON format';
      setSaveStatus(`✗ Error: ${errorMessage}`);
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  // resetData is now defined above with the useEffect hook

  const copySettlement = () => {
    if (!generatedSettlement) return;

    let text = '';
    text += `${generatedSettlement.name} (${generatedSettlement.type})\n`;
    text += `Population: ${generatedSettlement.population}\n\n`;
    text += `${generatedSettlement.descriptor}.\n`;
    text += `It is known for: ${generatedSettlement.knownFor}.\n\n`;
    text += `Calamity: ${generatedSettlement.calamity}.\n`;
    text += `Conflict: ${generatedSettlement.conflict}.\n`;

    navigator.clipboard.writeText(text.trim());
    setSaveStatus('✓ Copied to clipboard!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  // --- ComponentWithControls Helper ---
  const ComponentWithControls = ({
    label,
    content,
    componentKey,
    italic = false,
    isTitle = false
  }: {
    label?: string;
    content: string;
    componentKey: keyof GeneratedSettlement;
    italic?: boolean;
    isTitle?: boolean;
  }) => {
    const contentClass = italic ? "italic text-moss-300" : "text-moss-200";

    return (
       <div className={`relative group mb-3 pr-20 text-lg ${contentClass}`}>
        {isTitle ? (
           <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-moss-50 mb-1">{content}</h3>
        ) : (
           <p>
            {label && <strong className="text-moss-100 not-italic">{label}:</strong>}{' '}
            {content}
           </p>
        )}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => toggleLock(componentKey)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs ${
              lockedComponents[componentKey]
                ? 'bg-moss-600 text-white border-moss-700 hover:bg-moss-500'
                : 'bg-moss-800/30 text-moss-400 border-moss-700/30 hover:bg-moss-700 hover:text-white'
            } border `}
            title={lockedComponents[componentKey] ? 'Unlock' : 'Lock'}
          >
            {lockedComponents[componentKey] ? '🔒' : '🔓'}
          </button>
          <button
            onClick={() => rerollComponent(componentKey)}
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
            Settlement Generator
          </h1>
          <p className="text-lg text-moss-200">
            Create memorable settlements with hooks, calamities, and conflicts
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Generator */}
          <div className="space-y-6">
            {/* Options Card */}
             <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-4 text-moss-100 border-b border-moss-700 pb-2">
                Generator Options
              </h2>

              {/* Settlement Type Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="settlementTypeSelect">
                  Settlement Type
                </label>
                <select
                  id="settlementTypeSelect"
                  value={selectedType}
                  onChange={(e) => {
                      setSelectedType(e.target.value as SettlementType);
                      // Reset locks dependent on type
                      setLockedComponents(prev => ({ ...prev, name: false, population: false }));
                  }}
                   className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                >
                  {settlementData.types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => generateSettlement(false)}
                 className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105"
              >
                {generatedSettlement ? 'Generate / Reroll Unlocked' : 'Generate Settlement'}
              </button>
            </div>

            {/* Generated Settlement Display */}
            {generatedSettlement && (
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                 {/* Name and Type/Wealth */}
                  <ComponentWithControls
                     content={generatedSettlement.name}
                     componentKey="name"
                     isTitle={true}
                 />
                 <ComponentWithControls
                     content={generatedSettlement.type}
                     componentKey="type" // This will lock/reroll type, name, pop
                     italic={true}
                 />
                 <ComponentWithControls
                     label="Population"
                     content={generatedSettlement.population}
                     componentKey="population"
                     italic={true}
                 />
                <hr className="border-moss-600 my-4"/>

                 {/* Details */}
                 <ComponentWithControls
                     label="Descriptor"
                     content={generatedSettlement.descriptor}
                     componentKey="descriptor"
                 />
                 <ComponentWithControls
                     label="Known For"
                     content={generatedSettlement.knownFor}
                     componentKey="knownFor"
                 />

                 <hr className="border-moss-600 my-4"/>

                 {/* Hooks */}
                 <ComponentWithControls
                     label="Calamity"
                     content={generatedSettlement.calamity}
                     componentKey="calamity"
                 />
                 <ComponentWithControls
                     label="Conflict"
                     content={generatedSettlement.conflict}
                     componentKey="conflict"
                 />

                <button
                  onClick={copySettlement}
                  className="btn-secondary w-full mt-6"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {!generatedSettlement && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Select your options and click "Generate Settlement" to begin</p>
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
                    Edit the JSON below to customise settlement types, name parts, population descriptors, and story hooks.
                    Your changes are saved locally to your browser.
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
                    {/* --- THIS IS THE FIX --- */}
                    <button
                      onClick={resetToDefaultData} // Correct function name
                      className="btn-secondary flex-1"
                    >
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
                    <li><strong className="text-moss-100">Types:</strong> (Village, Town, Keep, etc.)</li>
                    <li><strong className="text-moss-100">Name Parts:</strong> Type-specific prefixes & suffixes</li>
                    <li><strong className="text-moss-100">Population:</strong> Type-specific population ranges</li>
                    <li><strong className="text-moss-100">Descriptor:</strong> The overall feel of the place</li>
                    <li><strong className="text-moss-100">Known For:</strong> A unique landmark or feature</li>
                    <li><strong className="text-moss-100">Calamity:</strong> An ongoing disaster or problem</li>
                    <li><strong className="text-moss-100">Conflict:</strong> A social or political plot hook</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-3 text-moss-100 border-b border-moss-700 pb-2">
                Tips for Great Settlements
              </h2>
               <ul className="space-y-1.5 text-sm text-moss-300 list-disc list-inside ml-4">
                  <li><strong className="text-moss-100">Lock (🔒):</strong> Keep a name or feature you like and reroll the rest.</li>
                  <li>Use the <strong className="text-moss-100">Calamity</strong> and <strong className="text-moss-100">Conflict</strong> as instant adventure hooks.</li>
                  <li>The <strong className="text-moss-100">Descriptor</strong> sets the tone for roleplay.</li>
                  <li>A settlement's <strong className="text-moss-100">Type</strong> will determine the options in the Shop Generator (e.g., "Village" vs "City" stock).</li>
                  <li>Add your own settlement types (e.g., "Elven Treetop", "Dwarven Hold") in the editor and create matching name parts for them.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}