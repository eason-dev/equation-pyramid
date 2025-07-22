import { act, renderHook } from "@testing-library/react";
import { TILES_PER_EQUATION } from "@/constants";
import { useGameStore } from "@/logic/state/gameStore";

describe("GameStore - Immediate FoundEquations Update", () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useGameStore.getState().resetGame();
    });
  });

  it("should immediately update foundEquations when a correct equation is found", () => {
    const { result } = renderHook(() => useGameStore());

    // Start game
    act(() => {
      result.current.updateConfig({ numPlayers: 1, numRounds: 1 });
      result.current.startGame();
    });

    // Start guessing
    const playerId = result.current.players[0].id;
    act(() => {
      result.current.startGuessing(playerId);
    });

    // Get the game state and find a valid equation
    const gameState = result.current.gameState;
    const validEquation = gameState?.validEquations[0];

    if (!gameState || !validEquation) {
      throw new Error("Game state not properly initialized");
    }

    // Find the indices of the tiles that form the valid equation
    const tileIndices: number[] = [];
    validEquation.tiles.forEach((equationTile) => {
      const index = gameState.tiles.findIndex(
        (tile) =>
          tile.number === equationTile.number &&
          tile.label === equationTile.label,
      );
      if (index !== -1) {
        tileIndices.push(index);
      }
    });

    expect(tileIndices.length).toBe(TILES_PER_EQUATION);

    // Initially, foundEquations should be empty
    expect(result.current.foundEquations).toHaveLength(0);

    // Select tiles one by one
    act(() => {
      result.current.selectTile(tileIndices[0]);
    });
    expect(result.current.selectedTiles).toHaveLength(1);
    expect(result.current.foundEquations).toHaveLength(0);

    act(() => {
      result.current.selectTile(tileIndices[1]);
    });
    expect(result.current.selectedTiles).toHaveLength(2);
    expect(result.current.foundEquations).toHaveLength(0);

    // Select the third tile - this should trigger immediate update
    act(() => {
      result.current.selectTile(tileIndices[2]);
    });

    // After selecting the third tile:
    // 1. State should be "showingResult"
    expect(result.current.currentState).toBe("showingResult");

    // 2. foundEquations should be updated immediately
    expect(result.current.foundEquations).toHaveLength(1);
    expect(result.current.foundEquations[0].foundBy).toBe(playerId);

    // 3. Player score should be updated immediately
    expect(result.current.players[0].score).toBe(1);

    // 4. The equation should be marked as correct
    expect(result.current.isCurrentEquationCorrect).toBe(true);
  });

  it("should immediately deduct points for duplicate equations", () => {
    const { result } = renderHook(() => useGameStore());

    // Start game
    act(() => {
      result.current.updateConfig({ numPlayers: 1, numRounds: 1 });
      result.current.startGame();
    });

    const playerId = result.current.players[0].id;
    const gameState = result.current.gameState;
    const validEquation = gameState?.validEquations[0];

    if (!gameState || !validEquation) {
      throw new Error("Game state not properly initialized");
    }

    // Find the indices for the first valid equation
    const tileIndices: number[] = [];
    validEquation.tiles.forEach((equationTile) => {
      const index = gameState.tiles.findIndex(
        (tile) =>
          tile.number === equationTile.number &&
          tile.label === equationTile.label,
      );
      if (index !== -1) {
        tileIndices.push(index);
      }
    });

    // First, find the equation successfully
    act(() => {
      result.current.startGuessing(playerId);
      result.current.selectTile(tileIndices[0]);
      result.current.selectTile(tileIndices[1]);
      result.current.selectTile(tileIndices[2]);
    });

    expect(result.current.foundEquations).toHaveLength(1);
    expect(result.current.players[0].score).toBe(1);

    // Wait for auto-submit to complete
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    // Try to select the same equation again
    act(() => {
      result.current.startGuessing(playerId);
      result.current.selectTile(tileIndices[0]);
      result.current.selectTile(tileIndices[1]);
      result.current.selectTile(tileIndices[2]);
    });

    // Should still have only 1 found equation
    expect(result.current.foundEquations).toHaveLength(1);

    // Score should be deducted immediately for duplicate
    expect(result.current.players[0].score).toBe(0);

    // The equation should be marked as incorrect (duplicate)
    expect(result.current.isCurrentEquationCorrect).toBe(false);
  });
});
