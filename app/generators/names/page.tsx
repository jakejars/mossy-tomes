'use client';

import { useState, useEffect } from 'react';
import type {
  NameGenData,
  GeneratedName,
  NameLockedComponents,
  NameCategory
} from '../../../types/generators'; // Import the new types

// --- Default Data ---
const defaultNameGenData: NameGenData = {
  categories: ["Dwarf", "Elf", "Human", "Halfling", "Orc", "Fantasy", "Roman", "Japanese"],
  titles: [
    "the Brave", "the Bold", "the Wise", "the Strong", "the Quick", "the Clever",
    "Ironhand", "Shadow-walker", "Swift-arrow", "Bright-eye", "the Wanderer",
    "of the Mountain", "of the Forest", "of the River", "of the Vale", "the Smith",
    "the Red", "the Black", "the Grey", "the White", "the Green"
  ],
  names: {
    "Dwarf": {
      male: ["Adrik", "Baern", "Brottor", "Dain", "Eberk", "Fargrim", "Gardain", "Harbek", "Kildrak", "Morgran", "Orsik", "Thoradin", "Ulfgar", "Veit", "Vondal"],
      female: ["Amber", "Artin", "Audhild", "Bardryn", "Dagnal", "Diesa", "Eldeth", "Falkrunn", "Gunnloda", "Helja", "Hlin", "Kathra", "Kristryd", "Sannl", "Torgga"],
      surname: ["Balderk", "Battlehammer", "Brawnanvil", "Dankil", "Fireforge", "Frostbeard", "Gorunn", "Holderhek", "Ironfist", "Loderr", "Lutgehr", "Rumnaheim", "Strakeln", "Torunn", "Ungart"]
    },
    "Elf": {
      male: ["Adran", "Aelar", "Beiro", "Carric", "Erdan", "Galinndan", "Hadarai", "Immeral", "Laucian", "Mindartis", "Paelias", "Quarion", "Riardon", "Sovellios", "Theren"],
      female: ["Adrie", "Althaea", "Bethrynna", "Caelynn", "Drusilia", "Enna", "Felosial", "Ielenia", "Jelenneth", "Keyleth", "Leshanna", "Meriele", "Naivara", "Sariel", "Valanthe"],
      surname: ["Amakiir", "Amastacia", "Galanodel", "Holimion", "Ilphelkiir", "Liadon", "Meliamne", "Naïlo", "Siannodel", "Xiloscient", "Silverbrow", "Moonwhisper", "Starflower"]
    },
    "Human": {
      male: ["Ander", "Bram", "Corrin", "Daveth", "Erik", "Finnan", "Garrick", "Hadrian", "Joric", "Kaelen", "Loric", "Merek", "Orion", "Perrin", "Roric", "Stefan", "Tarek", "Varrus"],
      female: ["Alina", "Bryn", "Cora", "Elara", "Faye", "Gwen", "Helena", "Isolde", "Janna", "Kiera", "Linnea", "Miri", "Nadia", "Renna", "Sorina", "Tessa", "Vasha"],
      surname: ["Blackwood", "Grey", "Stormwind", "Ashford", "Fairchild", "Hawthorne", "Landon", "Merrin", "Rowan", "Silver", "Thorne", "West", "Oakhart", "Rivers", "Stonewell"]
    },
    "Halfling": {
      male: ["Alton", "Corrin", "Eldon", "Finnan", "Lyle", "Merric", "Milo", "Osborn", "Perrin", "Reed", "Roscoe", "Wellby", "Jasper", "Pip", "Tobin"],
      female: ["Bree", "Callie", "Cora", "Euphemia", "Jillian", "Kithri", "Lavinia", "Lidda", "Merla", "Nedda", "Portia", "Seraphina", "Shaena", "Trym", "Verna"],
      surname: ["Brushgather", "Goodbarrel", "Greenbottle", "High-hill", "Hilltopple", "Leagallow", "Tealeaf", "Thorngage", "Tosscobble", "Underbough", "Appleblossom", "Short-strider"]
    },
    "Orc": {
      male: ["Argran", "Borgath", "Dreg", "Ghorbash", "Grishnakh", "Hrogar", "Murgol", "Ogrul", "Rhorag", "Shagrol", "Thokk", "Urzog", "Yamarz", "Zul"],
      female: ["Baggi", "Emen", "Engong", "Ghorza", "Gra-Mug", "Lash", "Mazoga", "Mog", "Oghash", "Shel", "Shurkul", "Urzul", "Volen", "Yazgash"],
      surname: ["Doom-Hammer", "Iron-Tusk", "Skull-Crusher", "Blood-Axe", "Bone-Breaker", "Gut-Ripper", "Head-Chopper", "Sharp-Tooth", "Gro-Khash", "Gra-Oluk", "Face-Smasher"]
    },
    "Fantasy": {
      male: ["Aethel", "Bryce", "Corvus", "Draven", "Erevan", "Faelan", "Griffin", "Heiran", "Jareth", "Kael", "Lucien", "Malachi", "Nero", "Orion", "Percival", "Quill", "Riven", "Silas", "Thane", "Zephyr"],
      female: ["Aeliana", "Briar", "Cerys", "Dahlia", "Elora", "Feyre", "Guinevere", "Hesperia", "Ione", "Juno", "Lyra", "Morwenna", "Nyx", "Ophelia", "Persephone", "Rowan", "Seraphina", "Tamsin", "Vespera"],
      surname: ["Nightbreeze", "Shadowmend", "Starfall", "Winterbourne", "Ironwood", "Moonshadow", "Stormcloak", "Sunstrider", "Whisperwind", "Voidgazer", "Trueflame", "Brightwood"]
    },
    "Roman": {
      male: ["Marcus", "Lucius", "Gaius", "Tiberius", "Decimus", "Sextus", "Aulus", "Cassius", "Felix", "Julius", "Augustus", "Nero", "Titus", "Valerius", "Maximus"],
      female: ["Aelia", "Augusta", "Cassia", "Claudia", "Cornelia", "Fausta", "Flavia", "Julia", "Livia", "Marcella", "Octavia", "Portia", "Silvia", "Tullia", "Valeria"],
      surname: ["Aquilinus", "Cognomen", "Maximus", "Paulus", "Severus", "Albinus", "Cato", "Crassus", "Drusus", "Varro", "Cicero", "Brutus", "Scaevola", "Agrippa"]
    },
    "Japanese": {
      male: ["Akira", "Daichi", "Haruto", "Hiroshi", "Ichiro", "Jiro", "Kenji", "Kaito", "Minato", "Ren", "Sota", "Takashi", "Yamato", "Yuki", "Hideo"],
      female: ["Aoi", "Emi", "Hana", "Himari", "Ichika", "Kanon", "Mei", "Mio", "Rin", "Sakura", "Suki", "Tsubaki", "Yui", "Yuna", "Hina"],
      surname: ["Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Nakamura", "Kobayashi", "Yamamoto", "Kato", "Yoshida", "Yamada", "Sasaki", "Matsumoto", "Inoue"]
    }
  }
};

