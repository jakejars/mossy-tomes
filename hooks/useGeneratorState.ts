import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for managing generator state with lock/unlock and localStorage persistence
 *
 * @template TData - The type of the data source (e.g., NameGenData, ShopGenData)
 * @template TGenerated - The type of the generated content (e.g., GeneratedName, GeneratedShop)
 * @template TLocked - The type for locked components (e.g., NameLockedComponents)
 */
export function useGeneratorState<
  TData extends object,
  TGenerated extends object,
  TLocked extends Record<string, boolean>
>(
  defaultData: TData,
  storageKey: string,
  validateData: (data: any) => boolean
) {
  const [data, setData] = useState<TData>(defaultData);
  const [generated, setGenerated] = useState<TGenerated | null>(null);
  const [lockedComponents, setLockedComponents] = useState<TLocked>({} as TLocked);
  const [showEditor, setShowEditor] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (validateData(parsed)) {
          setData(parsed);
          setJsonInput(JSON.stringify(parsed, null, 2));
        } else {
          console.warn(`Saved data structure mismatch for ${storageKey}, resetting.`);
          resetToDefaultData();
        }
      } catch (e) {
        console.error(`Failed to load or parse saved data for ${storageKey}:`, e);
        resetToDefaultData();
      }
    } else {
      setJsonInput(JSON.stringify(defaultData, null, 2));
    }
  }, [storageKey, defaultData]);

  const resetToDefaultData = useCallback(() => {
    setData(defaultData);
    setJsonInput(JSON.stringify(defaultData, null, 2));
    localStorage.removeItem(storageKey);
  }, [defaultData, storageKey]);

  const saveData = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (validateData(parsed)) {
        setData(parsed);
        localStorage.setItem(storageKey, jsonInput);
        setSaveStatus('✓ Data saved successfully!');
      } else {
        throw new Error('Invalid data structure: Missing required keys/arrays/objects.');
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      console.error('Save Error:', e);
      const errorMessage = e instanceof Error ? e.message : 'Invalid JSON format';
      setSaveStatus(`✗ Error: ${errorMessage}`);
      setTimeout(() => setSaveStatus(''), 5000);
    }
  }, [jsonInput, validateData, storageKey]);

  const resetData = useCallback(() => {
    if (confirm('Reset all data to defaults? Your customizations will be lost.')) {
      resetToDefaultData();
      setLockedComponents({} as TLocked);
      setSaveStatus('↻ Reset to defaults');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [resetToDefaultData]);

  const toggleLock = useCallback((componentKey: keyof TGenerated) => {
    setLockedComponents((prev) => ({
      ...prev,
      [componentKey]: !prev[componentKey as keyof TLocked],
    }));
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setSaveStatus('✓ Copied to clipboard!');
    setTimeout(() => setSaveStatus(''), 2000);
  }, []);

  return {
    data,
    generated,
    setGenerated,
    lockedComponents,
    setLockedComponents,
    showEditor,
    setShowEditor,
    jsonInput,
    setJsonInput,
    saveStatus,
    setSaveStatus,
    saveData,
    resetData,
    toggleLock,
    copyToClipboard,
    resetToDefaultData,
  };
}
