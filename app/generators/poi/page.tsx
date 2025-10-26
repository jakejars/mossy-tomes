"use client";

import { useState, useEffect } from 'react';

// Default Places of Interest data structure
const defaultPoiData = {
  poiTypes: [
    "Inn / Tavern",
    "Library",
    "Brothel",
    "Restaurant",
    "Gala / Ballroom"
  ],
  namePrefix: {
    "Inn / Tavern": ["The Prancing", "The Sleeping", "The Drunken", "The Mucky", "The Gilded"],
    "Library": ["The Grand", "The Silent", "The Forgotten", "The Elder", "The High"],
    "Brothel": ["The Velvet", "The Gilded", "The Whispering", "The Ruby", "The Moonlit"],
    "Restaurant": ["The Savoury", "The Golden", "The Salty", "The King's", "The Singing"],
    "Gala / Ballroom": ["The Starlight", "The Ember", "The Grand", "The Mirror", "The Noble's"]
  },
  nameSuffix: {
    "Inn / Tavern": ["Pony", "Giant", "Clam", "Duck", "Rose"],
    "Library": ["Archive", "Athenaeum", "Scriptorium", "Tome", "Lyceum"],
    "Brothel": ["Lilly", "Cage", "Boudoir", "Lady", "Garden"],
    "Restaurant": ["Spoon", "Kettle", "Table", "Boar", "Spice"],
    "Gala / Ballroom": ["Hall", "Pavilion", "Court", "Room", "Fete"]
  },
  keyFigure: [
    "A gruff, no-nonsense owner",
    "A charming host who knows all the gossip",
    "A stoic, elderly librarian",
    "A flamboyant proprietor in fine silks",
    "A weary-looking worker who has seen too much",
    "An ex-adventurer running their 'retirement' business"
  ],
  aesthetic: [
    "Loud, smoky, and crowded",
    "Quiet, dusty, and smells of old parchment",
    "Opulent, with velvet curtains and thick incense",
    "Clean and bright, smells of baking bread",
    "Chilly and echoing, lit by candles",
    "Rundown, with sagging floors and patched walls"
  ],
  speciality: {
    "Inn / Tavern": [
      "A mysteriously strong ale",
      "A 'famous' meat pie",
      "A roaring fireplace that never goes out",
      "A minstrel who only sings sad songs"
    ],
    "Library": [
      "A forbidden/restricted section",
      "A seemingly infinite collection of scrolls",
      "A resident 'Archivist' (wizard)",
      "Has books written in an unknown language"
    ],
    "Brothel": [
      "Utter discretion",
      "Access to influential patrons",
      "Rumoured to be a spy headquarters",
      "Exotic 'talents' from faraway lands"
    ],
    "Restaurant": [
      "A dish 'to die for' (literally)",
      "A secret menu for special guests",
      "A bizarre, foreign delicacy",
      "The fastest service in town"
    ],
    "Gala / Ballroom": [
      "A legendary annual masquerade",
      "A clockwork orchestra",
      "Enchanted lighting that changes with the mood",
      "Strict, invitation-only entry"
    ]
  },
  conflict: [
    "A regular patron has gone missing",
    "The City Watch is cracking down on them",
    "A rival establishment is stealing customers",
    "It's a meeting place for a secret society",
    "The owner is being blackmailed",
    "A ghost is haunting the premises"
  ]
};

interface PoiData {
  poiTypes: string[];
  namePrefix: { [key: string]: string[] };
  nameSuffix: { [key: string]: string[] };
  keyFigure: string[];
  aesthetic: string[];
  speciality: { [key: string]: string[] };
  conflict: string[];
}

interface GeneratedPoi {
  name?: string;
  type?: string;
  keyFigure?: string;
  aesthetic?: string;
  speciality?: string;
  conflict?: string;
}

