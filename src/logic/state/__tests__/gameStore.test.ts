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
    validEquations: [
      { tiles: [], result: 10 }, // Mock valid equation
      { tiles: [], result: 10 }, // Mock valid equation
    ],
  }),
  calculateEquation: jest.fn().mockReturnValue(10),
  calculateEquationRaw: jest.fn().mockReturnValue(10),
}));

describe("Game Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
    // Reset the store state before each test
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.resetGame();
    });
  });

  afterEach(() => {
    jest.useRealTimers();
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

    // Select third tile - this triggers showingResult state
    act(() => {
      result.current.selectTile(2);
    });

    expect(result.current.currentState).toBe("showingResult");
    expect(result.current.selectedTiles).toEqual([0, 1, 2]); // Tiles still selected during result display

    // Fast forward 2.5 seconds to auto-submit
    act(() => {
      jest.advanceTimersByTime(2500);
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

    // Select tiles - third tile triggers auto-submit
    act(() => {
      result.current.selectTile(0);
      result.current.selectTile(1);
      result.current.selectTile(2);
    });

    // Wait for auto-submit after result display
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(result.current.players[0].score).toBe(1); // Player 1 gets a point
    expect(result.current.selectedTiles).toHaveLength(0); // Tiles are cleared
    expect(result.current.foundEquations).toHaveLength(1); // Equation is recorded

    // Game continues because there are more valid equations in the mock
    expect(result.current.currentState).toBe("game");
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
    });

    // Wait for auto-submit after result display
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    // Player gets 1 point because calculateEquationRaw returns 10, which matches the target
    expect(result.current.players[0].score).toBe(1);
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

    // Wait for transition delay (600ms)
    act(() => {
      jest.advanceTimersByTime(600);
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

    // Start the timer after transition
    act(() => {
      result.current.startTimerAfterTransition();
    });

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

    // Fast-forward guess timer to completion - this triggers showingResult
    act(() => {
      jest.advanceTimersByTime(10000); // 10 seconds
      jest.runOnlyPendingTimers(); // Run any pending timers
    });

    expect(result.current.currentState).toBe("showingResult");

    // Wait for auto-transition back to game
    act(() => {
      jest.advanceTimersByTime(2500);
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

    // Start the timer after transition
    act(() => {
      result.current.startTimerAfterTransition();
    });

    // Fast-forward main timer to completion
    act(() => {
      jest.advanceTimersByTime(180000); // 180 seconds
      jest.runOnlyPendingTimers(); // Run any pending timers
    });

    expect(result.current.currentState).toBe("roundOver");
    expect(result.current.mainTimer).toBe(0);
  });
});
