import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface TutorialStep {
  id: number;
  title?: string;
  content: string | string[];
  highlight?: "tiles" | "target" | "score" | "answers";
  showTiles?: boolean;
  selectedTiles?: number[];
  showResult?: boolean;
  resultValue?: number;
  showEquation?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    content: "Use three different tiles to form an equation that reaches the target number.",
    showTiles: true,
    highlight: "tiles",
  },
  {
    id: 2,
    content: "Ignore the operator on your first chosen tile.",
    showTiles: true,
    selectedTiles: [0], // Show tile A selected
  },
  {
    id: 3,
    content: "Solve × and ÷ come before + and -",
    showTiles: true,
    selectedTiles: [0, 8, 9], // Show tiles A, I, J selected
    showResult: true,
    resultValue: 11,
    showEquation: "1 + 2 × 5",
  },
  {
    id: 4,
    title: "Scoring Rules",
    content: [
      "+1 → Get it right",
      "-1 → Get it wrong",
      "-1 → Click a correct answer that's already been found",
      "-1 → Hit the button but don't answer in 10 seconds",
    ],
    highlight: "score",
  },
  {
    id: 5,
    title: "Bonus tip",
    content: [
      "Each round ends when you've found all the answers or when the 3-minute timer runs out.",
      "It would be 2 to 5 answers in each round, try to find as many as possible.",
    ],
  },
];

interface TutorialState {
  isActive: boolean;
  currentStep: number;
  hasCompletedTutorial: boolean;
}

interface TutorialActions {
  startTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  exitTutorial: () => void;
  exitTutorialWithoutCompletion: () => void;
  resetTutorial: () => void;
  skipToStep: (step: number) => void;
}

export const useTutorialStore = create<TutorialState & TutorialActions>()(
  immer((set) => ({
    isActive: false,
    currentStep: 1,
    hasCompletedTutorial: false,

    startTutorial: () =>
      set((state) => {
        state.isActive = true;
        state.currentStep = 1;
      }),

    nextStep: () =>
      set((state) => {
        if (state.currentStep < tutorialSteps.length) {
          state.currentStep += 1;
        } else {
          state.isActive = false;
          state.hasCompletedTutorial = true;
        }
      }),

    previousStep: () =>
      set((state) => {
        if (state.currentStep > 1) {
          state.currentStep -= 1;
        }
      }),

    exitTutorial: () =>
      set((state) => {
        state.isActive = false;
        state.hasCompletedTutorial = true;
      }),

    exitTutorialWithoutCompletion: () =>
      set((state) => {
        state.isActive = false;
        // Don't set hasCompletedTutorial to true
      }),

    resetTutorial: () =>
      set((state) => {
        state.currentStep = 1;
        state.isActive = false;
      }),

    skipToStep: (step: number) =>
      set((state) => {
        if (step >= 1 && step <= tutorialSteps.length) {
          state.currentStep = step;
        }
      }),
  }))
);

export { tutorialSteps };