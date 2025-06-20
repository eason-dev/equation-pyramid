import type { Tile, Equation, GameState } from "@/logic/game/types";
import {
  OPERATORS,
  INVALID_RESULT,
  MAX_DIVIDE_TILES,
  MAX_MULTIPLY_TILES,
  MIN_VALID_EQUATIONS,
  MAX_VALID_EQUATIONS,
  MAX_TILE_NUMBER,
  MAX_BIG_NUMBER_TILES,
  BIG_NUMBER_THRESHOLD,
} from "@/constants";

/**
 * Generate tiles with human-friendly constraints
 * - Max 2 multiply tiles
 * - Max 2 divide tiles
 * - Max 3 tiles with numbers >= 10
 */
function generateConstrainedTiles(): Tile[] {
  const tiles: Tile[] = [];
  let multiplyCount = 0;
  let divideCount = 0;
  let bigNumberCount = 0;

  for (let i = 0; i < 10; i++) {
    const label = String.fromCharCode(65 + i); // A, B, C, D, etc.
    let tile: Tile;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      // Generate a random tile
      const operatorIndex = Math.floor(Math.random() * OPERATORS.length);
      const operator = OPERATORS[operatorIndex];

      // Prefer smaller numbers to make calculation easier
      let number: number;
      if (bigNumberCount >= MAX_BIG_NUMBER_TILES) {
        // Force small number if we've hit the big number limit
        number = Math.floor(Math.random() * (BIG_NUMBER_THRESHOLD - 1)) + 1; // 1-9
      } else {
        // Bias towards smaller numbers (70% chance for 1-9, 30% for 10-20)
        if (Math.random() < 0.7) {
          number = Math.floor(Math.random() * (BIG_NUMBER_THRESHOLD - 1)) + 1; // 1-9
        } else {
          number =
            Math.floor(
              Math.random() * (MAX_TILE_NUMBER - BIG_NUMBER_THRESHOLD + 1),
            ) + BIG_NUMBER_THRESHOLD; // 10-20
        }
      }

      tile = { operator, number, label };
      attempts++;

      // Check if this tile violates constraints
      const wouldExceedMultiply =
        operator === "*" && multiplyCount >= MAX_MULTIPLY_TILES;
      const wouldExceedDivide =
        operator === "/" && divideCount >= MAX_DIVIDE_TILES;
      const wouldExceedBigNumber =
        number >= BIG_NUMBER_THRESHOLD &&
        bigNumberCount >= MAX_BIG_NUMBER_TILES;

      if (!wouldExceedMultiply && !wouldExceedDivide && !wouldExceedBigNumber) {
        // Valid tile, update counters
        if (operator === "*") multiplyCount++;
        if (operator === "/") divideCount++;
        if (number >= BIG_NUMBER_THRESHOLD) bigNumberCount++;
        break;
      }

      // If we've tried too many times, force a valid tile
      if (attempts >= maxAttempts) {
        // Generate a safe tile (+ or - with small number)
        const safeOperator = Math.random() < 0.5 ? "+" : "-";
        const safeNumber =
          Math.floor(Math.random() * (BIG_NUMBER_THRESHOLD - 1)) + 1;
        tile = { operator: safeOperator, number: safeNumber, label };
        break;
      }
    } while (attempts < maxAttempts);

    tiles.push(tile);
  }

  return tiles;
}

export function calculateEquation(tiles: [Tile, Tile, Tile]): number {
  const [first, second, third] = tiles;

  // First operation: second.operator(second.number)
  let result = first.number;

  // Handle multiplication and division first
  if (second.operator === "*" || second.operator === "/") {
    switch (second.operator) {
      case "*":
        result *= second.number;
        break;
      case "/": {
        // Check if division results in integer
        if (result % second.number !== 0) return INVALID_RESULT;
        result = result / second.number;
        break;
      }
    }

    // Then handle the third operator
    switch (third.operator) {
      case "+":
        result += third.number;
        break;
      case "-":
        result -= third.number;
        break;
      case "*":
        result *= third.number;
        break;
      case "/": {
        // Check if division results in integer
        if (result % third.number !== 0) return INVALID_RESULT;
        result = result / third.number;
        break;
      }
    }
  } else {
    // If second operator is + or -, we need to check third operator first
    if (third.operator === "*" || third.operator === "/") {
      // Calculate third operation first
      let tempResult = second.number;
      switch (third.operator) {
        case "*":
          tempResult *= third.number;
          break;
        case "/": {
          // Check if division results in integer
          if (tempResult % third.number !== 0) return INVALID_RESULT;
          tempResult = tempResult / third.number;
          break;
        }
      }

      // Then apply second operation
      switch (second.operator) {
        case "+":
          result += tempResult;
          break;
        case "-":
          result -= tempResult;
          break;
      }
    } else {
      // Both operators are + or -, proceed left to right
      switch (second.operator) {
        case "+":
          result += second.number;
          break;
        case "-":
          result -= second.number;
          break;
      }

      switch (third.operator) {
        case "+":
          result += third.number;
          break;
        case "-":
          result -= third.number;
          break;
      }
    }
  }

  // Check if final result is valid
  if (result <= 0 || !Number.isInteger(result)) {
    return INVALID_RESULT;
  }

  return result;
}

