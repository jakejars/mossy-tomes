'use client';

import { useState, useEffect } from 'react';
import type {
  LandmassGenData,
  GeneratedLandmass,
  LandmassLockedComponents,
  LandmassType,
  LandmassBiomes
} from '../../../types/generators'; // Import the new types

// --- Default Data ---
const defaultLandmassGenData: LandmassGenData = {
  types: ["Continent", "Island", "Archipelago", "Peninsula"],
  biomes: ["Standard", "Jungle", "Desert", "Arctic", "Swamp"],
  namePrefix: [
    "Asha", "Cor", "Drak", "El", "Gryph", "Heth", "Ixor", "Jor", "Kor", "Lith",
    "Mor", "Nym", "Ophir", "Pylos", "Ryn", "Sol", "Teth", "Uld", "Vyn", "Zar"
  ],
  nameSuffix: [
    "ia", "os", "eth", "andar", "terra", "fall", "wood", "gard", "mar", "dor",
    "thas", "ia", "ora", "lyn", "heim", "spar", "reach", "thule", "a"
  ],
  shape: [
    "Shaped like a crescent moon",
    "Resembles a clenched fist",
    "A long, sprawling shape, like a serpent",
    "Roughly circular, with a large central mountain",
    "Fragmented into dozens of smaller islets",
    "Has a massive, fjord-like bay cutting into its centre",
    "Looks like a shattered star",
    "Almost perfectly triangular"
  ],
  features: {
    "Standard": [
      "A vast, rolling plain known for its megafauna",
      "An impossibly tall mountain, 'The World's Spire'",
      "A network of deep, fog-filled canyons",
      "A shimmering, magically-infused forest",
      "A great lake so large it's considered an inland sea"
    ],
    "Jungle": [
      "A massive, miles-wide waterfall",
      "A 'green hell' of overgrown, ancient ruins",
      "A winding river, choked with giant lilies",
      "Home to tribes of sentient, colourful jungle-apes",
      "A region where the trees blot out the sun entirely"
    ],
    "Desert": [
      "A sea of shifting, glassy sand",
      "A massive oasis, home to a legendary city",
      "A canyon carved by a long-dead river",
      "Towering rock mesas that scrape the sky",
      "An ancient, exposed stone circle that hums with power"
    ],
    "Arctic": [
      "A moving glacier that grinds the land beneath it",
      "A network of geothermal vents creating a hidden, warm valley",
      "A colossal, frozen-over waterfall",
      "The skeletal remains of a truly colossal, unknown beast",
      "Towering spires of blue, magical ice"
    ],
    "Swamp": [
      "A 'graveyard' of half-sunk, ancient statues",
      "A forest of giant, bioluminescent mushrooms",
      "Bubbling tar pits that preserve ancient creatures",
      "A labyrinthine network of mangrove tunnels",
      "The ruins of a city, slowly sinking into the mire"
    ]
  },
  history: [
    "Was the site of a cataclysmic, ancient war",
    "Was raised from the sea by a god, millennia ago",
    "Used to be a penal colony for a forgotten empire",
    "Was the ancestral homeland of the Elves (or Dwarves/Giants)",
    "Broke off from the main continent in a great sundering",
    "Is a 'new' landmass, still cooling from volcanic birth",
    "Was hidden by a magical shroud for centuries"
  ],
  mystery: [
    "A strange, magical sickness is spreading from its interior",
    "No maps of this land seem to work correctly",
    "Ships that get too close are often found crewless",
    "A powerful, unknown entity slumbers beneath its surface",
    "It periodically vanishes and reappears in a different location",
    "All creatures born there have a strange, glowing mark",
    "Its true name is a secret that holds a powerful curse"
  ]
};

