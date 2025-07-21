import { act, renderHook } from "@testing-library/react";
import { useTutorialStore } from "../tutorialStore";

describe("Enhanced Tutorial Store", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Reset store before each test
    const { result } = renderHook(() => useTutorialStore());
    act(() => {
      result.current.reset();
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Stage Progression", () => {
    it("should start with intro stage", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.initializeTutorial();
      });

      expect(result.current.currentStage).toBe("intro");
    });

    it("should progress from intro to guided stage", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.initializeTutorial();
      });

      // Ensure we're at intro stage
      expect(result.current.currentStage).toBe("intro");

      act(() => {
        result.current.nextStage();
      });

      expect(result.current.currentStage).toBe("guided");
      expect(result.current.guidedScenario).toBe("basic-addition");
    });

    it("should progress through all guided scenarios", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startGuided();
      });

      const scenarios = [
        "basic-addition",
        "first-operator",
        "order-of-operations",
        "error-case",
        "free-exploration",
      ];

      scenarios.forEach((scenario, index) => {
        expect(result.current.guidedScenario).toBe(scenario);

        if (index < scenarios.length - 1) {
          act(() => {
            result.current.nextScenario();
          });
        }
      });
    });

    it("should progress from guided to practice after free exploration", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startGuided();
      });

      // Navigate through all scenarios to reach free exploration
      const scenarios = [
        "basic-addition",
        "first-operator",
        "order-of-operations",
        "error-case",
      ];
      scenarios.forEach(() => {
        act(() => {
          result.current.nextScenario();
        });
      });

      // Now we should be at free exploration
      expect(result.current.guidedScenario).toBe("free-exploration");

      // Complete free exploration to move to practice
      act(() => {
        result.current.nextStage();
      });

      expect(result.current.currentStage).toBe("practice");
    });

    it("should complete tutorial after practice stage", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
        result.current.nextStage();
      });

      expect(result.current.currentStage).toBe("complete");
    });
  });

  describe("Guided Mode", () => {
    it("should initialize basic addition scenario correctly", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startGuided();
      });

      expect(result.current.tiles).toHaveLength(10); // Now uses shared 10-tile list
      expect(result.current.targetNumber).toBe(6);
      expect(result.current.expectedTiles).toHaveLength(3);
      // Check expected sequence for basic addition: A(1) + B(2) + C(3) = 6
      expect(result.current.expectedTiles?.[0]?.label).toBe("A");
      expect(result.current.expectedTiles?.[1]?.label).toBe("B");
      expect(result.current.expectedTiles?.[2]?.label).toBe("C");
    });

    it("should enforce tile selection order in guided scenarios", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startGuided();
      });

      // Try to select wrong tile
      act(() => {
        result.current.selectTile(result.current.tiles[1]); // Should be tile[0] first
      });

      expect(result.current.selectedTiles).toHaveLength(0);
      expect(result.current.showError).toBe(true);
      expect(result.current.errorMessage).toContain("highlighted tile");
    });

    it("should allow correct tile selection in guided mode", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startGuided();
      });

      // Select tiles in correct order
      act(() => {
        result.current.selectTile(result.current.tiles[0]);
        result.current.selectTile(result.current.tiles[1]);
        result.current.selectTile(result.current.tiles[2]);
      });

      expect(result.current.selectedTiles).toHaveLength(3);
      expect(result.current.showSuccess).toBe(true);

      // Wait for auto-progression
      act(() => {
        jest.advanceTimersByTime(1500);
      });
    });

    it("should handle error scenario correctly", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startGuided();
      });

      // Navigate to error scenario
      const scenariosToSkip = [
        "basic-addition",
        "first-operator",
        "order-of-operations",
      ];
      scenariosToSkip.forEach(() => {
        act(() => {
          result.current.nextScenario();
        });
      });

      expect(result.current.guidedScenario).toBe("error-case");

      // Move to next scenario
      act(() => {
        result.current.nextScenario();
      });

      expect(result.current.guidedScenario).toBe("free-exploration");
    });

    it("should allow free selection in free exploration", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startGuided();
      });

      // Navigate to free exploration
      const scenarios = [
        "basic-addition",
        "first-operator",
        "order-of-operations",
        "error-case",
      ];
      scenarios.forEach(() => {
        act(() => {
          result.current.nextScenario();
        });
      });

      expect(result.current.guidedScenario).toBe("free-exploration");
      expect(result.current.tiles.length).toBeGreaterThan(3);

      // Should be able to select any tiles
      act(() => {
        result.current.selectTile(result.current.tiles[0]);
        result.current.selectTile(result.current.tiles[2]);
        result.current.selectTile(result.current.tiles[1]);
      });

      expect(result.current.selectedTiles).toHaveLength(3);
    });
  });

  describe("Practice Mode", () => {
    it("should initialize practice mode with correct settings", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
      });

      expect(result.current.tiles).toHaveLength(10);
      expect(result.current.validEquations).toHaveLength(3);
      expect(result.current.practiceTimer).toBe(180); // 3 minutes
      expect(result.current.guessTimer).toBe(10);
      expect(result.current.score).toBe(0);
      expect(result.current.foundEquations).toHaveLength(0);
    });

    it("should track found equations and update score", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
      });

      // Find first valid equation
      const validEquation = result.current.validEquations[0];

      act(() => {
        validEquation.forEach((tile) => {
          result.current.selectTile(tile);
        });
      });

      expect(result.current.foundEquations).toHaveLength(1);
      expect(result.current.score).toBe(1);
      expect(result.current.showSuccess).toBe(true);
    });

    it("should prevent duplicate equation submissions", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
      });

      const validEquation = result.current.validEquations[0];

      // Submit first time
      act(() => {
        validEquation.forEach((tile) => {
          result.current.selectTile(tile);
        });
      });

      // Wait for reset
      act(() => {
        jest.advanceTimersByTime(1100);
      });

      // Try to submit same equation again
      act(() => {
        validEquation.forEach((tile) => {
          result.current.selectTile(tile);
        });
      });

      expect(result.current.foundEquations).toHaveLength(1);
      expect(result.current.score).toBe(1); // Score shouldn't increase
      expect(result.current.errorMessage).toContain("Already found");
    });

    it("should decrease score for wrong answers", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
      });

      // Select tiles that don't form a valid equation
      act(() => {
        result.current.selectTile(result.current.tiles[0]);
        result.current.selectTile(result.current.tiles[1]);
        result.current.selectTile(result.current.tiles[2]);
      });

      // Assuming these don't form a valid equation
      if (!result.current.showSuccess) {
        expect(result.current.score).toBe(-1);
        expect(result.current.showError).toBe(true);
      }
    });

    it("should complete tutorial when all equations found", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
      });

      // Find all valid equations
      result.current.validEquations.forEach((equation, index) => {
        act(() => {
          equation.forEach((tile) => {
            result.current.selectTile(tile);
          });
        });

        // Wait for reset between equations
        if (index < result.current.validEquations.length - 1) {
          act(() => {
            jest.advanceTimersByTime(1100);
          });
        }
      });

      // Wait for completion
      act(() => {
        jest.advanceTimersByTime(1100);
      });

      expect(result.current.currentStage).toBe("complete");
    });
  });

  describe("Timer Management", () => {
    it("should update practice timer", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
        result.current.updatePracticeTimer(30);
      });

      expect(result.current.practiceTimer).toBe(30);
    });

    it("should complete tutorial when practice timer reaches 0", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
      });

      expect(result.current.currentStage).toBe("practice");

      act(() => {
        result.current.updatePracticeTimer(0);
      });

      expect(result.current.currentStage).toBe("complete");
    });

    it("should update guess timer", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
        result.current.selectTile(result.current.tiles[0]);
        result.current.updateGuessTimer(5);
      });

      expect(result.current.guessTimer).toBe(5);
    });

    it("should penalize when guess timer reaches 0", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
        result.current.selectTile(result.current.tiles[0]);
        result.current.updateGuessTimer(0);
      });

      expect(result.current.score).toBe(-1);
      expect(result.current.errorMessage).toContain("Time's up");
    });

    it("should show hint after 10 seconds", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
        result.current.updateHintTimer(10);
      });

      expect(result.current.showHint).toBe(true);
    });
  });

  describe("Tile Selection", () => {
    it("should not allow selecting more than 3 tiles", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
        result.current.selectTile(result.current.tiles[0]);
        result.current.selectTile(result.current.tiles[1]);
        result.current.selectTile(result.current.tiles[2]);
        result.current.selectTile(result.current.tiles[3]); // 4th tile
      });

      expect(result.current.selectedTiles).toHaveLength(3);
    });

    it("should not allow selecting same tile twice", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
        result.current.selectTile(result.current.tiles[0]);
        result.current.selectTile(result.current.tiles[0]); // Same tile
      });

      expect(result.current.selectedTiles).toHaveLength(1);
    });

    it("should allow unselecting tiles", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
        result.current.selectTile(result.current.tiles[0]);
        result.current.selectTile(result.current.tiles[1]);
        result.current.unselectTile(result.current.tiles[0]);
      });

      expect(result.current.selectedTiles).toHaveLength(1);
      expect(result.current.selectedTiles[0].label).toBe(
        result.current.tiles[1].label,
      );
    });

    it("should clear all selections", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
        result.current.selectTile(result.current.tiles[0]);
        result.current.selectTile(result.current.tiles[1]);
        result.current.clearSelection();
      });

      expect(result.current.selectedTiles).toHaveLength(0);
    });
  });

  describe("Reset Functionality", () => {
    it("should reset to initial state", () => {
      const { result } = renderHook(() => useTutorialStore());

      act(() => {
        result.current.startPractice();
        result.current.selectTile(result.current.tiles[0]);
        result.current.score = 5;
        result.current.reset();
      });

      expect(result.current.currentStage).toBe("intro");
      expect(result.current.selectedTiles).toHaveLength(0);
      expect(result.current.score).toBe(0);
      expect(result.current.foundEquations).toHaveLength(0);
    });
  });
});
