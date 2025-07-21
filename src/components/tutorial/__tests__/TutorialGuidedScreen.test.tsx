import { render, screen } from "@testing-library/react";
import { useTutorialStore } from "@/logic/state/tutorialStore";
import TutorialGuidedScreen from "../TutorialGuidedScreen";

// Mock the tutorial store
jest.mock("@/logic/state/tutorialStore");

describe("TutorialGuidedScreen", () => {
  const mockSelectTile = jest.fn();
  const mockUnselectTile = jest.fn();

  const defaultStoreState = {
    guidedScenario: "basic-addition",
    tiles: [
      { label: "A", number: 2, operator: "+" },
      { label: "B", number: 3, operator: "+" },
      { label: "C", number: 1, operator: "+" },
    ],
    selectedTiles: [],
    targetNumber: 6,
    expectedTiles: [
      { label: "A", number: 2, operator: "+" },
      { label: "B", number: 3, operator: "+" },
      { label: "C", number: 1, operator: "+" },
    ],
    showError: false,
    errorMessage: "",
    showSuccess: false,
    selectTile: mockSelectTile,
    unselectTile: mockUnselectTile,
  };

  beforeEach(() => {
    (useTutorialStore as jest.Mock).mockReturnValue(defaultStoreState);
    mockSelectTile.mockClear();
    mockUnselectTile.mockClear();
  });

  it("renders scenario title and subtitle", () => {
    render(<TutorialGuidedScreen />);

    expect(screen.getByText("Basic Equation")).toBeInTheDocument();
    expect(
      screen.getByText("Select tiles in order to form an equation"),
    ).toBeInTheDocument();
  });

  it("renders scenario-specific instructions", () => {
    render(<TutorialGuidedScreen />);

    expect(
      screen.getByText("Select tiles to make 6. Try: 2 + 3 + 1"),
    ).toBeInTheDocument();
  });

  it("renders tiles, equation, and target sections", () => {
    render(<TutorialGuidedScreen />);

    expect(screen.getByText("Tiles")).toBeInTheDocument();
    expect(screen.getByText("Equation")).toBeInTheDocument();
    expect(screen.getByText("Target")).toBeInTheDocument();
  });

  it("highlights next expected tile", () => {
    render(<TutorialGuidedScreen />);

    // First tile should be highlighted
    const tiles = screen.getAllByTestId(/^tile-/);
    expect(tiles[0]).toHaveClass("highlighted");
  });

  it("shows error message when wrong", () => {
    (useTutorialStore as jest.Mock).mockReturnValue({
      ...defaultStoreState,
      showError: true,
      errorMessage: "Try selecting the highlighted tile",
    });

    render(<TutorialGuidedScreen />);

    expect(
      screen.getByText("Try selecting the highlighted tile"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Try selecting the highlighted tile").parentElement,
    ).toHaveClass("bg-red-500/20");
  });

  it("shows success message when correct", () => {
    (useTutorialStore as jest.Mock).mockReturnValue({
      ...defaultStoreState,
      showSuccess: true,
    });

    render(<TutorialGuidedScreen />);

    expect(screen.getByText("Correct! Well done!")).toBeInTheDocument();
    expect(screen.getByText("Correct! Well done!").parentElement).toHaveClass(
      "bg-green-500/20",
    );
  });

  it("renders different scenarios correctly", () => {
    const scenarios = [
      {
        scenario: "first-operator",
        title: "First Operator Rule",
        instruction: "4⁻ + 2⁺ - 3 = 3 (The minus on 4 is ignored!)",
      },
      {
        scenario: "order-of-operations",
        title: "Math Order",
        instruction: "2 + 3 × 2 = 8 (Multiplication happens first!)",
      },
      {
        scenario: "error-case",
        title: "Wrong Answers",
        instruction: "Try selecting any combination - it won't equal 6!",
      },
      {
        scenario: "free-exploration",
        title: "Your Turn!",
        instruction: "Find any valid equation that equals 6!",
      },
    ];

    scenarios.forEach(({ scenario, title, instruction }) => {
      (useTutorialStore as jest.Mock).mockReturnValue({
        ...defaultStoreState,
        guidedScenario: scenario,
      });

      const { rerender } = render(<TutorialGuidedScreen />);

      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(instruction)).toBeInTheDocument();

      rerender(<TutorialGuidedScreen />);
    });
  });

  it("shows progress indicator for guided stage", () => {
    render(<TutorialGuidedScreen />);

    const progressDots = screen.getAllByTestId(/progress-dot/);
    expect(progressDots).toHaveLength(3);
    expect(progressDots[1]).toHaveClass("bg-white"); // Second dot should be active
  });

  it("applies fade-in animation on scenario change", () => {
    const { rerender } = render(<TutorialGuidedScreen />);

    // Change scenario
    (useTutorialStore as jest.Mock).mockReturnValue({
      ...defaultStoreState,
      guidedScenario: "first-operator",
    });

    rerender(<TutorialGuidedScreen />);

    const content = screen.getByTestId("scenario-content");
    expect(content).toHaveClass("transition-all");
  });
});
