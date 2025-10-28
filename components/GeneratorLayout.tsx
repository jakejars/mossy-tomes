'use client';

import { ReactNode } from 'react';

interface GeneratorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * Shared layout wrapper for all generator pages
 *
 * Provides consistent styling and structure across generators
 */
export function GeneratorLayout({ title, description, children }: GeneratorLayoutProps) {
  return (
    <main className="min-h-screen py-20 px-6 text-moss-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-moss-50">
            {title}
          </h1>
          <p className="text-lg text-moss-200">{description}</p>
        </div>

        {/* Generator Content */}
        {children}
      </div>
    </main>
  );
}

interface DataEditorCardProps {
  showEditor: boolean;
  onToggleEditor: () => void;
  jsonInput: string;
  onJsonChange: (value: string) => void;
  onSave: () => void;
  onReset: () => void;
  saveStatus: string;
  editorInstructions?: string;
  dataStructureDescription?: ReactNode;
}

/**
 * Reusable data editor card for customizing generator data
 */
export function DataEditorCard({
  showEditor,
  onToggleEditor,
  jsonInput,
  onJsonChange,
  onSave,
  onReset,
  saveStatus,
  editorInstructions = "Edit the JSON below to customize the generator data. Your changes are saved locally to your browser.",
  dataStructureDescription,
}: DataEditorCardProps) {
  return (
    <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-xl font-semibold text-moss-100 border-b border-moss-700 pb-2">
          Customise Data
        </h2>
        <button
          onClick={onToggleEditor}
          className="text-moss-400 hover:text-moss-300 text-sm transition-colors"
          aria-label={showEditor ? 'Hide editor' : 'Show editor'}
        >
          {showEditor ? 'Hide Editor' : 'Show Editor'}
        </button>
      </div>

      {showEditor ? (
        <>
          <p className="text-sm text-moss-400 mb-4 italic">{editorInstructions}</p>
          <textarea
            value={jsonInput}
            onChange={(e) => onJsonChange(e.target.value)}
            className="w-full h-96 p-3 bg-moss-800/50 border border-moss-600 rounded-lg text-moss-100 font-mono text-sm focus:ring-1 focus:ring-moss-400 focus:border-moss-400"
            spellCheck={false}
            aria-label="JSON data editor"
          />
          <div className="flex gap-3 mt-4">
            <button onClick={onSave} className="btn-primary flex-1" aria-label="Save data">
              Save Data
            </button>
            <button onClick={onReset} className="btn-secondary flex-1" aria-label="Reset to default">
              Reset to Default
            </button>
          </div>
          {saveStatus && (
            <p
              className={`text-center mt-3 font-medium text-sm ${
                saveStatus.includes('✓') || saveStatus.includes('↻')
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
              role="status"
              aria-live="polite"
            >
              {saveStatus}
            </p>
          )}
        </>
      ) : (
        <div className="space-y-3 text-moss-300">
          <p>Click "Show Editor" to customise source lists</p>
          {dataStructureDescription}
        </div>
      )}
    </div>
  );
}

interface TipsCardProps {
  title?: string;
  tips: string[];
}

/**
 * Reusable tips card for generator usage hints
 */
export function TipsCard({ title = "Tips & Usage", tips }: TipsCardProps) {
  return (
    <div className="card p-6 bg-moss-900/70 border border-moss-700/50 shadow-lg rounded-xl">
      <h2 className="font-serif text-xl font-semibold mb-3 text-moss-100 border-b border-moss-700 pb-2">
        {title}
      </h2>
      <ul className="space-y-1.5 text-sm text-moss-300 list-disc list-inside ml-4">
        {tips.map((tip, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: tip }} />
        ))}
      </ul>
    </div>
  );
}
