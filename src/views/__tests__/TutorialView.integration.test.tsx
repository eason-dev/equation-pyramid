import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useTutorialStore } from "@/logic/state/tutorialStore";
import TutorialView from "../TutorialView";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock audio hooks
jest.mock("@/hooks/useAudio", () => ({
  useAudio: () => ({
    play: jest.fn(),
    pause: jest.fn(),
    isPlaying: false,
    volume: 0.3,
    setVolume: jest.fn(),
  }),
}));

jest.mock("@/hooks/useButtonSound", () => ({
  useButtonSound: () => ({
    playButtonSound: jest.fn(),
  }),
}));

describe("TutorialView Integration", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();

    // Reset tutorial store
    const store = useTutorialStore.getState();
    store.reset();
  });

  it("completes full tutorial flow", async () => {
    render(<TutorialView />);

    // Stage 1: Introduction
    expect(screen.getByText("Equation Pyramid")).toBeInTheDocument();
    expect(screen.getByText("Start Tutorial")).toBeInTheDocument();

    // Click start tutorial
    fireEvent.click(screen.getByText("Start Tutorial"));

    await waitFor(() => {
      expect(screen.getByText("Basic Equation")).toBeInTheDocument();
    });

    // Stage 2: Guided Demo - Basic Addition
    expect(
      screen.getByText("Select tiles to make 6. Try: 2 + 3 + 1"),
    ).toBeInTheDocument();

    // Select tiles in correct order
    const store = useTutorialStore.getState();
    act(() => {
      store.selectTile(store.tiles[0]); // 2
      store.selectTile(store.tiles[1]); // 3
      store.selectTile(store.tiles[2]); // 1
    });

    // Wait for auto-progression
    await waitFor(
      () => {
        expect(screen.getByText("First Operator Rule")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Continue through guided scenarios
    const scenarios = [
      "First Operator Rule",
      "Math Order",
      "Wrong Answers",
      "Your Turn!",
    ];

    for (let i = 0; i < scenarios.length - 1; i++) {
      // Complete each scenario
      act(() => {
        const state = useTutorialStore.getState();
        // Select all tiles to complete the scenario
        if (state.tiles.length >= 3) {
          state.selectTile(state.tiles[0]);
          state.selectTile(state.tiles[1]);
          state.selectTile(state.tiles[2]);
        }
      });

      // Wait for next scenario
      if (i < scenarios.length - 2) {
        await waitFor(
          () => {
            expect(screen.getByText(scenarios[i + 1])).toBeInTheDocument();
          },
          { timeout: 3000 },
        );
      }
    }

    // Complete free exploration to move to practice
    act(() => {
      const state = useTutorialStore.getState();
      // Find a valid equation
      const validEq = state.validEquations?.[0];
      if (validEq) {
        validEq.forEach((tile) => state.selectTile(tile));
      } else {
        // Fallback - select any 3 tiles
        state.selectTile(state.tiles[0]);
        state.selectTile(state.tiles[1]);
        state.selectTile(state.tiles[2]);
      }
    });

    // Wait for practice mode
    await waitFor(
      () => {
        expect(screen.getByText("Practice Game")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Stage 3: Practice Mode
    expect(
      screen.getByText("Find all 3 equations before time runs out!"),
    ).toBeInTheDocument();
    expect(screen.getByText("0/3")).toBeInTheDocument();

    // Find all 3 equations
    act(() => {
      const state = useTutorialStore.getState();
      state.validEquations.forEach((equation, index) => {
        equation.forEach((tile) => state.selectTile(tile));

        // Reset selection between equations
        if (index < state.validEquations.length - 1) {
          jest.advanceTimersByTime(1100);
        }
      });
    });

    // Wait for completion
    await waitFor(
      () => {
        expect(screen.getByText("Tutorial Complete!")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Click start game
    fireEvent.click(screen.getByText("Start"));

    expect(mockPush).toHaveBeenCalledWith("/?showSettings=true");
  });

  it("handles timer expiration in practice mode", async () => {
    render(<TutorialView />);

    // Skip to practice mode
    act(() => {
      const store = useTutorialStore.getState();
      store.startPractice();
    });

    expect(screen.getByText("Practice Game")).toBeInTheDocument();

    // Simulate timer running out
    act(() => {
      const store = useTutorialStore.getState();
      store.updatePracticeTimer(0);
    });

    await waitFor(() => {
      expect(screen.getByText("Tutorial Complete!")).toBeInTheDocument();
    });
  });

  it("shows hints after 10 seconds of inactivity", async () => {
    render(<TutorialView />);

    // Skip to practice mode
    act(() => {
      const store = useTutorialStore.getState();
      store.startPractice();
    });

    // Simulate 10 seconds passing
    act(() => {
      const store = useTutorialStore.getState();
      store.updateHintTimer(10);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Hint: Look for highlighted tiles!"),
      ).toBeInTheDocument();
    });
  });

  it("enforces correct tile selection in guided mode", async () => {
    render(<TutorialView />);

    // Skip to guided mode
    act(() => {
      const store = useTutorialStore.getState();
      store.startGuided();
    });

    expect(screen.getByText("Basic Equation")).toBeInTheDocument();

    // Try to select wrong tile
    act(() => {
      const store = useTutorialStore.getState();
      store.selectTile(store.tiles[1]); // Should select tile[0] first
    });

    await waitFor(() => {
      expect(
        screen.getByText("Try selecting the highlighted tile"),
      ).toBeInTheDocument();
    });
  });

  it("tracks score correctly in practice mode", async () => {
    render(<TutorialView />);

    // Skip to practice mode
    act(() => {
      const store = useTutorialStore.getState();
      store.startPractice();
    });

    expect(screen.getByText("Score:")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();

    // Submit a correct equation
    act(() => {
      const store = useTutorialStore.getState();
      const validEq = store.validEquations[0];
      validEq.forEach((tile) => store.selectTile(tile));
    });

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument(); // Score increased
    });

    // Wait for reset
    await act(async () => {
      jest.advanceTimersByTime(1100);
    });

    // Submit a wrong equation
    act(() => {
      const store = useTutorialStore.getState();
      // Select tiles that don't form a valid equation
      store.selectTile(store.tiles[7]);
      store.selectTile(store.tiles[8]);
      store.selectTile(store.tiles[9]);
    });

    await waitFor(() => {
      expect(screen.getByText("-1")).toBeInTheDocument(); // Score decreased
    });
  });
});
