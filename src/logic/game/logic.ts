import type { Tile, Equation, Operator, GameState } from "@/logic/game/types";

const OPERATORS: Operator[] = ["+", "-", "*", "/"];
const INVALID_RESULT = -1;
const MAX_DIVIDE_TILES = 2;
const MAX_MULTIPLY_TILES = 2;
const MIN_VALID_EQUATIONS = 2;
const MAX_VALID_EQUATIONS = 5;

export function generateRandomTile(label: string): Tile {
  const operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)]; // +, -, *, /
  const number = Math.floor(Math.random() * 20) + 1; // 1-20
  return { operator, number, label };
}

export function generateTiles(count: number): Tile[] {
  return Array.from({ length: count }, (_, index) => {
    const label = String.fromCharCode(65 + index); // A, B, C, D, E, F, G, H, I, J
    return generateRandomTile(label);
  });
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

export function generateAllEquations(tiles: Tile[]): Equation[] {
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

        equations.push({
          tiles: equationTiles,
          result,
        });
      }
    }
  }

  return equations;
}

export function generateGameState(): GameState {
  let tiles: Tile[];
  let validEquations: Equation[];
  let isValidState = false;

  do {
    tiles = generateTiles(10);
    const equations = generateAllEquations(tiles);

    // Filter out invalid equations and those with results outside 1-20 range
    validEquations = equations.filter(
      (eq) => eq.result !== INVALID_RESULT && eq.result >= 1 && eq.result <= 20,
    );

    // Check if we have too many divide or multiply tiles
    const divideCount = tiles.filter((tile) => tile.operator === "/").length;
    const multiplyCount = tiles.filter((tile) => tile.operator === "*").length;

    // If we have valid equations within the desired range and the operator counts are within limits, break the loop
    isValidState =
      validEquations.length >= MIN_VALID_EQUATIONS &&
      validEquations.length <= MAX_VALID_EQUATIONS &&
      divideCount <= MAX_DIVIDE_TILES &&
      multiplyCount <= MAX_MULTIPLY_TILES;
  } while (!isValidState);

  // Pick a random equation's result as the target
  const targetEquation =
    validEquations[Math.floor(Math.random() * validEquations.length)];
  const targetNumber = targetEquation.result;

  // Find all equations that result in the target number
  const targetEquations = validEquations.filter(
    (eq) => eq.result === targetNumber,
  );

  return {
    tiles,
    targetNumber,
    validEquations: targetEquations,
  };
}
