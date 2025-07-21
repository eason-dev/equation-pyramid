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
  // Simple tiles designed for exactly 3 clear valid equations
  const tiles: Tile[] = [
    { label: "A", number: 1, operator: "+" },
    { label: "B", number: 2, operator: "+" },
    { label: "C", number: 3, operator: "+" },
    { label: "D", number: 4, operator: "+" },
    { label: "E", number: 1, operator: "+" },
    { label: "F", number: 1, operator: "+" },
    { label: "G", number: 3, operator: "*" },
    { label: "H", number: 2, operator: "*" },
    { label: "I", number: 2, operator: "-" },
    { label: "J", number: 5, operator: "+" },
  ];

  const targetNumber = 6;

  // Hand-picked exactly 3 non-overlapping valid equations for clarity
  const validEquations: Tile[][] = [
    // Equation 1: A(1) + B(+2) + C(+3) = 1 + 2 + 3 = 6
    [tiles[0], tiles[1], tiles[2]], // A, B, C
    // Equation 2: D(4) + E(+1) + F(+1) = 4 + 1 + 1 = 6  
    [tiles[3], tiles[4], tiles[5]], // D, E, F
    // Equation 3: G(3) + H(*2) + I(-2) = 3 + 3*2 - 2 = 3 + 6 - 2 = 7 ≠ 6, let me fix this
    // Equation 3: J(5) + H(*2) + I(-2) = 5 + 5*2 - 2 = 5 + 10 - 2 = 13 ≠ 6, wrong again
    // Equation 3: G(3) + J(+5) + I(-2) = 3 + 5 - 2 = 6 ✓
    [tiles[6], tiles[9], tiles[8]], // G, J, I
  ];

  // Verify all equations are valid
  for (let i = validEquations.length - 1; i >= 0; i--) {
    const result = calculateTutorialEquation(validEquations[i]);
    if (result !== targetNumber) {
      console.warn(`Invalid equation at index ${i}:`, validEquations[i], `result: ${result}`);
      validEquations.splice(i, 1);
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
