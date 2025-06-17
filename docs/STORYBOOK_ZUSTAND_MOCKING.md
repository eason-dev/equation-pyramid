# Mocking Zustand Store in Storybook

This guide explains how to mock the `useGameStore` Zustand state in Storybook to show different UI states for the `GamePlayingView` component.

## Problem

The `GamePlayingView` component uses the `useGameStore` hook internally:

```typescript
const {
  currentState,
  selectedTiles,
  gameState,
  guessTimer,
  startGuessing,
  foundEquations,
  config,
  transitionToRoundOver,
} = useGameStore();
```

This means that even though Storybook stories pass props to the component, the component still reads from the actual Zustand store, making it difficult to test different UI states.

## Solutions

### 1. Module Mocking (Recommended for Jest/Vitest)

For test environments, you can mock the entire module:

```typescript
// At the top of your test file
import { vi } from "vitest";

// Mock the store module
vi.mock("@/logic/state/gameStore", () => ({
  useGameStore: vi.fn(),
}));

// In your test
import { useGameStore } from "@/logic/state/gameStore";
const mockUseGameStore = useGameStore as vi.MockedFunction<typeof useGameStore>;

beforeEach(() => {
  mockUseGameStore.mockReturnValue({
    currentState: "game",
    selectedTiles: [],
    gameState: mockGameState,
    // ... other store properties
  });
});
```

### 2. Storybook Decorator Approach

Create a decorator that provides different store states:

```typescript
// .storybook/decorators/withMockGameStore.tsx
import React from "react";
import type { Decorator } from "@storybook/react";
import { createMockGameStore } from "../mocks/gameStoreMock";

export const withMockGameStore: Decorator = (Story, context) => {
  const mockStoreOverrides = context.parameters?.mockGameStore || {};
  const mockStore = createMockGameStore(mockStoreOverrides);

  // This would require modifying the component or using a provider pattern
  return <Story />;
};
```

### 3. Component Refactoring (Best Long-term Solution)

Modify the `GamePlayingView` to accept store state as props:

```typescript
// GamePlayingView.tsx
interface GamePlayingViewProps {
  // Existing props...
  // Store state props (optional, defaults to hook)
  store?: {
    currentState?: GameAppState;
    selectedTiles?: number[];
    gameState?: GameState | null;
    // ... other store properties
  };
}

export function GamePlayingView({ store, ...props }: GamePlayingViewProps) {
  const hookStore = useGameStore();
  const storeState = store || hookStore;

  // Use storeState instead of destructuring from useGameStore
  const { currentState, selectedTiles, gameState } = storeState;

  // Rest of component...
}
```

Then in Storybook:

```typescript
// GamePlayingView.stories.tsx
export const GuessingState: Story = {
  args: {
    tiles: mockTiles,
    players: mockPlayers,
    store: {
      currentState: "guessing",
      selectedTiles: [0, 1, 2],
      guessTimer: 8,
    },
  },
};
```

### 4. Mock Store Utility

Use the provided mock utility:

```typescript
// Using the createMockGameStore utility
import { createMockGameStore } from "./__mocks__/gameStoreMock";

const mockStore = createMockGameStore({
  currentState: "guessing",
  selectedTiles: [0, 1, 2],
  guessTimer: 8,
});
```

## Available Mock Store States

The `createMockGameStore` function accepts partial overrides for any store property:

### Game States

- `currentState: 'menu' | 'config' | 'game' | 'guessing' | 'roundOver' | 'gameOver'`

### UI States Examples

#### Default Game State

```typescript
createMockGameStore(); // Uses all defaults
```

#### Guessing State

```typescript
createMockGameStore({
  currentState: "guessing",
  selectedTiles: [0, 1, 2],
  guessTimer: 8,
});
```

#### With Found Equations

```typescript
createMockGameStore({
  foundEquations: ["0,1,2", "3,4,5"],
});
```

#### Single Player Mode

```typescript
createMockGameStore({
  config: {
    numPlayers: 1,
    numRounds: 3,
    currentRound: 1,
  },
});
```

#### Multiple Rounds

```typescript
createMockGameStore({
  config: {
    numPlayers: 2,
    numRounds: 5,
    currentRound: 3,
  },
});
```

## Current Implementation

Currently, the stories use the actual store, which means they're all showing the default store state. To see different UI states, you would need to:

1. Manually manipulate the store state in the browser dev tools
2. Use the store actions to trigger state changes
3. Implement one of the mocking solutions above

## Recommended Next Steps

1. **Short-term**: Use the component refactoring approach (#3) as it's the cleanest and most maintainable
2. **Medium-term**: Set up proper Storybook decorators for consistent mocking across all stories
3. **Long-term**: Consider using a provider pattern for all Zustand stores to make testing easier

This approach will allow you to easily create stories that showcase:

- Different game states (menu, playing, guessing, game over)
- Various player configurations (single vs multiplayer)
- Different round configurations
- UI states with found equations
- Timer states (low time, expired)
- Error states and edge cases
