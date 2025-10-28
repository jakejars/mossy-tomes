'use client';

interface ComponentWithControlsProps<T extends string> {
  label: string;
  content: string | number;
  componentKey: T;
  isLocked: boolean;
  onToggleLock: (key: T) => void;
  onReroll: (key: T) => void;
  hideControls?: boolean;
}

/**
 * Reusable component for displaying generated content with lock/reroll controls
 *
 * Features:
 * - Hover to reveal controls
 * - Lock/unlock individual components
 * - Reroll individual components
 * - Accessibility with aria-labels
 */
export function ComponentWithControls<T extends string>({
  label,
  content,
  componentKey,
  isLocked,
  onToggleLock,
  onReroll,
  hideControls = false,
}: ComponentWithControlsProps<T>) {
  // Don't render if content is empty
  if (!content) return null;

  return (
    <div className="relative group mb-3 pr-20 text-lg text-moss-200">
      <p>
        <strong className="text-moss-100">{label}:</strong> {content}
      </p>

      {!hideControls && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onToggleLock(componentKey)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs ${
              isLocked
                ? 'bg-moss-600 text-white border-moss-700 hover:bg-moss-500'
                : 'bg-moss-800/30 text-moss-400 border-moss-700/30 hover:bg-moss-700 hover:text-white'
            } border`}
            title={isLocked ? 'Unlock' : 'Lock'}
            aria-label={`${isLocked ? 'Unlock' : 'Lock'} ${label}`}
          >
            {isLocked ? '🔒' : '🔓'}
          </button>
          <button
            onClick={() => onReroll(componentKey)}
            className="w-7 h-7 rounded-full bg-moss-800/30 text-moss-400 border border-moss-700/30 flex items-center justify-center hover:bg-moss-700 hover:text-white transition-all text-xs"
            title={`Reroll ${label}`}
            aria-label={`Reroll ${label}`}
          >
            ↻
          </button>
        </div>
      )}
    </div>
  );
}
