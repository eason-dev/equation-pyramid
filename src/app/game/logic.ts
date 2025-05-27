import type { Tile, Equation, Operator, GameState } from './types';

const OPERATORS: Operator[] = ['+', '-', '*', '/'];

export function generateRandomTile(): Tile {
  const operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)]; // +, -, *, /
  const number = Math.floor(Math.random() * 20) + 1; // 1-20
  return { operator, number };
}

export function generateTiles(count: number): Tile[] {
  return Array.from({ length: count }, generateRandomTile);
}

export function calculateEquation(tiles: [Tile, Tile, Tile]): number {
  const [first, second, third] = tiles;
  
  // First operation: second.operator(second.number)
  let result = first.number;
  
  // Handle multiplication and division first
  if (second.operator === '*' || second.operator === '/') {
    switch (second.operator) {
      case '*': result *= second.number; break;
      case '/': {
        // Check if division results in integer
        if (result % second.number !== 0) return -1;
        result = result / second.number;
        break;
      }
    }
    
    // Then handle the third operator
    switch (third.operator) {
      case '+': result += third.number; break;
      case '-': result -= third.number; break;
      case '*': result *= third.number; break;
      case '/': {
        // Check if division results in integer
        if (result % third.number !== 0) return -1;
        result = result / third.number;
        break;
      }
    }
  } else {
    // If second operator is + or -, we need to check third operator first
    if (third.operator === '*' || third.operator === '/') {
      // Calculate third operation first
      let tempResult = second.number;
      switch (third.operator) {
        case '*': tempResult *= third.number; break;
        case '/': {
          // Check if division results in integer
          if (tempResult % third.number !== 0) return -1;
          tempResult = tempResult / third.number;
          break;
        }
      }
      
      // Then apply second operation
      switch (second.operator) {
        case '+': result += tempResult; break;
        case '-': result -= tempResult; break;
      }
    } else {
      // Both operators are + or -, proceed left to right
      switch (second.operator) {
        case '+': result += second.number; break;
        case '-': result -= second.number; break;
      }
      
      switch (third.operator) {
        case '+': result += third.number; break;
        case '-': result -= third.number; break;
      }
    }
  }
  
  // Check if final result is valid
  if (result <= 0 || !Number.isInteger(result)) {
    return -1;
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
        
        const equationTiles: [Tile, Tile, Tile] = [tiles[i], tiles[j], tiles[k]];
        const result = calculateEquation(equationTiles);
        
        equations.push({
          tiles: equationTiles,
          result
        });
      }
    }
  }
  
  return equations;
}

export function generateGameState(): GameState {
  const tiles = generateTiles(10);
  const equations = generateAllEquations(tiles);
  
  // Pick a random equation's result as the target
  const targetEquation = equations[Math.floor(Math.random() * equations.length)];
  const targetNumber = targetEquation.result;
  
  // Find all equations that result in the target number
  const validEquations = equations.filter(eq => eq.result === targetNumber);
  
  return {
    tiles,
    targetNumber,
    validEquations
  };
} 