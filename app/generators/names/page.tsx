'use client';

import { useState, useCallback } from 'react';
import type {
  NameGenData,
  GeneratedName,
  NameLockedComponents,
  NameCategory
} from '../../../types/generators';
import { useGeneratorState } from '../../../hooks/useGeneratorState';
import { useRandom } from '../../../hooks/useRandom';
import { GeneratorLayout, DataEditorCard, TipsCard } from '../../../components/GeneratorLayout';
import { ComponentWithControls } from '../../../components/ComponentWithControls';
import defaultNameGenData from '../../../data/names.json';

// Validation function for data structure
const validateNameData = (data: any): boolean => {
  return (
    Array.isArray(data.categories) &&
    typeof data.names === 'object' &&
    Array.isArray(data.titles)
  );
};

export default function CharacterNamesGenerator() {
  const { getRandom } = useRandom();
  const {
    data: nameData,
    generated,
    setGenerated,
    lockedComponents,
    showEditor,
    setShowEditor,
    jsonInput,
    setJsonInput,
    saveStatus,
    saveData,
    resetData,
    toggleLock,
    copyToClipboard,
  } = useGeneratorState<NameGenData, GeneratedName, NameLockedComponents>(
    defaultNameGenData as NameGenData,
    'worldBuilderNameData_v1',
    validateNameData
  );

  const [selectedCategory, setSelectedCategory] = useState<NameCategory>('Fantasy');
  const [includeTitle, setIncludeTitle] = useState(false);

  const generateSingleComponent = useCallback(
    (componentKey: keyof GeneratedName): string => {
      const names = nameData.names[selectedCategory] || nameData.names['Fantasy'];

      switch (componentKey) {
        case 'category':
          return selectedCategory;
        case 'maleName':
          return getRandom(names.male) || 'Ander';
        case 'femaleName':
          return getRandom(names.female) || 'Elara';
        case 'surname':
          return getRandom(names.surname) || 'Blackwood';
        case 'title':
          return getRandom(nameData.titles) || 'the Brave';
        default:
          return 'N/A';
      }
    },
    [nameData, selectedCategory, getRandom]
  );

  const generateName = useCallback(
    (fullReroll: boolean = true) => {
      const name: Partial<GeneratedName> = {};
      const fieldsToGenerate: (keyof GeneratedName)[] = [
        'category',
        'maleName',
        'femaleName',
        'surname',
      ];

      if (includeTitle) {
        fieldsToGenerate.push('title');
      }

      fieldsToGenerate.forEach((key) => {
        if (fullReroll || !lockedComponents[key]) {
          name[key] = generateSingleComponent(key) as any;
        } else if (generated && generated[key] !== undefined) {
          name[key] = generated[key] as any;
        } else {
          name[key] = generateSingleComponent(key) as any;
        }
      });

      if (!includeTitle) {
        name.title = '';
      }

      setGenerated(name as GeneratedName);
    },
    [includeTitle, lockedComponents, generated, generateSingleComponent, setGenerated]
  );

  const rerollComponent = useCallback(
    (componentKey: keyof GeneratedName) => {
      if (!generated) return;
      const newValue = generateSingleComponent(componentKey);
      setGenerated((prev) => {
        if (!prev) return null;
        const newState = { ...prev };
        (newState[componentKey] as any) = newValue;

        // If 'category' is rerolled, all name parts might need rerolling if unlocked
        if (componentKey === 'category') {
          if (!lockedComponents['maleName']) newState.maleName = generateSingleComponent('maleName');
          if (!lockedComponents['femaleName']) newState.femaleName = generateSingleComponent('femaleName');
          if (!lockedComponents['surname']) newState.surname = generateSingleComponent('surname');
        }
        return newState;
      });
    },
    [generated, generateSingleComponent, setGenerated, lockedComponents]
  );

  const handleCopyName = useCallback(() => {
    if (!generated) return;

    let text = `Character Names (${generated.category})\n\n`;
    text += `Male: ${generated.maleName} ${generated.surname}\n`;
    text += `Female: ${generated.femaleName} ${generated.surname}\n`;

    if (includeTitle && generated.title) {
      text += `\nTitle Suggestion: ${generated.title}\n`;
    }

    copyToClipboard(text.trim());
  }, [generated, includeTitle, copyToClipboard]);

  return (
    <GeneratorLayout
      title="Character Names Generator"
      description="Generate authentic character names from various cultures and styles"
    >
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
              <label
                className="block text-sm font-medium text-moss-200 mb-2"
                htmlFor="nameCategorySelect"
              >
                Name Category
              </label>
              <select
                id="nameCategorySelect"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as NameCategory)}
                className="w-full p-2 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
                aria-label="Select name category"
              >
                {nameData.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Include Title Checkbox */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer text-moss-200 hover:text-moss-100 transition-colors">
                <input
                  type="checkbox"
                  checked={includeTitle}
                  onChange={(e) => setIncludeTitle(e.target.checked)}
                  className="w-4 h-4 rounded bg-moss-800 border-moss-600 focus:ring-moss-500"
                  aria-label="Include title or epithet"
                />
                <span>Include Title / Epithet</span>
              </label>
            </div>

            <button
              onClick={() => generateName(false)}
              className="btn-primary w-full text-lg py-3 transition-transform transform hover:scale-105"
              aria-label="Generate character names"
            >
              {generated ? 'Generate / Reroll Unlocked' : 'Generate Name'}
            </button>
          </div>

          {/* Generated Name Display */}
          {generated && (
            <div className="card p-8 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <p className="text-lg italic text-moss-300 mb-4">
                Category: {generated.category}
              </p>

              <ComponentWithControls
                label="Male"
                content={generated.maleName}
                componentKey="maleName"
                isLocked={!!lockedComponents.maleName}
                onToggleLock={toggleLock}
                onReroll={rerollComponent}
              />
              <ComponentWithControls
                label="Female"
                content={generated.femaleName}
                componentKey="femaleName"
                isLocked={!!lockedComponents.femaleName}
                onToggleLock={toggleLock}
                onReroll={rerollComponent}
              />
              <ComponentWithControls
                label="Surname"
                content={generated.surname}
                componentKey="surname"
                isLocked={!!lockedComponents.surname}
                onToggleLock={toggleLock}
                onReroll={rerollComponent}
              />

              {includeTitle && generated.title && (
                <>
                  <hr className="border-moss-600 my-4" />
                  <ComponentWithControls
                    label="Title"
                    content={generated.title}
                    componentKey="title"
                    isLocked={!!lockedComponents.title}
                    onToggleLock={toggleLock}
                    onReroll={rerollComponent}
                  />
                </>
              )}

              <button
                onClick={handleCopyName}
                className="btn-secondary w-full mt-6"
                aria-label="Copy names to clipboard"
              >
                📋 Copy to Clipboard
              </button>
            </div>
          )}

          {!generated && (
            <div className="card p-8 text-center text-moss-400 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
              <p>Select your options and click "Generate Name" to begin</p>
            </div>
          )}
        </div>

        {/* Right Column: Data Editor & Tips */}
        <div className="space-y-6">
          <DataEditorCard
            showEditor={showEditor}
            onToggleEditor={() => setShowEditor(!showEditor)}
            jsonInput={jsonInput}
            onJsonChange={setJsonInput}
            onSave={saveData}
            onReset={resetData}
            saveStatus={saveStatus}
            editorInstructions="Edit the JSON below to add new categories (e.g., 'Gnome', 'Dragonborn') or add to existing name lists. Your changes are saved locally to your browser."
            dataStructureDescription={
              <ul className="space-y-1 text-sm list-disc list-inside ml-4">
                <li>
                  <strong className="text-moss-100">Categories:</strong> (Dwarf, Elf, Human, etc.)
                </li>
                <li>
                  <strong className="text-moss-100">Names:</strong> Male, Female, and Surname lists for each category.
                </li>
                <li>
                  <strong className="text-moss-100">Titles:</strong> A general list of epithets that can be added to any name.
                </li>
              </ul>
            }
          />

          <TipsCard
            title="Tips for Great Names"
            tips={[
              '<strong class="text-moss-100">Lock (🔒):</strong> Find a surname you like? Lock it and reroll the first names.',
              'This generator provides a male and female name for each surname to give you options.',
              'Use the <strong class="text-moss-100">Editor</strong> to add name lists that fit your specific setting or campaign.',
              'Use the <strong class="text-moss-100">Title</strong> checkbox to add extra flavour for important NPCs or characters.',
              'Combine names from different categories (e.g., an Elven first name with a Human surname) for unique backstories.',
            ]}
          />
        </div>
      </div>
    </GeneratorLayout>
  );
}
