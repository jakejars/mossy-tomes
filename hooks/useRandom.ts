import { useCallback } from 'react';

/**
 * Hook providing type-safe random selection utilities
 */
export function useRandom() {
  /**
   * Get a random element from an array with type safety
   */
  const getRandom = useCallback(<T>(arr: T[]): T | undefined => {
    if (!arr || arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
  }, []);

  /**
   * Roll dice using standard RPG notation (e.g., "2d6+3", "1d20", "3d8*10")
   */
  const rollDice = useCallback((diceExpression: string): number => {
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

    return Math.max(0, Math.floor(((total + modifier) * multiplier) / divisor));
  }, []);

  /**
   * Roll a standard d100 (percentile dice)
   */
  const rollPercentile = useCallback((): number => {
    return Math.floor(Math.random() * 100) + 1;
  }, []);

  /**
   * Get a random integer between min and max (inclusive)
   */
  const randomInt = useCallback((min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);

  return {
    getRandom,
    rollDice,
    rollPercentile,
    randomInt,
  };
}
