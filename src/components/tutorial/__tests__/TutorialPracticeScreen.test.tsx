import { act, render, screen } from "@testing-library/react";
import { useTutorialStore } from "@/logic/state/tutorialStore";
import TutorialPracticeScreen from "../TutorialPracticeScreen";

// Mock the tutorial store
jest.mock("@/logic/state/tutorialStore");

describe("TutorialPracticeScreen", () => {
  const mockSelectTile = jest.fn();
  const mockUnselectTile = jest.fn();
  const mockUpdatePracticeTimer = jest.fn();
  const mockUpdateGuessTimer = jest.fn();
  const mockUpdateHintTimer = jest.fn();

  const defaultStoreState = {
    tiles: [
      { label: "A", number: 2, operator: "+" },
      { label: "B", number: 3, operator: "+" },
      { label: "C", number: 4, operator: "+" },
      { label: "D", number: 1, operator: "+" },
      { label: "E", number: 5, operator: "-" },
      { label: "F", number: 2, operator: "*" },
      { label: "G", number: 3, operator: "*" },
      { label: "H", number: 2, operator: "-" },
      { label: "I", number: 6, operator: "/" },
      { label: "J", number: 1, operator: "-" },
    ],
    selectedTiles: [],
    targetNumber: 6,
    practiceTimer: 180, // 3 minutes
    guessTimer: 10,
    score: 0,
    foundEquations: [],
    validEquations: [
      [
        { label: "A", number: 2, operator: "+" },
        { label: "B", number: 3, operator: "+" },
        { label: "D", number: 1, operator: "+" },
      ],
      [
        { label: "C", number: 4, operator: "+" },
        { label: "A", number: 2, operator: "+" },
        { label: "J", number: 1, operator: "-" },
      ],
      [
        { label: "I", number: 6, operator: "/" },
        { label: "F", number: 2, operator: "*" },
        { label: "H", number: 2, operator: "-" },
      ],
    ],
    showHint: false,
    showError: false,
    errorMessage: "",
    showSuccess: false,
    selectTile: mockSelectTile,
    unselectTile: mockUnselectTile,
    updatePracticeTimer: mockUpdatePracticeTimer,
    updateGuessTimer: mockUpdateGuessTimer,
    updateHintTimer: mockUpdateHintTimer,
  };

  beforeEach(() => {
    (useTutorialStore as jest.Mock).mockReturnValue(defaultStoreState);
    // @ts-expect-error - mocking getState for testing
    (useTutorialStore as jest.Mock).getState = jest.fn(() => defaultStoreState);
    mockSelectTile.mockClear();
    mockUnselectTile.mockClear();
    mockUpdatePracticeTimer.mockClear();
    mockUpdateGuessTimer.mockClear();
    mockUpdateHintTimer.mockClear();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("renders practice game header", () => {
    render(<TutorialPracticeScreen />);

    expect(screen.getByText("Practice Game")).toBeInTheDocument();
    expect(
      screen.getByText("Find all 3 equations before time runs out!"),
    ).toBeInTheDocument();
  });

  it("displays game stats correctly", () => {
    render(<TutorialPracticeScreen />);

    expect(screen.getByText("Time:")).toBeInTheDocument();
    expect(screen.getByText("3:00")).toBeInTheDocument(); // Timer shows 3 minutes
    expect(screen.getByText("Score:")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument(); // Score is 0
    expect(screen.getByText("Found:")).toBeInTheDocument();
    expect(screen.getByText("0/3")).toBeInTheDocument(); // 0 of 3 equations found
  });

  it("shows empty slots for unfound equations", () => {
    render(<TutorialPracticeScreen />);

    const emptySlots = screen.getAllByText("???");
    expect(emptySlots).toHaveLength(3); // All 3 equations are unfound
  });

  it("displays found equations", () => {
    (useTutorialStore as jest.Mock).mockReturnValue({
      ...defaultStoreState,
      foundEquations: [defaultStoreState.validEquations[0]],
    });

    render(<TutorialPracticeScreen />);

    expect(screen.getByText("2 3 1 = 6")).toBeInTheDocument();
    expect(screen.getAllByText("???")).toHaveLength(2); // 2 equations still unfound
  });

  it("shows guess timer when tiles are selected", () => {
    (useTutorialStore as jest.Mock).mockReturnValue({
      ...defaultStoreState,
      selectedTiles: [defaultStoreState.tiles[0]],
    });

    render(<TutorialPracticeScreen />);

    expect(screen.getByText("Guess:")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument(); // Guess timer shows 10 seconds
  });

  it("displays error message", () => {
    (useTutorialStore as jest.Mock).mockReturnValue({
      ...defaultStoreState,
      showError: true,
      errorMessage: "Wrong answer!",
    });

    render(<TutorialPracticeScreen />);

    expect(screen.getByText("Wrong answer!")).toBeInTheDocument();
    expect(screen.getByText("Wrong answer!").parentElement).toHaveClass(
      "bg-red-500/20",
    );
  });

  it("displays success message", () => {
    (useTutorialStore as jest.Mock).mockReturnValue({
      ...defaultStoreState,
      showSuccess: true,
    });

    render(<TutorialPracticeScreen />);

    expect(screen.getByText("Correct! Keep going!")).toBeInTheDocument();
    expect(screen.getByText("Correct! Keep going!").parentElement).toHaveClass(
      "bg-green-500/20",
    );
  });

  it("shows hint message", () => {
    (useTutorialStore as jest.Mock).mockReturnValue({
      ...defaultStoreState,
      showHint: true,
    });

    render(<TutorialPracticeScreen />);

    expect(
      screen.getByText("Hint: Look for highlighted tiles!"),
    ).toBeInTheDocument();
  });

  it("updates timers correctly", () => {
    jest.useFakeTimers();

    render(<TutorialPracticeScreen />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockUpdatePracticeTimer).toHaveBeenCalledWith(179);
    expect(mockUpdateHintTimer).toHaveBeenCalledWith(1);

    jest.useRealTimers();
  });

  it("updates guess timer when tiles selected", () => {
    jest.useFakeTimers();

    // @ts-expect-error - mocking getState for testing
    (useTutorialStore as jest.Mock).getState = jest.fn(() => ({
      ...defaultStoreState,
      selectedTiles: [defaultStoreState.tiles[0]],
      guessTimer: 10,
    }));

    render(<TutorialPracticeScreen />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockUpdateGuessTimer).toHaveBeenCalledWith(9);

    jest.useRealTimers();
  });

  it("highlights hint tiles correctly", () => {
    (useTutorialStore as jest.Mock).mockReturnValue({
      ...defaultStoreState,
      showHint: true,
    });

    render(<TutorialPracticeScreen />);

    // Should highlight tiles from first unfound equation
    const highlightedLabels = ["A", "B", "D"];

    // Check that highlighted tiles are passed to TutorialTileList
    const tileList = screen.getByTestId("tutorial-tile-list");
    expect(tileList).toHaveAttribute(
      "data-highlighted-tiles",
      highlightedLabels.join(","),
    );
  });

  it("shows progress indicator for practice stage", () => {
    render(<TutorialPracticeScreen />);

    const progressDots = screen.getAllByTestId(/progress-dot/);
    expect(progressDots).toHaveLength(3);
    expect(progressDots[2]).toHaveClass("bg-white"); // Third dot should be active
  });
});