/**
 * Generate valid equations only (optimized for game state generation)
 */
function generateValidEquations(tiles: Tile[]): Equation[] {
  const equations: Equation[] = [];

  // Generate all possible combinations of 3 tiles
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles.length; j++) {
      if (j === i) continue;
      for (let k = 0; k < tiles.length; k++) {
        if (k === i || k === j) continue;

        const equationTiles: [Tile, Tile, Tile] = [
          tiles[i],
          tiles[j],
          tiles[k],
        ];
        const result = calculateEquation(equationTiles);

        // Only add valid equations with results in reasonable range
        if (result !== INVALID_RESULT && result >= 1 && result <= 20) {
          equations.push({
            tiles: equationTiles,
            result,
          });
        }
      }
    }
  }

  return equations;
}

/**
 * Improved game state generation with better time complexity
 * 1. Generate constrained tiles first
 * 2. Calculate only valid equations
 * 3. Use frequency counting to find the best target
 */
export function generateGameState(): GameState {
  let attempts = 0;
  const maxAttempts = 10; // Reduced max attempts since we're more strategic

  do {
    attempts++;

    // Step 1: Generate constrained tiles
    const tiles = generateConstrainedTiles();

    // Step 2: Calculate all valid equations
    const validEquations = generateValidEquations(tiles);

    // Check if we have enough valid equations
    if (validEquations.length < MIN_VALID_EQUATIONS) {
      if (attempts >= maxAttempts) {
        // Continue with what we have if we've tried enough times
        break;
      }
      continue;
    }

    // Step 3: Count frequency of each result using Map
    const resultFrequency = new Map<number, Equation[]>();

    for (const equation of validEquations) {
      if (!resultFrequency.has(equation.result)) {
        resultFrequency.set(equation.result, []);
      }
      const equations = resultFrequency.get(equation.result);
      if (equations) {
        equations.push(equation);
      }
    }

    // Step 4: Find the result that appears most frequently
    let bestTarget = -1;
    let maxFrequency = 0;
    let bestEquations: Equation[] = [];

    for (const [result, equations] of resultFrequency.entries()) {
      const frequency = equations.length;
      // Prefer results with 2-4 equations (not too few, not too many)
      if (
        frequency >= MIN_VALID_EQUATIONS &&
        frequency <= MAX_VALID_EQUATIONS &&
        frequency > maxFrequency
      ) {
        maxFrequency = frequency;
        bestTarget = result;
        bestEquations = equations;
      }
    }

    // If we found a good target, return the game state
    if (bestTarget !== -1 && bestEquations.length >= MIN_VALID_EQUATIONS) {
      return {
        tiles,
        targetNumber: bestTarget,
        validEquations: bestEquations,
      };
    }

    // If no ideal target found but we have valid equations, pick any valid target
    if (validEquations.length >= MIN_VALID_EQUATIONS) {
      // Group by result and pick the first one with adequate frequency
      for (const [result, equations] of resultFrequency.entries()) {
        if (
          equations.length >= MIN_VALID_EQUATIONS &&
          equations.length <= MAX_VALID_EQUATIONS
        ) {
          return {
            tiles,
            targetNumber: result,
            validEquations: equations,
          };
        }
      }
    }
  } while (attempts < maxAttempts);

  // If we still couldn't generate a valid state, return the best we have
  const tiles = generateConstrainedTiles();
  const validEquations = generateValidEquations(tiles);

  if (validEquations.length > 0) {
    // Pick the first valid equation's result as target
    const targetEquation = validEquations[0];
    const targetNumber = targetEquation.result;
    const targetEquations = validEquations.filter(
      (eq) => eq.result === targetNumber,
    );

    return {
      tiles,
      targetNumber,
      validEquations: targetEquations,
    };
  }

  // Last resort: return with empty equations (should be very rare)
  return {
    tiles,
    targetNumber: 1,
    validEquations: [],
  };
}
