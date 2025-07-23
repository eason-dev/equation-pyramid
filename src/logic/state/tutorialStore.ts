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
    content: "",
    showTiles: true,
    selectedTiles: [0, 1], // Show tiles A and I selected
  },
  {
    id: 4,
    content: "Solve × and ÷ come before + and -",
    showTiles: true,
    selectedTiles: [0, 1, 2], // Show tiles A, I, J selected
    showResult: true,
    resultValue: 10,
    showEquation: "1 + 1 + 1",
  },
  {
    id: 5,
    title: "Scoring Rules",
    content: [
      "+1 → Get it right",
      "-1 → Get it wrong",
      "-1 → Say a correct answer that's already been used",
      "-1 → Hit the button but don't answer in 10 seconds",
    ],
    highlight: "score",
  },
  {
    id: 6,
    title: "Bonus tip",
    content: "It would be 2 to 5 answers in each round, try to find as many as possible.",
    highlight: "answers",
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