export default function LandmassGeneratorPage() {
  const [landmassData, setLandmassData] = useState<LandmassGenData>(defaultLandmassGenData);
  const [generatedLandmass, setGeneratedLandmass] = useState<GeneratedLandmass | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedType, setSelectedType] = useState<LandmassType>('Island');
  const [selectedBiome, setSelectedBiome] = useState<LandmassBiomes>('Standard');
  const [lockedComponents, setLockedComponents] = useState<LandmassLockedComponents>({});

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('worldBuilderLandmassData_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.types) && typeof parsed.namePrefix === 'object') {
          setLandmassData(parsed);
          setJsonInput(JSON.stringify(parsed, null, 2));
          if (!parsed.types.includes(selectedType)) {
             setSelectedType(parsed.types[0] || 'Island');
          }
           if (!parsed.biomes.includes(selectedBiome)) {
             setSelectedBiome(parsed.biomes[0] || 'Standard');
          }
        } else {
            console.warn('Saved Landmass data structure mismatch, resetting.');
            resetToDefaultData();
        }
      } catch (e) {
        console.error('Failed to load or parse saved Landmass data:', e);
        resetToDefaultData();
      }
    } else {
      setJsonInput(JSON.stringify(defaultLandmassGenData, null, 2));
    }
  }, []);

  const resetToDefaultData = () => {
    setLandmassData(defaultLandmassGenData);
    setJsonInput(JSON.stringify(defaultLandmassGenData, null, 2));
    localStorage.removeItem('worldBuilderLandmassData_v1');
  };

  const getRandom = <T extends string | number | Record<string, any>>(arr: T[]): T | undefined => {
    if (!arr || arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const generateSingleComponent = (componentKey: keyof GeneratedLandmass): GeneratedLandmass[keyof GeneratedLandmass] => {
      switch(componentKey) {
          case 'name':
              const prefix = getRandom(landmassData.namePrefix);
              const suffix = getRandom(landmassData.nameSuffix);
              return (prefix && suffix) ? `${prefix}${suffix}` : "The Unnamed Land";
          case 'type': return selectedType;
          case 'biome': return selectedBiome;
          case 'shape': return getRandom(landmassData.shape) || "An unremarkable shape";
          case 'feature':
              const features = landmassData.features[selectedBiome] || landmassData.features["Standard"];
              return getRandom(features) || "No notable features";
          case 'history': return getRandom(landmassData.history) || "An unknown history";
          case 'mystery': return getRandom(landmassData.mystery) || "No current mystery";
          default: return "N/A";
      }
  }

  const generateLandmass = (fullReroll: boolean = true) => {
    const landmass: Partial<GeneratedLandmass> = {};

     const fieldsToGenerate: (keyof GeneratedLandmass)[] = [
      'name', 'type', 'biome', 'shape', 'feature', 'history', 'mystery'
    ];

    fieldsToGenerate.forEach(key => {
        if (fullReroll || !lockedComponents[key]) {
             landmass[key] = generateSingleComponent(key) as any;
        } else if (generatedLandmass && generatedLandmass[key] !== undefined) {
           landmass[key] = generatedLandmass[key] as any;
        } else {
             landmass[key] = generateSingleComponent(key) as any;
        }
    });
    
    setGeneratedLandmass(landmass as GeneratedLandmass);
  };

   const rerollComponent = (componentKey: keyof GeneratedLandmass) => {
      if (!generatedLandmass) return;
      const newValue = generateSingleComponent(componentKey);
      setGeneratedLandmass(prev => {
          if (!prev) return null;
          const newState = { ...prev };
          (newState[componentKey] as any) = newValue;
          
          if(componentKey === 'biome') {
              if(!newState.feature || !lockedComponents['feature']) newState.feature = generateSingleComponent('feature') as string;
          }
          
          return newState;
      });
  };

  const toggleLock = (componentKey: keyof GeneratedLandmass) => {
    setLockedComponents(prev => ({
      ...prev,
      [componentKey]: !prev[componentKey]
    }));
  };

 const saveData = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed.types) && typeof parsed.namePrefix === 'object' && typeof parsed.features === 'object') {
        setLandmassData(parsed);
        localStorage.setItem('worldBuilderLandmassData_v1', jsonInput);
        setSaveStatus('✓ Data saved successfully!');
          if (!parsed.types.includes(selectedType)) {
             setSelectedType(parsed.types[0] || 'Island');
          }
           if (!parsed.biomes.includes(selectedBiome)) {
             setSelectedBiome(parsed.biomes[0] || 'Standard');
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

  const resetData = () => {
    if (confirm('Reset all data to defaults? Your customisations will be lost.')) {
      resetToDefaultData();
      setLockedComponents({});
      setSaveStatus('↻ Reset to defaults');
       if(defaultLandmassGenData.types && defaultLandmassGenData.types.length > 0){
           setSelectedType(defaultLandmassGenData.types[0]);
       }
       if(defaultLandmassGenData.biomes && defaultLandmassGenData.biomes.length > 0){
           setSelectedBiome(defaultLandmassGenData.biomes[0]);
       }
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const copyLandmass = () => {
    if (!generatedLandmass) return;

    let text = '';
    text += `${generatedLandmass.name}\n`;
    text += `(${generatedLandmass.type}, ${generatedLandmass.biome} Biome)\n\n`;
    text += `Shape: ${generatedLandmass.shape}\n`;
    text += `Key Feature: ${generatedLandmass.feature}\n\n`;
    text += `History: ${generatedLandmass.history}\n`;
    text += `Mystery: ${generatedLandmass.mystery}\n`;

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
    componentKey: keyof GeneratedLandmass;
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
            Landmass Generator
          </h1>
          <p className="text-lg text-moss-200">
            Create narrative seeds for islands, continents, and archipelagos
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

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* Landmass Type Selector */}
                <div>
                  <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="landmassTypeSelect">
                    Landmass Type
                  </label>
                  <select
                    id="landmassTypeSelect"
                    value={selectedType}
                    onChange={(e) => {
                        setSelectedType(e.target.value as LandmassType);
                    }}
                     className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                  >
                    {landmassData.types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Biome Selector */}
                <div>
                  <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="biomeSelect">
                    Primary Biome
                  </label>
                  <select
                    id="biomeSelect"
                    value={selectedBiome}
                    onChange={(e) => {
                        setSelectedBiome(e.target.value as LandmassBiomes);
                        // Reset feature lock
                        setLockedComponents(prev => ({ ...prev, feature: false }));
                    }}
                     className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                  >
                    {landmassData.biomes.map(biome => (
                      <option key={biome} value={biome}>{biome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => generateLandmass(false)}
                 className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105"
              >
                {generatedLandmass ? 'Generate / Reroll Unlocked' : 'Generate Landmass'}
              </button>
            </div>

            {/* Generated Landmass Display */}
            {generatedLandmass && (
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                 <ComponentWithControls
                     content={generatedLandmass.name}
                     componentKey="name"
                     isTitle={true}
                 />
                 <ComponentWithControls
                     content={`${generatedLandmass.type} (${generatedLandmass.biome} Biome)`}
                     componentKey="type" // This will lock/reroll type
                     italic={true}
                 />
                 
                <hr className="border-moss-600 my-4"/>

                 <ComponentWithControls
                     label="Shape"
                     content={generatedLandmass.shape}
                     componentKey="shape"
                 />
                 <ComponentWithControls
                     label="Key Feature"
                     content={generatedLandmass.feature}
                     componentKey="feature"
                 />
                 
                 <hr className="border-moss-600 my-4"/>

                 <ComponentWithControls
                     label="History"
                     content={generatedLandmass.history}
                     componentKey="history"
                 />
                 <ComponentWithControls
                     label="Mystery"
                     content={generatedLandmass.mystery}
                     componentKey="mystery"
                 />

                <button
                  onClick={copyLandmass}
                  className="btn-secondary w-full mt-6"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {!generatedLandmass && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Select your options and click "Generate Landmass" to begin</p>
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
                    Edit the JSON below to customise landmass types, biomes, name parts, features, and story hooks.
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
                    <li><strong className="text-moss-100">Types & Biomes:</strong> (Island, Arctic, etc.)</li>
                    <li><strong className="text-moss-100">Name Parts:</strong> Prefixes & suffixes</li>
                    <li><strong className="text-moss-100">Shape:</strong> The general physical form</li>
                    <li><strong className="text-moss-100">Features:</strong> Biome-specific landmarks</li>
                    <li><strong className="text-moss-100">History:</strong> A key historical fact (plot hook)</li>
                    <li><strong className="text-moss-100">Mystery:</strong> A strange ongoing phenomenon (plot hook)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-3 text-moss-100 border-b border-moss-700 pb-2">
                Tips for Great Landmasses
              </h2>
               <ul className="space-y-1.5 text-sm text-moss-300 list-disc list-inside ml-4">
                  <li><strong className="text-moss-100">Lock (🔒):</strong> Lock a name or biome you like and reroll the details.</li>
                  <li>Use the <strong className="text-moss-100">Mystery</strong> and <strong className="text-moss-100">History</strong> as the core conceits for an adventure.</li>
                  <li>Changing the <strong className="text-moss-100">Biome</strong> will also reroll the <strong className="text-moss-100">Key Feature</strong> to match it.</li>
                  <li>This generator is a starting point. Use the output to inspire your map-making.</li>
                  <li>In the editor, add new biomes (e.g., "Volcanic", "Underdark") and fill in appropriate features for them.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}