export default function PoiGeneratorPage() {
  const [poiData, setPoiData] = useState<PoiData>(defaultPoiData);
  const [generatedPoi, setGeneratedPoi] = useState<GeneratedPoi | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedType, setSelectedType] = useState('Inn / Tavern');

  // Options
  const [includeName, setIncludeName] = useState(true);
  const [includeType, setIncludeType] = useState(true);
  const [includeKeyFigure, setIncludeKeyFigure] = useState(true);
  const [includeAesthetic, setIncludeAesthetic] = useState(true);
  const [includeSpeciality, setIncludeSpeciality] = useState(true);
  const [includeConflict, setIncludeConflict] = useState(true);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mossyTomesPoiData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPoiData(parsed);
        setJsonInput(JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.error('Failed to load saved data:', e);
        setJsonInput(JSON.stringify(defaultPoiData, null, 2));
      }
    } else {
      setJsonInput(JSON.stringify(defaultPoiData, null, 2));
    }
  }, []);

  const getRandom = (arr: string[]) => {
    if (!arr || arr.length === 0) return "N/A";
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const generatePoi = () => {
    const poi: GeneratedPoi = {};

    if (includeType) {
      poi.type = selectedType;
    }

    if (includeName) {
      const prefix = getRandom(poiData.namePrefix[selectedType] || poiData.namePrefix["Inn / Tavern"]);
      const suffix = getRandom(poiData.nameSuffix[selectedType] || poiData.nameSuffix["Inn / Tavern"]);
      poi.name = `${prefix} ${suffix}`;
    }

    if (includeKeyFigure) {
      poi.keyFigure = getRandom(poiData.keyFigure);
    }

    if (includeAesthetic) {
      poi.aesthetic = getRandom(poiData.aesthetic);
    }

    if (includeSpeciality) {
      poi.speciality = getRandom(poiData.speciality[selectedType] || poiData.speciality["Inn / Tavern"]);
    }

    if (includeConflict) {
      poi.conflict = getRandom(poiData.conflict);
    }

    setGeneratedPoi(poi);
  };

  const saveData = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setPoiData(parsed);
      localStorage.setItem('mossyTomesPoiData', jsonInput);
      setSaveStatus('✓ Data saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('✗ Error: Invalid JSON format');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const resetData = () => {
    if (confirm('Reset all data to defaults? Your customizations will be lost.')) {
      setPoiData(defaultPoiData);
      setJsonInput(JSON.stringify(defaultPoiData, null, 2));
      localStorage.removeItem('mossyTomesPoiData');
      setSaveStatus('↻ Reset to defaults');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const copyPoi = () => {
    if (!generatedPoi) return;
    
    let text = '';
    if (generatedPoi.name) text += `${generatedPoi.name}\n`;
    if (generatedPoi.type) text += `${generatedPoi.type}\n\n`;
    if (generatedPoi.keyFigure) text += `Key Figure: ${generatedPoi.keyFigure}\n`;
    if (generatedPoi.aesthetic) text += `Aesthetic: ${generatedPoi.aesthetic}\n`;
    if (generatedPoi.speciality) text += `Speciality / Feature: ${generatedPoi.speciality}\n`;
    if (generatedPoi.conflict) text += `\nConflict / Hook: ${generatedPoi.conflict}\n`;
    
    navigator.clipboard.writeText(text);
    setSaveStatus('✓ Copied to clipboard!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-moss-50">
            Places of Interest Generator
          </h1>
          <p className="text-lg text-moss-200">
            Create memorable locations with atmosphere, intrigue, and plot hooks
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Generator */}
          <div className="space-y-6">
            {/* Options Card */}
            <div className="card p-6">
              <h2 className="font-serif text-xl font-semibold mb-4 text-moss-100">
                Generator Options
              </h2>
              
              {/* Place Type Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-moss-200 mb-2">
                  Place Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 bg-moss-900/50 border border-moss-700/30 rounded-lg text-moss-100"
                >
                  {poiData.poiTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Field Toggles */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100">
                  <input
                    type="checkbox"
                    checked={includeName}
                    onChange={(e) => setIncludeName(e.target.checked)}
                    className="w-4 h-4 rounded bg-moss-800 border-moss-600"
                  />
                  <span>Name</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100">
                  <input
                    type="checkbox"
                    checked={includeType}
                    onChange={(e) => setIncludeType(e.target.checked)}
                    className="w-4 h-4 rounded bg-moss-800 border-moss-600"
                  />
                  <span>Type</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100">
                  <input
                    type="checkbox"
                    checked={includeKeyFigure}
                    onChange={(e) => setIncludeKeyFigure(e.target.checked)}
                    className="w-4 h-4 rounded bg-moss-800 border-moss-600"
                  />
                  <span>Key Figure</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100">
                  <input
                    type="checkbox"
                    checked={includeAesthetic}
                    onChange={(e) => setIncludeAesthetic(e.target.checked)}
                    className="w-4 h-4 rounded bg-moss-800 border-moss-600"
                  />
                  <span>Aesthetic</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100">
                  <input
                    type="checkbox"
                    checked={includeSpeciality}
                    onChange={(e) => setIncludeSpeciality(e.target.checked)}
                    className="w-4 h-4 rounded bg-moss-800 border-moss-600"
                  />
                  <span>Speciality</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100">
                  <input
                    type="checkbox"
                    checked={includeConflict}
                    onChange={(e) => setIncludeConflict(e.target.checked)}
                    className="w-4 h-4 rounded bg-moss-800 border-moss-600"
                  />
                  <span>Conflict</span>
                </label>
              </div>

              <button
                onClick={generatePoi}
                className="btn-primary w-full text-lg py-3"
              >
                Generate Place
              </button>
            </div>

            {/* Generated POI Display */}
            {generatedPoi && (
              <div className="card p-8">
                {generatedPoi.name && (
                  <h3 className="font-serif text-3xl font-bold text-moss-50 mb-2">
                    {generatedPoi.name}
                  </h3>
                )}
                {generatedPoi.type && (
                  <p className="text-xl italic text-moss-300 mb-6">
                    {generatedPoi.type}
                  </p>
                )}
                <div className="space-y-3 text-moss-200">
                  {generatedPoi.keyFigure && (
                    <p>
                      <strong className="text-moss-100">Key Figure:</strong> {generatedPoi.keyFigure}
                    </p>
                  )}
                  {generatedPoi.aesthetic && (
                    <p>
                      <strong className="text-moss-100">Aesthetic:</strong> {generatedPoi.aesthetic}
                    </p>
                  )}
                  {generatedPoi.speciality && (
                    <p>
                      <strong className="text-moss-100">Speciality / Feature:</strong> {generatedPoi.speciality}
                    </p>
                  )}
                  {generatedPoi.conflict && (
                    <p className="mt-4 pt-4 border-t border-moss-700/30">
                      <strong className="text-moss-100">Conflict / Hook:</strong> {generatedPoi.conflict}
                    </p>
                  )}
                </div>
                <button
                  onClick={copyPoi}
                  className="btn-secondary w-full mt-6"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {!generatedPoi && (
              <div className="card p-8 text-center text-moss-400">
                <p>Select your options and click "Generate Place" to begin</p>
              </div>
            )}
          </div>

          {/* Right Column: Data Editor */}
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-xl font-semibold text-moss-100">
                  Customize Data
                </h2>
                <button
                  onClick={() => setShowEditor(!showEditor)}
                  className="text-moss-400 hover:text-moss-300 text-sm"
                >
                  {showEditor ? 'Hide Editor' : 'Show Editor'}
                </button>
              </div>

              {showEditor ? (
                <>
                  <p className="text-sm text-moss-400 mb-4 italic">
                    Edit the JSON below to customize place types, names, key figures, and more. 
                    Your changes are saved to your browser.
                  </p>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-96 p-3 bg-moss-900/50 border border-moss-700/30 rounded-lg text-moss-100 font-mono text-sm"
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
                    <p className={`text-center mt-3 font-medium ${
                      saveStatus.includes('✓') || saveStatus.includes('↻') 
                        ? 'text-moss-400' 
                        : 'text-red-400'
                    }`}>
                      {saveStatus}
                    </p>
                  )}
                </>
              ) : (
                <div className="space-y-4 text-moss-300">
                  <p>Click "Show Editor" to customize:</p>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong className="text-moss-200">Place Types:</strong> Categories of locations</li>
                    <li>• <strong className="text-moss-200">Names:</strong> Type-specific name components</li>
                    <li>• <strong className="text-moss-200">Key Figures:</strong> Proprietors and important NPCs</li>
                    <li>• <strong className="text-moss-200">Aesthetics:</strong> Sensory and atmospheric details</li>
                    <li>• <strong className="text-moss-200">Specialities:</strong> Type-specific unique features</li>
                    <li>• <strong className="text-moss-200">Conflicts:</strong> Story hooks and complications</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="card p-6">
              <h2 className="font-serif text-xl font-semibold mb-3 text-moss-100">
                Tips for Great Locations
              </h2>
              <ul className="space-y-2 text-moss-300 text-sm">
                <li>• Use specialities to make locations unforgettable</li>
                <li>• Conflicts create recurring story opportunities</li>
                <li>• Generate multiple places to fill a city district</li>
                <li>• Key figures can become important NPCs</li>
                <li>• Customize place types for your setting's culture</li>
                <li>• Copy locations to build your world's atlas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
