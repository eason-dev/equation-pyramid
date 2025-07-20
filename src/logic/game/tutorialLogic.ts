import { INVALID_RESULT } from "@/constants";
import { calculateEquation, calculateEquationRaw } from "./logic";
import type { Tile } from "./types";

/**
 * Calculate raw mathematical result for tutorial (shows actual math result, not game-valid result)
 */
export function calculateTutorialEquationRaw(tiles: Tile[]): number | null {
  if (tiles.length !== 3) return null;
  return calculateEquationRaw(tiles as [Tile, Tile, Tile]);
}

/**
 * Calculate equation result for tutorial - reuses main game logic
 */
export function calculateTutorialEquation(tiles: Tile[]): number | null {
  if (tiles.length !== 3) return null;

  const result = calculateEquation(tiles as [Tile, Tile, Tile]);
  return result === INVALID_RESULT ? null : result;
}

/**
 * Generate static tiles for the tutorial with good variety
 * Includes addition, subtraction, multiplication, and division
 */
export function generateTutorialTiles(): {
  tiles: Tile[];
  targetNumber: number;
  validEquations: Tile[][];
} {
  // Static tiles with variety - all numbers < 10, includes all operators
  const tiles: Tile[] = [
    { label: "A", number: 2, operator: "+" },
    { label: "B", number: 3, operator: "+" },
    { label: "C", number: 4, operator: "+" },
    { label: "D", number: 1, operator: "+" },
    { label: "E", number: 5, operator: "-" },
    { label: "F", number: 2, operator: "*" },
    { label: "G", number: 3, operator: "*" },
    { label: "H", number: 2, operator: "-" },
    { label: "I", number: 6, operator: "/" },
    { label: "J", number: 1, operator: "-" },
  ];

  const targetNumber = 6;

  // Pre-calculate some valid equations for hints
  const validEquations: Tile[][] = [];

  // Find all valid 3-tile combinations that equal 6
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles.length; j++) {
      for (let k = 0; k < tiles.length; k++) {
        if (i !== j && j !== k && i !== k) {
          // All different tiles
          const testTiles = [tiles[i], tiles[j], tiles[k]];
          const result = calculateTutorialEquation(testTiles);
          if (result === targetNumber) {
            validEquations.push([...testTiles]);

            // Only keep first 4 valid equations for hints
            if (validEquations.length >= 4) {
              return {
                tiles,
                targetNumber,
                validEquations,
              };
            }
          }
        }
      }
    }
  }

  return {
    tiles,
    targetNumber,
    validEquations,
  };
}

/**
 * Check if a set of tiles forms a valid equation for the target
 */
export function isValidTutorialEquation(
  tiles: Tile[],
  targetNumber: number,
): boolean {
  if (tiles.length !== 3) return false;

  const result = calculateTutorialEquation(tiles);
  return result === targetNumber;
}

/**
 * Get a random valid equation for hint purposes
 */
export function getRandomValidEquation(
  validEquations: Tile[][],
): Tile[] | null {
  if (validEquations.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * validEquations.length);
  return validEquations[randomIndex];
}
