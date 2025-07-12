# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm storybook` - Run Storybook for component development

### Code Quality
- `pnpm lint` - Run Biome linter checks
- `pnpm lint:fix` - Auto-fix linting issues with Biome

### Testing
- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate test coverage report
- Run single test: `pnpm test -- path/to/test.test.ts`

## Architecture

### Game Flow State Machine
The game follows a strict state flow managed by Zustand:
```
Menu → Config → Game → Guessing → ShowingResult → RoundOver → GameOver
```

### Core Systems

**State Management**: Zustand store at `src/logic/state/game-state.tsx` with Immer middleware for immutable updates. Game state includes:
- Player configurations and scores
- Current game phase and round
- Selected tiles and equation validation
- Sound settings

**Game Logic**: Located in `src/logic/game/` with:
- `equation-builder.ts` - Core equation validation and scoring
- `tile-generator.ts` - Generates number and operator tiles
- `game-types.ts` - TypeScript types for game entities

**Audio System**: Custom hooks in `src/hooks/` manage different audio tracks:
- `useAudioManager` - Coordinates all game audio
- Separate hooks for menu, game, and result music
- Fade transitions between tracks

**Visual Components**: 
- Views in `src/views/` correspond to game states
- Components in `src/components/` with Storybook stories
- WebGL background shader effects
- GSAP animations for transitions

### Testing Strategy
- Component tests use React Testing Library
- Game logic has unit tests
- Storybook for visual testing
- Mock Zustand store for isolated testing

## Key Patterns

- Always use `pnpm` as package manager
- Use Context7 MCP for library documentation (Next.js, React, etc.)
- Prefer Biome for formatting (double quotes configured)
- Path alias `@/*` maps to `src/*`
- TypeScript strict mode is enabled
- Tests go in `__tests__` directories
- Storybook stories alongside components as `.stories.tsx`

## Project Analysis

### Overview
Equation Pyramid is a web-based mathematical puzzle game built with Next.js 15 and React 19. Players form equations using tiles to reach target numbers through a state-driven UI.

### Technology Stack
- **Frontend**: Next.js 15.3.2, React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Graphics**: Three.js/React Three Fiber for WebGL shader backgrounds
- **Animation**: GSAP for tile animations
- **State Management**: Zustand with Immer middleware
- **Testing**: Jest (83.45% coverage) + Vitest for Storybook
- **Development**: Biome for linting/formatting, pnpm for package management

### Game Mechanics
- **Tile System**: 10 tiles per round with numbers (1-15) and operators (+, -, *, /)
- **Constraints**: Max 2 multiply/divide tiles, max 3 tiles ≥10, no duplicates
- **Equation Building**: Select 3 tiles to form equations following math order of operations
- **Scoring**: +1 for correct, -1 for incorrect/duplicate/timeout
- **Target Number**: Most frequent result from all valid tile combinations

### Architecture Patterns
1. **State Machine Flow**: Menu → Config → Game → Guessing → ShowingResult → RoundOver → GameOver
2. **View/Component Separation**: Views orchestrate state, components are reusable UI
3. **3-Column Game Layout**: Answers (left), Tiles/Guessing (center), Target (right)
4. **Audio Integration**: Custom hooks manage background music and sound effects
5. **Component Hierarchy**: 4 main views, 20+ reusable components

### Key Files Reference
- **Game Logic**: `src/logic/game/logic.ts` - Equation calculation and validation
- **State Store**: `src/logic/state/gameStore.ts` - Zustand store implementation
- **Main Views**: `src/views/` - HomeView, GameSettingsView, GamePlayingView, GameOverView
- **Core Components**: `src/components/` - Tile, TileList, TargetTile, AnswersTile, etc.

### Quality Metrics
- **Test Coverage**: 83.45% statements, 82.57% branches, 77.04% functions
- **Documentation**: Comprehensive with CLAUDE.md and Storybook stories
- **Type Safety**: TypeScript strict mode enabled
- **Code Style**: Enforced by Biome with consistent formatting

### Development Workflow
1. Run `pnpm dev` for development with hot reload
2. Use `pnpm storybook` for component development
3. Test with `pnpm test` and check coverage with `pnpm test:coverage`
4. Lint code with `pnpm lint` and auto-fix with `pnpm lint:fix`

### Areas for Enhancement
- Add component unit tests beyond Storybook stories
- Implement E2E testing with Playwright
- Fix 4 currently failing tests
- Add tests for custom hooks (audio management)
- Consider performance monitoring for animations