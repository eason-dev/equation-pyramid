import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TutorialIntroScreen from "../TutorialIntroScreen";

describe("TutorialIntroScreen", () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
  });

  it("renders all introduction content", () => {
    render(<TutorialIntroScreen onNext={mockOnNext} />);

    expect(screen.getByText("Equation Pyramid")).toBeInTheDocument();
    expect(screen.getByText("A mathematical puzzle game")).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome! In Equation Pyramid/),
    ).toBeInTheDocument();
    expect(
      screen.getByText("This tutorial will teach you:"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("How to form equations using tiles"),
    ).toBeInTheDocument();
    expect(screen.getByText("Special rules for operators")).toBeInTheDocument();
    expect(
      screen.getByText("Game mechanics like timers and scoring"),
    ).toBeInTheDocument();
    expect(screen.getByText("Estimated time: 3-5 minutes")).toBeInTheDocument();
  });

  it("renders start tutorial button", () => {
    render(<TutorialIntroScreen onNext={mockOnNext} />);

    const button = screen.getByRole("button", { name: "Start Tutorial" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-white");
  });

  it("calls onNext when start button is clicked", () => {
    render(<TutorialIntroScreen onNext={mockOnNext} />);

    const button = screen.getByRole("button", { name: "Start Tutorial" });
    fireEvent.click(button);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it("shows progress indicator", () => {
    render(<TutorialIntroScreen onNext={mockOnNext} />);

    // Should show first dot as active (white) and others as inactive
    const progressDots = screen.getByTestId("progress-indicator").children;
    expect(progressDots).toHaveLength(3);
    expect(progressDots[0]).toHaveClass("bg-white");
    expect(progressDots[1]).toHaveClass("bg-white/40");
    expect(progressDots[2]).toHaveClass("bg-white/40");
  });

  it("applies fade-in animation", async () => {
    render(<TutorialIntroScreen onNext={mockOnNext} />);

    const content = screen.getByTestId("intro-content");

    // Initially should have opacity-0
    expect(content).toHaveClass("opacity-0");

    // After animation, should have opacity-100
    await waitFor(
      () => {
        expect(content).toHaveClass("opacity-100");
      },
      { timeout: 200 },
    );
  });

  it("renders bullet points with correct styling", () => {
    render(<TutorialIntroScreen onNext={mockOnNext} />);

    const bulletPoints = screen.getAllByText("•");
    expect(bulletPoints).toHaveLength(3);
    bulletPoints.forEach((bullet) => {
      expect(bullet).toHaveClass("text-white/60");
    });
  });
});
