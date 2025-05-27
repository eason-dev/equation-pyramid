import { generateRandomTile, generateTiles, calculateEquation, generateAllEquations, generateGameState } from '../logic';
import type { Tile } from '../types';

describe('Game Logic', () => {
  describe('generateRandomTile', () => {
    it('should generate a tile with valid operator and number', () => {
      const tile = generateRandomTile();
      
      expect(tile).toHaveProperty('operator');
      expect(tile).toHaveProperty('number');
      expect(['+', '-', '*', '/']).toContain(tile.operator);
      expect(tile.number).toBeGreaterThanOrEqual(1);
      expect(tile.number).toBeLessThanOrEqual(20);
    });
  });

  describe('generateTiles', () => {
    it('should generate the correct number of tiles', () => {
      const count = 10;
      const tiles = generateTiles(count);
      
      expect(tiles).toHaveLength(count);
      for (const tile of tiles) {
        expect(tile).toHaveProperty('operator');
        expect(tile).toHaveProperty('number');
      }
    });
  });

  describe('calculateEquation', () => {
    it('should handle addition and subtraction', () => {
      // Test case 1: All additions
      const tiles1: [Tile, Tile, Tile] = [
        { operator: '+', number: 5 },
        { operator: '+', number: 3 },
        { operator: '+', number: 2 }
      ];
      expect(calculateEquation(tiles1)).toBe(10);

      // Test case 2: Mixed addition and subtraction
      const tiles2: [Tile, Tile, Tile] = [
        { operator: '+', number: 10 },
        { operator: '-', number: 3 },
        { operator: '+', number: 5 }
      ];
      expect(calculateEquation(tiles2)).toBe(12);

      // Test case 3: All subtractions
      const tiles3: [Tile, Tile, Tile] = [
        { operator: '+', number: 20 },
        { operator: '-', number: 8 },
        { operator: '-', number: 4 }
      ];
      expect(calculateEquation(tiles3)).toBe(8);

      // Test case 4: Large numbers
      const tiles4: [Tile, Tile, Tile] = [
        { operator: '+', number: 100 },
        { operator: '-', number: 30 },
        { operator: '+', number: 15 }
      ];
      expect(calculateEquation(tiles4)).toBe(85);

      // Test case 5: Small numbers with negative result (should return -1)
      const tiles5: [Tile, Tile, Tile] = [
        { operator: '+', number: 5 },
        { operator: '-', number: 8 },
        { operator: '-', number: 4 }
      ];
      expect(calculateEquation(tiles5)).toBe(-1);

      // Test case 6: Start with a subtraction, subtraction is omitted
      const tiles6: [Tile, Tile, Tile] = [
        { operator: '-', number: 5 },
        { operator: '+', number: 3 },
        { operator: '+', number: 2 }
      ];
      expect(calculateEquation(tiles6)).toBe(10);
    });

    it('should handle multiplication and division', () => {
      // Test case 1: Simple multiplication
      const tiles1: [Tile, Tile, Tile] = [
        { operator: '+', number: 5 },
        { operator: '*', number: 3 },
        { operator: '+', number: 2 }
      ];
      expect(calculateEquation(tiles1)).toBe(17);

      // Test case 2: Valid division
      const tiles2: [Tile, Tile, Tile] = [
        { operator: '+', number: 10 },
        { operator: '/', number: 2 },
        { operator: '+', number: 3 }
      ];
      expect(calculateEquation(tiles2)).toBe(8);

      // Test case 3: Invalid division (non-integer result)
      const tiles3: [Tile, Tile, Tile] = [
        { operator: '+', number: 10 },
        { operator: '/', number: 3 },
        { operator: '+', number: 2 }
      ];
      expect(calculateEquation(tiles3)).toBe(-1);

      // Test case 4: Division by larger number (result < 1)
      const tiles4: [Tile, Tile, Tile] = [
        { operator: '+', number: 5 },
        { operator: '/', number: 10 },
        { operator: '+', number: 2 }
      ];
      expect(calculateEquation(tiles4)).toBe(-1);

      // Test case 5: Multiple divisions with non-integer intermediate result
      const tiles5: [Tile, Tile, Tile] = [
        { operator: '+', number: 20 },
        { operator: '/', number: 2 },
        { operator: '/', number: 3 }
      ];
      expect(calculateEquation(tiles5)).toBe(-1);
    });

    it('should handle operator precedence', () => {
      // Test case 1: Multiplication before addition
      const tiles1: [Tile, Tile, Tile] = [
        { operator: '+', number: 5 },
        { operator: '+', number: 3 },
        { operator: '*', number: 2 }
      ];
      expect(calculateEquation(tiles1)).toBe(11);

      // Test case 2: Division before subtraction
      const tiles2: [Tile, Tile, Tile] = [
        { operator: '+', number: 20 },
        { operator: '/', number: 4 },
        { operator: '-', number: 2 }
      ];
      expect(calculateEquation(tiles2)).toBe(3);

      // Test case 3: Complex precedence with invalid division
      const tiles3: [Tile, Tile, Tile] = [
        { operator: '+', number: 15 },
        { operator: '/', number: 2 },
        { operator: '*', number: 3 }
      ];
      expect(calculateEquation(tiles3)).toBe(-1);
    });

    it('should return -1 if the result is not an integer', () => {
      const tiles: [Tile, Tile, Tile] = [
        { operator: '+', number: 10 },
        { operator: '/', number: 3 },
        { operator: '+', number: 2 }
      ];
      expect(calculateEquation(tiles)).toBe(-1);
    });
  });

  describe('generateAllEquations', () => {
    it('should generate all possible combinations of 3 tiles', () => {
      const tiles = generateTiles(4); // Using 4 tiles for easier testing
      const equations = generateAllEquations(tiles);
      
      // For 4 tiles, we should get 4P3 = 24 combinations
      expect(equations).toHaveLength(24);
      
      for (const equation of equations) {
        expect(equation).toHaveProperty('tiles');
        expect(equation).toHaveProperty('result');
        expect(equation.tiles).toHaveLength(3);
      }
    });
  });

  describe('generateGameState', () => {
    it('should generate a valid game state', () => {
      const gameState = generateGameState();
      
      expect(gameState).toHaveProperty('tiles');
      expect(gameState).toHaveProperty('targetNumber');
      expect(gameState).toHaveProperty('validEquations');
      
      expect(gameState.tiles).toHaveLength(10);
      expect(gameState.validEquations.length).toBeGreaterThan(0);
      
      // Verify that all valid equations result in the target number
      for (const equation of gameState.validEquations) {
        expect(equation.result).toBe(gameState.targetNumber);
      }
    });
  });
}); 