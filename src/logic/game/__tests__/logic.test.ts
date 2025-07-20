import type { Tile } from "@/logic/game/types";

import { calculateEquation, calculateEquationRaw, generateGameState } from "../logic";

const INVALID_RESULT = -1;

describe("Game Logic", () => {
  describe("calculateEquation", () => {
    it("should handle addition and subtraction", () => {
      // Test case 1: All additions
      const tiles1: [Tile, Tile, Tile] = [
        { operator: "+", number: 5, label: "A" },
        { operator: "+", number: 3, label: "B" },
        { operator: "+", number: 2, label: "C" },
      ];
      expect(calculateEquation(tiles1)).toBe(10);

      // Test case 2: Mixed addition and subtraction
      const tiles2: [Tile, Tile, Tile] = [
        { operator: "+", number: 10, label: "A" },
        { operator: "-", number: 3, label: "B" },
        { operator: "+", number: 5, label: "C" },
      ];
      expect(calculateEquation(tiles2)).toBe(12);

      // Test case 3: All subtractions
      const tiles3: [Tile, Tile, Tile] = [
        { operator: "+", number: 20, label: "A" },
        { operator: "-", number: 8, label: "B" },
        { operator: "-", number: 4, label: "C" },
      ];
      expect(calculateEquation(tiles3)).toBe(8);

      // Test case 4: Large numbers
      const tiles4: [Tile, Tile, Tile] = [
        { operator: "+", number: 100, label: "A" },
        { operator: "-", number: 30, label: "B" },
        { operator: "+", number: 15, label: "C" },
      ];
      expect(calculateEquation(tiles4)).toBe(85);

      // Test case 5: Small numbers with negative result (should return -1)
      const tiles5: [Tile, Tile, Tile] = [
        { operator: "+", number: 5, label: "A" },
        { operator: "-", number: 8, label: "B" },
        { operator: "-", number: 4, label: "C" },
      ];
      expect(calculateEquation(tiles5)).toBe(INVALID_RESULT);

      // Test case 6: Start with a subtraction, subtraction is omitted
      const tiles6: [Tile, Tile, Tile] = [
        { operator: "-", number: 5, label: "A" },
        { operator: "+", number: 3, label: "B" },
        { operator: "+", number: 2, label: "C" },
      ];
      expect(calculateEquation(tiles6)).toBe(10);
    });

    it("should handle multiplication and division", () => {
      // Test case 1: Simple multiplication
      const tiles1: [Tile, Tile, Tile] = [
        { operator: "+", number: 5, label: "A" },
        { operator: "*", number: 3, label: "B" },
        { operator: "+", number: 2, label: "C" },
      ];
      expect(calculateEquation(tiles1)).toBe(17);

      // Test case 2: Valid division
      const tiles2: [Tile, Tile, Tile] = [
        { operator: "+", number: 10, label: "A" },
        { operator: "/", number: 2, label: "B" },
        { operator: "+", number: 3, label: "C" },
      ];
      expect(calculateEquation(tiles2)).toBe(8);

      // Test case 3: Invalid division (non-integer result)
      const tiles3: [Tile, Tile, Tile] = [
        { operator: "+", number: 10, label: "A" },
        { operator: "/", number: 3, label: "B" },
        { operator: "+", number: 2, label: "C" },
      ];
      expect(calculateEquation(tiles3)).toBe(INVALID_RESULT);

      // Test case 4: Division by larger number (result < 1)
      const tiles4: [Tile, Tile, Tile] = [
        { operator: "+", number: 5, label: "A" },
        { operator: "/", number: 10, label: "B" },
        { operator: "+", number: 2, label: "C" },
      ];
      expect(calculateEquation(tiles4)).toBe(INVALID_RESULT);

      // Test case 5: Multiple divisions with non-integer intermediate result
      const tiles5: [Tile, Tile, Tile] = [
        { operator: "+", number: 20, label: "A" },
        { operator: "/", number: 2, label: "B" },
        { operator: "/", number: 3, label: "C" },
      ];
      expect(calculateEquation(tiles5)).toBe(INVALID_RESULT);
    });

    it("should handle operator precedence", () => {
      // Test case 1: Multiplication before addition
      const tiles1: [Tile, Tile, Tile] = [
        { operator: "+", number: 5, label: "A" },
        { operator: "+", number: 3, label: "B" },
        { operator: "*", number: 2, label: "C" },
      ];
      expect(calculateEquation(tiles1)).toBe(11);

      // Test case 2: Division before subtraction
      const tiles2: [Tile, Tile, Tile] = [
        { operator: "+", number: 20, label: "A" },
        { operator: "/", number: 4, label: "B" },
        { operator: "-", number: 2, label: "C" },
      ];
      expect(calculateEquation(tiles2)).toBe(3);

      // Test case 3: Complex precedence with invalid division
      const tiles3: [Tile, Tile, Tile] = [
        { operator: "+", number: 15, label: "A" },
        { operator: "/", number: 2, label: "B" },
        { operator: "*", number: 3, label: "C" },
      ];
      expect(calculateEquation(tiles3)).toBe(INVALID_RESULT);
    });

    it("should return -1 if the result is not an integer", () => {
      const tiles: [Tile, Tile, Tile] = [
        { operator: "+", number: 10, label: "A" },
        { operator: "/", number: 3, label: "B" },
        { operator: "+", number: 2, label: "C" },
      ];
      expect(calculateEquation(tiles)).toBe(INVALID_RESULT);
    });
  });

  describe("calculateEquationRaw", () => {
    it("should correctly calculate AGB scenario (15 + (-9) + 9 = 15)", () => {
      // This test specifically addresses the bug found in the screenshot
      // where AGB (A=+15, G=-9, B=+9) was calculating to 0.67 instead of 15
      const tiles: [Tile, Tile, Tile] = [
        { operator: "+", number: 15, label: "A" },
        { operator: "-", number: 9, label: "G" },
        { operator: "+", number: 9, label: "B" },
      ];
      expect(calculateEquationRaw(tiles)).toBe(15);
    });

    it("should handle simple addition and subtraction", () => {
      const tiles1: [Tile, Tile, Tile] = [
        { operator: "+", number: 10, label: "A" },
        { operator: "-", number: 3, label: "B" },
        { operator: "+", number: 5, label: "C" },
      ];
      expect(calculateEquationRaw(tiles1)).toBe(12);
    });

    it("should handle order of operations with multiplication", () => {
      // 5 + 3 * 2 = 5 + 6 = 11
      const tiles1: [Tile, Tile, Tile] = [
        { operator: "+", number: 5, label: "A" },
        { operator: "+", number: 3, label: "B" },
        { operator: "*", number: 2, label: "C" },
      ];
      expect(calculateEquationRaw(tiles1)).toBe(11);
    });

    it("should handle decimal results", () => {
      // 10 / 3 + 2 = 3.33 + 2 = 5.33
      const tiles1: [Tile, Tile, Tile] = [
        { operator: "+", number: 10, label: "A" },
        { operator: "/", number: 3, label: "B" },
        { operator: "+", number: 2, label: "C" },
      ];
      expect(calculateEquationRaw(tiles1)).toBe(5.33);
    });
  });

  describe("generateGameState", () => {
    it("should generate a valid game state", () => {
      const gameState = generateGameState();

      expect(gameState).toHaveProperty("tiles");
      expect(gameState).toHaveProperty("targetNumber");
      expect(gameState).toHaveProperty("validEquations");

      expect(gameState.tiles).toHaveLength(10);
      expect(gameState.validEquations.length).toBeGreaterThanOrEqual(0);

      // Verify that all valid equations result in the target number
      for (const equation of gameState.validEquations) {
        expect(equation.result).toBe(gameState.targetNumber);
      }
    });

    it("should generate a target number between 1 and 20", () => {
      // Generate multiple game states to ensure the constraint is consistently met
      for (let i = 0; i < 10; i++) {
        const gameState = generateGameState();
        expect(gameState.targetNumber).toBeGreaterThanOrEqual(1);
        expect(gameState.targetNumber).toBeLessThanOrEqual(20);

        // Also verify that all valid equations result in numbers between 1 and 20
        for (const equation of gameState.validEquations) {
          expect(equation.result).toBeGreaterThanOrEqual(1);
          expect(equation.result).toBeLessThanOrEqual(20);
        }
      }
    });

    it("should respect human-friendly constraints", () => {
      // Generate multiple game states to test constraints
      for (let i = 0; i < 10; i++) {
        const gameState = generateGameState();

        // Count operator types
        const multiplyTiles = gameState.tiles.filter(
          (t) => t.operator === "*",
        ).length;
        const divideTiles = gameState.tiles.filter(
          (t) => t.operator === "/",
        ).length;
        const bigNumberTiles = gameState.tiles.filter(
          (t) => t.number >= 10,
        ).length;

        // Test constraints
        expect(multiplyTiles).toBeLessThanOrEqual(2);
        expect(divideTiles).toBeLessThanOrEqual(2);
        expect(bigNumberTiles).toBeLessThanOrEqual(3);

        // Verify all tiles have valid properties
        for (const tile of gameState.tiles) {
          expect(tile.number).toBeGreaterThanOrEqual(1);
          expect(tile.number).toBeLessThanOrEqual(20);
          expect(["+", "-", "*", "/"]).toContain(tile.operator);
          expect(tile.label).toMatch(/^[A-J]$/);
        }
      }
    });

    it("should generate tiles with correct labels A-J", () => {
      const gameState = generateGameState();
      const expectedLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

      expect(gameState.tiles).toHaveLength(10);
      for (let i = 0; i < gameState.tiles.length; i++) {
        expect(gameState.tiles[i].label).toBe(expectedLabels[i]);
      }
    });
  });
});
