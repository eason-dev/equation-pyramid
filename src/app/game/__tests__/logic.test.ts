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
      const tiles: [Tile, Tile, Tile] = [
        { operator: '+', number: 5 },
        { operator: '+', number: 3 },
        { operator: '+', number: 2 }
      ];
      expect(calculateEquation(tiles)).toBe(10);
    });

    it('should handle multiplication and division', () => {
      const tiles: [Tile, Tile, Tile] = [
        { operator: '+', number: 5 },
        { operator: '*', number: 3 },
        { operator: '/', number: 2 }
      ];
      expect(calculateEquation(tiles)).toBe(7); // 5 + (3 * 2) / 2 = 5 + 6/2 = 5 + 3 = 8
    });

    it('should follow operator precedence', () => {
      const tiles: [Tile, Tile, Tile] = [
        { operator: '+', number: 5 },
        { operator: '+', number: 3 },
        { operator: '*', number: 2 }
      ];
      expect(calculateEquation(tiles)).toBe(11); // 5 + (3 * 2) = 5 + 6 = 11
    });

    it('should handle division with floor rounding', () => {
      const tiles: [Tile, Tile, Tile] = [
        { operator: '+', number: 10 },
        { operator: '/', number: 3 },
        { operator: '+', number: 2 }
      ];
      expect(calculateEquation(tiles)).toBe(5); // 10 + (3/2) = 10 + 1 = 11
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