export default function CharacterNamesGenerator() {
  const [nameData, setNameData] = useState<NameGenData>(defaultNameGenData);
  const [generatedName, setGeneratedName] = useState<GeneratedName | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NameCategory>('Fantasy');
  const [lockedComponents, setLockedComponents] = useState<NameLockedComponents>({});
  const [includeTitle, setIncludeTitle] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('worldBuilderNameData_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.categories) && typeof parsed.names === 'object') {
          setNameData(parsed);
          setJsonInput(JSON.stringify(parsed, null, 2));
          if (!parsed.categories.includes(selectedCategory)) {
             setSelectedCategory(parsed.categories[0] || 'Fantasy');
          }
        } else {
            console.warn('Saved Name data structure mismatch, resetting.');
            resetToDefaultData();
        }
      } catch (e) {
        console.error('Failed to load or parse saved Name data:', e);
        resetToDefaultData();
      }
    } else {
      setJsonInput(JSON.stringify(defaultNameGenData, null, 2));
    }
  }, []);

  const resetToDefaultData = () => {
    setNameData(defaultNameGenData);
    setJsonInput(JSON.stringify(defaultNameGenData, null, 2));
    localStorage.removeItem('worldBuilderNameData_v1');
  };

  const getRandom = <T extends string | number | Record<string, any>>(arr: T[]): T | undefined => {
    if (!arr || arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const generateSingleComponent = (componentKey: keyof GeneratedName): GeneratedName[keyof GeneratedName] => {
      const names = nameData.names[selectedCategory] || nameData.names["Fantasy"]; // Fallback to Fantasy

      switch(componentKey) {
          case 'category': return selectedCategory;
          case 'maleName': return getRandom(names.male) || "Ander";
          case 'femaleName': return getRandom(names.female) || "Elara";
          case 'surname': return getRandom(names.surname) || "Blackwood";
          case 'title': return getRandom(nameData.titles) || "the Brave";
          default: return "N/A";
      }
  }

  const generateName = (fullReroll: boolean = true) => {
    const name: Partial<GeneratedName> = {};

     const fieldsToGenerate: (keyof GeneratedName)[] = [
      'category', 'maleName', 'femaleName', 'surname'
    ];
    
    if (includeTitle) {
      fieldsToGenerate.push('title');
    }

    fieldsToGenerate.forEach(key => {
        if (fullReroll || !lockedComponents[key]) {
             name[key] = generateSingleComponent(key) as any;
        } else if (generatedName && generatedName[key] !== undefined) {
           name[key] = generatedName[key] as any;
        } else {
             name[key] = generateSingleComponent(key) as any;
        }
    });
    
    if (!includeTitle) {
      name.title = ''; // Ensure title is blank if not included
    }
    
    setGeneratedName(name as GeneratedName);
  };

   const rerollComponent = (componentKey: keyof GeneratedName) => {
      if (!generatedName) return;
      const newValue = generateSingleComponent(componentKey);
      setGeneratedName(prev => {
          if (!prev) return null;
          const newState = { ...prev };
          (newState[componentKey] as any) = newValue;
          
          // If 'category' is rerolled, all name parts might need rerolling if unlocked
          if(componentKey === 'category') {
              if(!newState.maleName || !lockedComponents['maleName']) newState.maleName = generateSingleComponent('maleName') as string;
              if(!newState.femaleName || !lockedComponents['femaleName']) newState.femaleName = generateSingleComponent('femaleName') as string;
              if(!newState.surname || !lockedComponents['surname']) newState.surname = generateSingleComponent('surname') as string;
          }
          return newState;
      });
  };

  const toggleLock = (componentKey: keyof GeneratedName) => {
    setLockedComponents(prev => ({
      ...prev,
      [componentKey]: !prev[componentKey]
    }));
  };

 const saveData = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed.categories) && typeof parsed.names === 'object' && Array.isArray(parsed.titles)) {
        setNameData(parsed);
        localStorage.setItem('worldBuilderNameData_v1', jsonInput);
        setSaveStatus('✓ Data saved successfully!');
          if (!parsed.categories.includes(selectedCategory)) {
             setSelectedCategory(parsed.categories[0] || 'Fantasy');
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
       if(defaultNameGenData.categories && defaultNameGenData.categories.length > 0){
           setSelectedCategory(defaultNameGenData.categories[0]);
       }
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const copyName = () => {
    if (!generatedName) return;

    let text = `Character Names (${generatedName.category})\n\n`;
    text += `Male: ${generatedName.maleName} ${generatedName.surname}\n`;
    text += `Female: ${generatedName.femaleName} ${generatedName.surname}\n`;
    
    if (includeTitle && generatedName.title) {
       text += `\nTitle Suggestion: ${generatedName.title}\n`;
    }

    navigator.clipboard.writeText(text.trim());
    setSaveStatus('✓ Copied to clipboard!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  // --- ComponentWithControls Helper ---
  const ComponentWithControls = ({
    label,
    content,
    componentKey,
  }: {
    label: string;
    content: string;
    componentKey: keyof GeneratedName;
  }) => {
    
    if (!content) return null; // Don't render if content is empty (e.g., title)

    return (
       <div className="relative group mb-3 pr-20 text-lg text-moss-200">
         <p>
          <strong className="text-moss-100">{label}:</strong>{' '}
          {content}
         </p>
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
    <main className="min-h-screen py-20 px-6 text-moss-100"> {/* Removed background classes */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-moss-50">
            Character Names Generator
          </h1>
          <p className="text-lg text-moss-200">
            Generate authentic character names from various cultures and styles
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

              {/* Name Category Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-moss-200 mb-2" htmlFor="nameCategorySelect">
                  Name Category
                </label>
                <select
                  id="nameCategorySelect"
                  value={selectedCategory}
                  onChange={(e) => {
                      setSelectedCategory(e.target.value as NameCategory);
                      // Reset all name locks
                      setLockedComponents(prev => ({ ...prev, maleName: false, femaleName: false, surname: false }));
                  }}
                   className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                >
                  {nameData.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              {/* Include Title Checkbox */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={includeTitle} 
                    onChange={(e) => {
                      setIncludeTitle(e.target.checked);
                      setLockedComponents(prev => ({...prev, title: false }));
                    }} 
                    className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"
                  />
                  <span>Include Title / Epithet</span>
                 </label>
              </div>

              <button
                onClick={() => generateName(false)}
                 className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105"
              >
                {generatedName ? 'Generate / Reroll Unlocked' : 'Generate Name'}
              </button>
            </div>

            {/* Generated Name Display */}
            {generatedName && (
              <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                 <p className="text-lg italic text-moss-300 mb-4">
                   Category: {generatedName.category}
                 </p>
                 
                 <ComponentWithControls
                     label="Male"
                     content={generatedName.maleName}
                     componentKey="maleName"
                 />
                 <ComponentWithControls
                     label="Female"
                     content={generatedName.femaleName}
                     componentKey="femaleName"
                 />
                 <ComponentWithControls
                     label="Surname"
                     content={generatedName.surname}
                     componentKey="surname"
                 />
                 
                 {includeTitle && (
                    <>
                      <hr className="border-moss-600 my-4"/>
                      <ComponentWithControls
                         label="Title"
                         content={generatedName.title}
                         componentKey="title"
                     />
                    </>
                 )}

                <button
                  onClick={copyName}
                  className="btn-secondary w-full mt-6"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {!generatedName && (
              <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
                <p>Select your options and click "Generate Name" to begin</p>
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
                    Edit the JSON below to add new categories (e.g., "Gnome", "Dragonborn") or add to existing name lists.
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
                    <li><strong className="text-moss-100">Categories:</strong> (Dwarf, Elf, Human, etc.)</li>
                    <li><strong className="text-moss-100">Names:</strong> Male, Female, and Surname lists for each category.</li>
                    <li><strong className="text-moss-100">Titles:</strong> A general list of epithets that can be added to any name.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-3 text-moss-100 border-b border-moss-700 pb-2">
                Tips for Great Names
              </h2>
               <ul className="space-y-1.5 text-sm text-moss-300 list-disc list-inside ml-4">
                  <li><strong className="text-moss-100">Lock (🔒):</strong> Find a surname you like? Lock it and reroll the first names.</li>
                  <li>This generator provides a male and female name for each surname to give you options.</li>
                  <li>Use the <strong className="text-moss-100">Editor</strong> to add name lists that fit your specific setting or campaign.</li>
                  <li>Use the <strong className="text-moss-100">Title</strong> checkbox to add extra flavour for important NPCs or characters.</li>
                  <li>Combine names from different categories (e.g., an Elven first name with a Human surname) for unique backstories.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}