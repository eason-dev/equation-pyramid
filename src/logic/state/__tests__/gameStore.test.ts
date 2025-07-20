import { act, renderHook } from "@testing-library/react";
import { useGameStore } from "../gameStore";

// Mock the game logic functions
jest.mock("../../game/logic", () => ({
  generateGameState: jest.fn().mockReturnValue({
    tiles: [
      { operator: "+", number: 5, label: "A" },
      { operator: "+", number: 3, label: "B" },
      { operator: "+", number: 2, label: "C" },
    ],
    targetNumber: 10,
    validEquations: [],
  }),
  calculateEquation: jest.fn().mockReturnValue(10),
  calculateEquationRaw: jest.fn().mockReturnValue(10),
}));

describe("Game Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    // Reset the store state before each test
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.resetGame();
    });
  });

  it("should start in menu state", () => {
    const { result } = renderHook(() => useGameStore());
    expect(result.current.currentState).toBe("menu");
  });

  it("should transition from menu to config state", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
    });

    expect(result.current.currentState).toBe("config");
  });

  it("should update config with player count and rounds", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.updateConfig({ numPlayers: 2, numRounds: 2 });
    });

    expect(result.current.config.numPlayers).toBe(2);
    expect(result.current.config.numRounds).toBe(2);

    // Players are only created when startGame is called
    act(() => {
      result.current.startGame();
    });

    expect(result.current.players).toHaveLength(2);
    expect(result.current.players[0].name).toBe("Player 1");
    expect(result.current.players[1].name).toBe("Player 2");
  });

  it("should validate config limits", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.updateConfig({ numPlayers: 10, numRounds: 10 });
    });

    expect(result.current.config.numPlayers).toBe(2); // MAX_PLAYERS
    expect(result.current.config.numRounds).toBe(5); // MAX_ROUNDS
  });

  it("should start game and initialize first round", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.updateConfig({ numPlayers: 2, numRounds: 1 });
    });

    act(() => {
      result.current.startGame();
    });

    expect(result.current.currentState).toBe("game");
    expect(result.current.config.currentRound).toBe(1);
    expect(result.current.gameState).toBeTruthy();
    expect(result.current.selectedTiles).toHaveLength(0);
    expect(result.current.foundEquations).toHaveLength(0);
    expect(result.current.mainTimer).toBe(180);
    expect(result.current.guessTimer).toBe(10);
    expect(result.current.guessingPlayerId).toBeNull();
  });

  it("should handle tile selection", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.updateConfig({ numPlayers: 2, numRounds: 1 });
      result.current.startGame();
      result.current.startGuessing("player-1");
    });

    // Select first two tiles
    act(() => {
      result.current.selectTile(0);
      result.current.selectTile(1);
    });

    expect(result.current.selectedTiles).toEqual([0, 1]);

    // Select third tile - this should automatically submit the equation and clear selectedTiles
    act(() => {
      result.current.selectTile(2);
    });

    expect(result.current.selectedTiles).toEqual([]); // Tiles are cleared after equation submission
    expect(result.current.currentState).toBe("game"); // Back to game state
  });

  it("should transition to guessing state", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.updateConfig({ numPlayers: 2, numRounds: 1 });
      result.current.startGame();
    });

    act(() => {
      result.current.startGuessing("player-1");
    });

    expect(result.current.currentState).toBe("guessing");
    expect(result.current.guessTimer).toBe(10);
  });

  it("should handle player selection", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.updateConfig({ numPlayers: 2, numRounds: 1 });
      result.current.startGame();
      result.current.startGuessing("player-1");
    });

    expect(result.current.guessingPlayerId).toBe("player-1");
  });

  it("should handle correct equation guess", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.updateConfig({ numPlayers: 2, numRounds: 1 });
      result.current.startGame();
      result.current.startGuessing("player-1");
    });

    // Select tiles and check equation
    act(() => {
      result.current.selectTile(0);
      result.current.selectTile(1);
      result.current.selectTile(2);
      result.current.submitEquation();
    });

    expect(result.current.players[0].score).toBe(1); // Player 1 gets a point
    expect(result.current.selectedTiles).toHaveLength(0); // Tiles are cleared
    expect(result.current.foundEquations).toHaveLength(1); // Equation is recorded
    expect(result.current.currentState).toBe("game"); // Back to game state
  });

  it("should handle incorrect equation guess", () => {
    // Mock calculateEquation to return wrong result
    const { calculateEquation } = require("../../game/logic");
    calculateEquation.mockReturnValueOnce(15); // Wrong result

    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.updateConfig({ numPlayers: 2, numRounds: 1 });
      result.current.startGame();
      result.current.startGuessing("player-1");
    });

    // Select tiles and check equation
    act(() => {
      result.current.selectTile(0);
      result.current.selectTile(1);
      result.current.selectTile(2);
      result.current.submitEquation();
    });

    expect(result.current.players[0].score).toBe(0); // Player 1 score stays at 0 (no negative scores)
    expect(result.current.selectedTiles).toHaveLength(0); // Tiles are cleared
    expect(result.current.currentState).toBe("game"); // Back to game state
  });

  it("should handle round completion and transition to next round", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.updateConfig({ numPlayers: 2, numRounds: 2 });
      result.current.startGame();
    });

    act(() => {
      result.current.nextRound();
    });

    expect(result.current.currentState).toBe("game");
    expect(result.current.config.currentRound).toBe(2);
    expect(result.current.gameState).toBeTruthy();
    expect(result.current.selectedTiles).toHaveLength(0);
    expect(result.current.foundEquations).toHaveLength(0);
    expect(result.current.mainTimer).toBe(180);
    expect(result.current.guessTimer).toBe(10);
    expect(result.current.guessingPlayerId).toBeNull();
  });

  it("should handle game completion and show final results", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.updateConfig({ numPlayers: 2, numRounds: 1 });
      result.current.startGame();
    });

    // Complete the only round
    act(() => {
      result.current.nextRound();
    });

    expect(result.current.currentState).toBe("gameOver");
  });

  it("should allow continuing to config or exiting to menu from final result", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.updateConfig({ numPlayers: 2, numRounds: 1 });
      result.current.startGame();
      result.current.nextRound();
    });

    // Test continue to config
    act(() => {
      result.current.continueGame();
    });
    expect(result.current.currentState).toBe("config");

    // Test exit to menu
    act(() => {
      result.current.exitToMenu();
    });
    expect(result.current.currentState).toBe("menu");
  });

  it("should handle main timer countdown", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.updateConfig({ numPlayers: 2, numRounds: 1 });
      result.current.startGame();
    });

    expect(result.current.mainTimer).toBe(180);

    // Fast-forward timer
    act(() => {
      jest.advanceTimersByTime(5000); // 5 seconds
    });

    expect(result.current.mainTimer).toBe(175);
  });

  it("should handle guess timer countdown and return to game", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.updateConfig({ numPlayers: 2, numRounds: 1 });
      result.current.startGame();
      result.current.startGuessing("player-1");
    });

    expect(result.current.currentState).toBe("guessing");
    expect(result.current.guessTimer).toBe(10);

    // Fast-forward guess timer to completion
    act(() => {
      jest.advanceTimersByTime(10000); // 10 seconds
      jest.runOnlyPendingTimers();
    });

    expect(result.current.currentState).toBe("game");
    expect(result.current.guessingPlayerId).toBeNull();
    expect(result.current.selectedTiles).toHaveLength(0);
  });

  it("should transition to roundOver when main timer expires", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.updateConfig({ numPlayers: 2, numRounds: 1 });
      result.current.startGame();
    });

    // Fast-forward main timer to completion
    act(() => {
      jest.advanceTimersByTime(180000); // 180 seconds
      jest.runOnlyPendingTimers();
    });

    expect(result.current.currentState).toBe("roundOver");
    expect(result.current.mainTimer).toBe(0);
  });
});
